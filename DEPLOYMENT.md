# NaamSadhana Public Production Deployment Guide

This guide details the step-by-step process of deploying **NaamSadhana** to a public production environment using **Vercel**.

---

## Prerequisites
1. A [Vercel Account](https://vercel.com/) (Free hobby plan is perfect).
2. A [GitHub](https://github.com/), GitLab, or Bitbucket account.
3. Your Firebase project config values (found in `firebase-applet-config.json` or your Firebase Console).

---

## Step 1: Create vercel.json for Client-side SPA Routing
To ensure that refreshing on custom subpages like `/about`, `/privacy`, or `/terms` does not cause Vercel to return a `404 Not Found` error, we must instruct Vercel to route all subpaths back to `index.html`.

Vercel reads this from a `vercel.json` file in the root of your project:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
*(Note: This file is already created in the workspace for you.)*

---

## Step 2: Push your Code to GitHub
1. Create a new public or private repository on GitHub named `naamsadhana`.
2. Initialize and push your repository:
   ```bash
   git init
   git add .
   git commit -m "Initialize NaamSadhana for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/naamsadhana.git
   git push -u origin main
   ```

---

## Step 3: Deploy to Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** and select **Project**.
3. Import your `naamsadhana` repository from GitHub.
4. Keep the **Framework Preset** as **Vite** (Vercel automatically detects this).
5. Open the **Environment Variables** accordion and add the following keys from your `.env.example` file:

| Environment Variable | Value Example | Source |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | `AIzaSyAoFFEd...` | `firebase-applet-config.json` -> `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-app.firebaseapp.com` | `firebase-applet-config.json` -> `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `your-app-id` | `firebase-applet-config.json` -> `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-app.firebasestorage.app` | `firebase-applet-config.json` -> `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `1071210235061` | `firebase-applet-config.json` -> `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `1:10712...` | `firebase-applet-config.json` -> `appId` |
| `VITE_FIREBASE_DATABASE_ID` | `ai-studio-naamsadhana-...` | `firebase-applet-config.json` -> `firestoreDatabaseId` (or default) |

6. Click **Deploy**. Vercel will bundle and serve the app on a high-speed Edge CDN in under a minute!

---

## Step 4: Configure Firebase OAuth Redirect Domain (Google Login)
If you enable **Google Auth Sign-In**, Google requires you to authorize your deployed domain name:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your NaamSadhana project.
3. Go to **Build** > **Authentication** > **Settings** tab.
4. Scroll down to **Authorized domains**.
5. Click **Add domain** and enter your Vercel deployment domain name (e.g., `naamsadhana.vercel.app`).
6. Save. Google Sign-In is now fully secure and functional on production!

---

## PWA (Progressive Web App) Verification
Once deployed, open your live URL on a mobile device or desktop browser:
1. You will see an **Install App** button or install prompt in your browser address bar.
2. The application works beautifully in offline mode. If you turn off Wi-Fi or go into Airplane Mode, you can continue counting mantras and using the app shell without interruptions!
