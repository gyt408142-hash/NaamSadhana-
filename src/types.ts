export type MantraType = 'Radhe Radhe' | 'Shri Ram' | 'Hare Krishna' | 'Om Namah Shivaya' | 'Custom';

export interface Mantra {
  id: string;
  name: string;
  translation?: string;
  isCustom?: boolean;
}

export interface ChantingSession {
  id: string;
  mantraId: string;
  mantraName: string;
  count: number;
  goal: number;
  timestamp: number; // UTC timestamp
  synced: boolean;
}

export interface UserStats {
  lifetimeCount: number;
  dailyCount: number;
  streak: number;
  lastChantedDate: string; // YYYY-MM-DD
}

export interface MantraStats {
  [mantraId: string]: {
    count: number;
    lastChanted: number;
  };
}

export interface AppState {
  currentMantra: Mantra;
  currentCount: number;
  goal: number;
  dailyCount: number;
  lifetimeCount: number;
  streak: number;
  lastChantedDate: string; // YYYY-MM-DD
  mantraStats: MantraStats;
  history: ChantingSession[];
}
