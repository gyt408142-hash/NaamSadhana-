# Security Specification - NaamSadhana Firestore Rules

This security specification outlines the data invariants, threat model, and "Dirty Dozen" test payloads designed to protect NaamSadhana users' data and enforce robust data boundaries.

## 1. Data Invariants

1. **Owner Exclusivity (Identity)**: A user's profile can only be read, created, updated, or deleted by that specific authenticated user. There are no admin or public reads permitted for the `/users` collection.
2. **Key Integrity**: During a create operation, the user profile must contain exactly all required keys: `currentMantra`, `currentCount`, `goal`, `dailyCount`, `lifetimeCount`, `streak`, `lastChantedDate`, `mantraStats`, and `history`. No phantom or shadow fields are allowed.
3. **Mantra Validation**: `currentMantra` must be a valid map containing at least `id` (string <= 128 characters) and `name` (string <= 128 characters).
4. **Counter Boundaries**: `currentCount`, `goal`, `dailyCount`, `lifetimeCount`, and `streak` must be non-negative integers. `goal` must be greater than or equal to 1.
5. **String Boundary Restrictions**: String variables such as `lastChantedDate` must be string of size <= 32 to prevent memory/Denial of Wallet attacks.
6. **Immutable Core Identity**: A user cannot modify another user's document ID or hijack their record, nor can they alter fields through illegal updates (e.g. bypassing constraints).

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads must be explicitly rejected by the Firestore Security Rules:

### 1. The Shadow Field Injection (Integrity Attack)
An attacker tries to inject an unauthorized field like `isVerified` or `isAdmin` into their user record.
```json
{
  "currentMantra": { "id": "radhe-radhe", "name": "Radhe Radhe", "translation": "Eternal Love" },
  "currentCount": 0,
  "goal": 108,
  "dailyCount": 0,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "2026-07-01",
  "mantraStats": {},
  "history": [],
  "isAdmin": true
}
```

### 2. Missing Required Fields (Schema Bypass)
An attacker attempts to save an incomplete user profile missing the `history` and `mantraStats` properties.
```json
{
  "currentMantra": { "id": "radhe-radhe", "name": "Radhe Radhe" },
  "currentCount": 0,
  "goal": 108,
  "dailyCount": 0,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "2026-07-01"
}
```

### 3. Identity Hijacking (Cross-User Write)
User `victim_uid`'s record is targeted for modification by an authenticated user `attacker_uid`.
```json
// Written to path /users/victim_uid by attacker_uid
{
  "currentCount": 99999
}
```

### 4. Non-Integer Counter (Type Poisoning)
An attacker tries to write a string `"one-hundred"` to the `currentCount` field.
```json
{
  "currentMantra": { "id": "radhe-radhe", "name": "Radhe Radhe" },
  "currentCount": "one-hundred",
  "goal": 108,
  "dailyCount": 0,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "2026-07-01",
  "mantraStats": {},
  "history": []
}
```

### 5. Negative Goal Boundary (Value Poisoning)
An attacker tries to set their session `goal` to `-108`.
```json
{
  "currentMantra": { "id": "radhe-radhe", "name": "Radhe Radhe" },
  "currentCount": 0,
  "goal": -108,
  "dailyCount": 0,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "2026-07-01",
  "mantraStats": {},
  "history": []
}
```

### 6. Negative Count (Value Poisoning)
An attacker tries to write a negative value `-5` to the `dailyCount` field.
```json
{
  "currentMantra": { "id": "radhe-radhe", "name": "Radhe Radhe" },
  "currentCount": 0,
  "goal": 108,
  "dailyCount": -5,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "2026-07-01",
  "mantraStats": {},
  "history": []
}
```

### 7. Massive String Denial of Wallet Attack (Resource Poisoning)
An attacker submits a 10MB string as the `lastChantedDate` to exhaust database storage and trigger exorbitant costs.
```json
{
  "currentMantra": { "id": "radhe-radhe", "name": "Radhe Radhe" },
  "currentCount": 0,
  "goal": 108,
  "dailyCount": 0,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "A_VERY_LONG_10MB_STRING...",
  "mantraStats": {},
  "history": []
}
```

### 8. Invalid Unverified User Writing (Unverified Auth Check)
A standard user whose email is not verified attempts a write (if verified email constraints are required by rules).
```json
// Executed by user with email_verified == false
{
  "currentCount": 1
}
```

### 9. Illegal Mantra ID Structure (ID Poisoning Guard)
An attacker inputs special path characters `/` or invalid format in the mantra object ID.
```json
{
  "currentMantra": { "id": "radhe/../admin", "name": "Radhe Radhe" },
  "currentCount": 0,
  "goal": 108,
  "dailyCount": 0,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "2026-07-01",
  "mantraStats": {},
  "history": []
}
```

### 10. Malformed Chanting History (Type Pollution)
An attacker logs a history session with a string where an integer is expected, or missing fields.
```json
{
  "currentMantra": { "id": "radhe-radhe", "name": "Radhe Radhe" },
  "currentCount": 0,
  "goal": 108,
  "dailyCount": 0,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "2026-07-01",
  "mantraStats": {},
  "history": [
    {
      "id": "session-1",
      "mantraId": "radhe-radhe",
      "count": "malicious-string-instead-of-int"
    }
  ]
}
```

### 11. Custom Claims Spoofing (Claims Escalation)
An attacker attempts to read other users' documents by pretending to be an admin or utilizing custom claims that are not validated against db sources.
```json
// Attacker tries to GET /users/victim_uid with a client-supplied token property
```

### 12. Non-String Mantra Name (Type Poisoning)
An attacker sets the `currentMantra.name` property to a boolean `true`.
```json
{
  "currentMantra": { "id": "radhe-radhe", "name": true },
  "currentCount": 0,
  "goal": 108,
  "dailyCount": 0,
  "lifetimeCount": 0,
  "streak": 0,
  "lastChantedDate": "2026-07-01",
  "mantraStats": {},
  "history": []
}
```

---

## 3. Test Coverage Strategy
The companion `firestore.rules.test.ts` outlines how these payloads are automatically rejected.
