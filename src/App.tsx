import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Vibrate, 
  VibrateOff, 
  Sparkles, 
  HelpCircle, 
  X, 
  BookOpen, 
  History, 
  Compass,
  AlertTriangle,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { auth, db, doc, setDoc, getDoc, onAuthStateChanged, signOut, getRedirectResult } from './firebase';
import Header from './components/Header';
import AuthScreen from './components/AuthScreen';
import MalaVisualizer from './components/MalaVisualizer';
import MantraSelector from './components/MantraSelector';
import GoalSetter from './components/GoalSetter';
import StatsPanel from './components/StatsPanel';
import AboutPage from './components/AboutPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import ContactPage from './components/ContactPage';
import OfflinePage from './components/OfflinePage';
import NotFoundPage from './components/NotFoundPage';
import Footer from './components/Footer';
import { Mantra, ChantingSession, AppState } from './types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Default initial state helper
const getInitialState = (): AppState => ({
  currentMantra: {
    id: 'radhe-radhe',
    name: 'Radhe Radhe',
    translation: 'राधे राधे • Eternal Devotion & Love'
  },
  currentCount: 0,
  goal: 108,
  dailyCount: 0,
  lifetimeCount: 0,
  streak: 0,
  lastChantedDate: '',
  mantraStats: {},
  history: []
});

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  // Theme and User states
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);

  // Chanting State
  const [state, setState] = useState<AppState>(getInitialState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);

  // Navigation: 'chant' | 'sadhana' | 'history'
  const [activeTab, setActiveTab] = useState<'chant' | 'sadhana'>('chant');
  const [showInstructions, setShowInstructions] = useState(false);

  // Router path-state support
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentRoute(path);
      // Scroll to top on navigation change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Custom Modal & Toast States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const triggerSuccessFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Sync Debouncing Reference
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Dark Mode CSS side-effects
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Handle Google Redirect Sign-In Results on Mount
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          triggerSuccessFeedback(`Welcome, ${result.user.displayName || 'Pilgrim'}! Signed in successfully via Google.`);
        }
      })
      .catch((err: any) => {
        if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
          console.warn('Google Sign-In is not configured for this domain yet. Guests and email/password sign-in will still work perfectly.');
        } else {
          console.error('Redirect sign-in error:', err);
        }
      });
  }, []);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          // Authenticated or guest user
          await loadUserData(currentUser.uid);
        } else {
          // Logged out
          setState(getInitialState());
          // Load fallback local stats if any
          const fallback = localStorage.getItem('naamsadhana_local_fallback');
          if (fallback) {
            try {
              setState(JSON.parse(fallback));
            } catch (e) {
              console.error('Error loading fallback local state:', e);
            }
          }
        }
      } catch (err) {
        console.error('Auth state change observer failed to complete fully:', err);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Loading User Data from Firestore
  const loadUserData = async (uid: string) => {
    try {
      setSyncing(true);
      const userRef = doc(db, 'users', uid);
      
      let docSnap;
      try {
        docSnap = await getDoc(userRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${uid}`);
        return;
      }

      if (docSnap.exists()) {
        const dbData = docSnap.data() as Partial<AppState>;
        
        // Merge DB data with default state structure
        const mergedState: AppState = {
          currentMantra: dbData.currentMantra || {
            id: 'radhe-radhe',
            name: 'Radhe Radhe',
            translation: 'राधे राधे • Eternal Devotion & Love'
          },
          currentCount: dbData.currentCount ?? 0,
          goal: dbData.goal ?? 108,
          dailyCount: dbData.dailyCount ?? 0,
          lifetimeCount: dbData.lifetimeCount ?? 0,
          streak: dbData.streak ?? 0,
          lastChantedDate: dbData.lastChantedDate || '',
          mantraStats: dbData.mantraStats || {},
          history: dbData.history || []
        };

        // Date / Streak validation on load
        const today = getTodayString();
        const yesterday = getYesterdayString();
        
        if (mergedState.lastChantedDate !== today) {
          // It's a new day! Verify streak
          if (mergedState.lastChantedDate === yesterday) {
            // Keep streak!
          } else if (mergedState.lastChantedDate !== '') {
            // Missed a day, reset streak to 0
            mergedState.streak = 0;
          }
          // Reset daily count for the new day
          mergedState.dailyCount = 0;
        }

        setState(mergedState);
        localStorage.setItem(`naamsadhana_state_${uid}`, JSON.stringify(mergedState));
      } else {
        // New user with no database record. Check local storage fallback first.
        const fallback = localStorage.getItem('naamsadhana_local_fallback');
        let initial = getInitialState();
        if (fallback) {
          try {
            initial = JSON.parse(fallback);
          } catch (e) {}
        }
        
        // Save initial to cloud so it exists
        try {
          await setDoc(userRef, initial);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
          return;
        }
        setState(initial);
      }
      setSyncError(false);
    } catch (e) {
      console.error('Error loading cloud user data:', e);
      setSyncError(true);
      // Load from local storage backup in offline state
      const localBackup = localStorage.getItem(`naamsadhana_state_${uid}`);
      if (localBackup) {
        try {
          setState(JSON.parse(localBackup));
        } catch (err) {}
      }
    } finally {
      setSyncing(false);
    }
  };

  // Debounced Cloud Sync Engine
  const queueCloudSync = (updatedState: AppState) => {
    // Save to local storage instantly for offline protection
    if (user) {
      localStorage.setItem(`naamsadhana_state_${user.uid}`, JSON.stringify(updatedState));
    } else {
      localStorage.setItem('naamsadhana_local_fallback', JSON.stringify(updatedState));
    }

    if (!user) return; // No cloud sync for signed-out state

    // Clear previous timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce write to Firestore by 1.5 seconds after chanting stops
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        setSyncing(true);
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, updatedState);
        setSyncError(false);
      } catch (err) {
        console.error('Firestore autosync failed (offline likely):', err);
        setSyncError(true);
        try {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
        } catch (syncErr) {
          // Logged inside helper, catch here to prevent uncaught promise rejection crash in background thread
        }
      } finally {
        setSyncing(false);
      }
    }, 1500);
  };

  // Increment Counter Tap Handler
  const handleTapCount = () => {
    setState((prev) => {
      const today = getTodayString();
      const yesterday = getYesterdayString();
      
      const newCurrentCount = prev.currentCount + 1;
      const newDailyCount = prev.dailyCount + 1;
      const newLifetimeCount = prev.lifetimeCount + 1;

      // Calculate streak
      let newStreak = prev.streak;
      if (prev.lastChantedDate === '') {
        newStreak = 1; // first time chanting
      } else if (prev.lastChantedDate === yesterday) {
        newStreak = prev.streak + 1; // continued yesterday's streak
      } else if (prev.lastChantedDate !== today) {
        newStreak = 1; // broken streak, starting new
      }

      // Update mantra statistics
      const mantraId = prev.currentMantra.id;
      const prevMantraStats = prev.mantraStats[mantraId] || { count: 0, lastChanted: 0 };
      const updatedMantraStats = {
        ...prev.mantraStats,
        [mantraId]: {
          count: prevMantraStats.count + 1,
          lastChanted: Date.now()
        }
      };

      // Create updated state
      const newState: AppState = {
        ...prev,
        currentCount: newCurrentCount,
        dailyCount: newDailyCount,
        lifetimeCount: newLifetimeCount,
        streak: newStreak,
        lastChantedDate: today,
        mantraStats: updatedMantraStats
      };

      // Check if goal met to log session
      if (newCurrentCount === prev.goal) {
        // Auto-log a completed Mala session
        const session: ChantingSession = {
          id: `session-${Date.now()}`,
          mantraId: prev.currentMantra.id,
          mantraName: prev.currentMantra.name,
          count: prev.goal,
          goal: prev.goal,
          timestamp: Date.now(),
          synced: true
        };
        newState.history = [session, ...prev.history].slice(0, 50); // limit history display to last 50
      }

      // Dispatch to storage / cloud
      queueCloudSync(newState);
      return newState;
    });
  };

  // Reset Session Counters
  const handleResetSession = () => {
    setState((prev) => {
      const newState: AppState = {
        ...prev,
        currentCount: 0
      };

      queueCloudSync(newState);
      return newState;
    });
    setShowResetModal(false);
    triggerSuccessFeedback("Current session reset to 0.");
  };

  // Confirm and Execute Logout
  const confirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await signOut(auth);
      // Clear states
      setState(getInitialState());
      setUser(null);
      triggerSuccessFeedback("Logged out successfully.");
    } catch (err: any) {
      console.error("Logout failed:", err);
      alert("Sign out failed: " + err.message);
    }
  };

  // Change Mantra
  const handleMantraChange = (mantra: Mantra) => {
    setState((prev) => {
      // Log previous counts before switching
      let updatedHistory = [...prev.history];
      if (prev.currentCount > 0) {
        const session: ChantingSession = {
          id: `session-switch-${Date.now()}`,
          mantraId: prev.currentMantra.id,
          mantraName: prev.currentMantra.name,
          count: prev.currentCount,
          goal: prev.goal,
          timestamp: Date.now(),
          synced: true
        };
        updatedHistory = [session, ...prev.history].slice(0, 50);
      }

      const newState: AppState = {
        ...prev,
        currentMantra: mantra,
        currentCount: 0, // start fresh for new mantra
        history: updatedHistory
      };

      queueCloudSync(newState);
      return newState;
    });
  };

  // Change Goal
  const handleGoalChange = (newGoal: number) => {
    setState((prev) => {
      const newState = {
        ...prev,
        goal: newGoal
      };
      queueCloudSync(newState);
      return newState;
    });
  };

  // If Auth states loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-spiritual-dark flex items-center justify-center text-gold-500">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-serif uppercase tracking-widest golden-glow">
            Loading NaamSadhana...
          </p>
        </div>
      </div>
    );
  }

  // Public Static Pages Route Interception
  if (currentRoute === '/about') {
    return <AboutPage onBack={() => navigateTo('/')} />;
  }
  if (currentRoute === '/privacy') {
    return <PrivacyPage onBack={() => navigateTo('/')} />;
  }
  if (currentRoute === '/terms') {
    return <TermsPage onBack={() => navigateTo('/')} />;
  }
  if (currentRoute === '/contact') {
    return (
      <ContactPage 
        user={user} 
        onBack={() => navigateTo('/')} 
        triggerSuccess={triggerSuccessFeedback} 
      />
    );
  }
  if (currentRoute === '/offline') {
    return <OfflinePage onBack={() => navigateTo('/')} />;
  }

  // If path is not "/", "/index.html" and not a recognized subpage, show 404 Page
  if (currentRoute !== '/' && currentRoute !== '/index.html') {
    return <NotFoundPage onBack={() => navigateTo('/')} />;
  }

  // If user is not logged in, show Auth Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-spiritual-dark flex items-center justify-center transition-colors duration-300">
        <AuthScreen onSuccess={() => navigateTo('/')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-spiritual-dark text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Header with tools */}
      <Header
        user={user}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onShowInstructions={() => setShowInstructions(true)}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Offline / Sync Status Indicator */}
        {syncError && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 p-3 rounded-2xl text-xs flex gap-2 items-center justify-center">
            <AlertTriangle size={14} className="shrink-0 animate-pulse" />
            <span>Chanting is active offline. Counts will sync when connection returns.</span>
          </div>
        )}

        {/* Chanting Room & Dashboard Cards */}
        <div className="bg-white dark:bg-spiritual-panel/50 border border-slate-100 dark:border-slate-800/60 rounded-3xl shadow-lg dark:shadow-black/40 overflow-hidden flex flex-col min-h-[500px]">
          
          {/* Inner Navigation Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800/60 p-2 gap-2 bg-slate-50/50 dark:bg-spiritual-panel/20">
            <button
              onClick={() => setActiveTab('chant')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'chant'
                  ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-md shadow-saffron-500/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Compass size={16} />
              Chant Room
            </button>
            <button
              onClick={() => setActiveTab('sadhana')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'sadhana'
                  ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-md shadow-saffron-500/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <History size={16} />
              Sadhana Dashboard
            </button>
          </div>

          {/* Active Tab Screen */}
          <div className="p-6 flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeTab === 'chant' ? (
                <motion.div
                  key="chant-room"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center space-y-6"
                >
                  {/* Current Mantra Title card */}
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest text-saffron-600 dark:text-gold-500 font-extrabold">
                      Active Sadhana
                    </span>
                    <h2 className="text-3xl font-bold font-serif text-amber-950 dark:text-amber-100 mt-1 golden-glow">
                      {state.currentMantra.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                      {state.currentMantra.translation || 'Sacred Sound Vibrations'}
                    </p>
                  </div>

                  {/* The Interactive Japa Mala */}
                  <MalaVisualizer
                    currentCount={state.currentCount}
                    goal={state.goal}
                    onTap={handleTapCount}
                    soundEnabled={soundEnabled}
                    vibrateEnabled={vibrateEnabled}
                  />

                  {/* Sound & Haptic toggle row */}
                  <div className="flex gap-4 items-center bg-slate-50 dark:bg-spiritual-panel/40 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/40 mt-2">
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                        soundEnabled ? 'text-saffron-600 dark:text-gold-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                      title={soundEnabled ? 'Mute Chanting Bell' : 'Enable Chanting Bell'}
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      <span>Bell</span>
                    </button>
                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
                    <button
                      onClick={() => setVibrateEnabled(!vibrateEnabled)}
                      className={`flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                        vibrateEnabled ? 'text-saffron-600 dark:text-gold-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                      title={vibrateEnabled ? 'Disable Vibration' : 'Enable Vibration'}
                    >
                      {vibrateEnabled ? <Vibrate size={16} /> : <VibrateOff size={16} />}
                      <span>Haptic</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="sadhana-room"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Stats Panel */}
                  <StatsPanel
                    currentCount={state.currentCount}
                    goal={state.goal}
                    dailyCount={state.dailyCount}
                    lifetimeCount={state.lifetimeCount}
                    streak={state.streak}
                    onReset={() => setShowResetModal(true)}
                  />

                  {/* Goal Setter */}
                  <div className="h-[1px] bg-slate-100 dark:bg-slate-800" />
                  <GoalSetter
                    currentGoal={state.goal}
                    onGoalChange={handleGoalChange}
                  />

                  {/* Mantra Selector */}
                  <div className="h-[1px] bg-slate-100 dark:bg-slate-800" />
                  <MantraSelector
                    selectedMantra={state.currentMantra}
                    onMantraChange={handleMantraChange}
                  />

                  {/* Chanting Logs List */}
                  {state.history.length > 0 && (
                    <>
                      <div className="h-[1px] bg-slate-100 dark:bg-slate-800" />
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-saffron-700 dark:text-gold-400 font-sans">
                          Recent Japa Logs
                        </h4>
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {state.history.map((log) => (
                            <div
                              key={log.id}
                              className="bg-slate-50/50 dark:bg-spiritual-panel/20 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/40 flex justify-between items-center"
                            >
                              <div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                  {log.mantraName}
                                </span>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                  {new Date(log.timestamp).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              <span className="text-xs font-mono font-bold text-saffron-600 dark:text-gold-400">
                                +{log.count} chants
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation */}
        <Footer onNavigate={navigateTo} />
      </main>

      {/* Instructions Modal Overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-spiritual-panel max-w-md w-full rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 dark:border-slate-800"
            >
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-saffron-100 dark:bg-saffron-950/40 text-saffron-600 dark:text-gold-400">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-amber-950 dark:text-gold-400">
                    Sadhana Guidelines
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  <p>
                    <strong>Japa Yoga</strong> is the meditative practice of repeating a divine mantra or name. It calms the central nervous system, cultivates high focus, and opens spiritual doorways.
                  </p>
                  <div className="space-y-2 bg-saffron-50/50 dark:bg-spiritual-card/50 p-3 rounded-2xl border border-saffron-100/40 dark:border-saffron-900/40">
                    <h4 className="font-bold text-saffron-700 dark:text-gold-400 uppercase tracking-wider text-[10px]">
                      How to practice:
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>Sit in a comfortable posture with an upright spine.</li>
                      <li>Select your mantra from the dashboard (e.g. Radhe Radhe).</li>
                      <li>Focus on the sound resonance of each tap.</li>
                      <li>Completing 108 chants constitutes <strong>1 Mala</strong>.</li>
                    </ul>
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 italic">
                    "When counting on NaamSadhana, treat each tap as a physical bead slide, keeping your consciousness centered in the present moment."
                  </p>
                </div>

                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-gradient-to-r from-saffron-500 to-amber-500 text-white py-3 rounded-2xl font-bold text-xs shadow-md hover:from-saffron-600 hover:to-amber-600 transition-all cursor-pointer"
                >
                  Acknowledge Sadhana
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-spiritual-panel max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl p-6 relative border border-slate-100/80 dark:border-slate-800"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                  <LogOut size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-amber-950 dark:text-gold-400">
                    Sign Out?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Are you sure you want to sign out? If you are logged in as a guest, your progress will remain stored on this device.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-650 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/10 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Current Session Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-spiritual-panel max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl p-6 relative border border-slate-100/80 dark:border-slate-800"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-gold-400 flex items-center justify-center mx-auto">
                  <RefreshCw size={22} className="animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-amber-950 dark:text-gold-400">
                    Reset current session?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    This will reset only the current round count to 0. It won't affect your today, lifetime, streak counts or saved history.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-650 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetSession}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-saffron-500/10 transition-all cursor-pointer"
                  >
                    Reset Count
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Feedback Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 45, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-slate-900/90 dark:bg-slate-50/95 text-white dark:text-slate-900 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md max-w-sm w-[90%] border border-white/10 dark:border-black/5"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="truncate">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
