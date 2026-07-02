import { useState, FormEvent, useEffect, useRef } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  googleProvider 
} from '../firebase';
import { Mail, Lock, UserCheck, Sparkles, AlertCircle, Info, ExternalLink } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isIframe = typeof window !== 'undefined' && window.self !== window.top;
  const isMobile = typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const useRedirect = isIframe || isMobile;

  const handleError = (err: any) => {
    const errCode = err?.code || '';
    const errMsg = err?.message || '';

    if (errCode === 'auth/unauthorized-domain' || errMsg.includes('unauthorized-domain')) {
      console.warn('Authentication warning: Unauthorized domain detected.', err);
    } else {
      console.error('Auth error details:', err);
    }

    let msg = 'An authentication error occurred. Please try again.';

    if (
      errCode === 'auth/user-not-found' || 
      errCode === 'auth/wrong-password' || 
      errCode === 'auth/invalid-credential' ||
      errMsg.includes('user-not-found') ||
      errMsg.includes('wrong-password') ||
      errMsg.includes('invalid-credential') ||
      errMsg.includes('invalid-api-key') ||
      errMsg.includes('api-key-not-valid')
    ) {
      if (errMsg.includes('api-key-not-valid') || errMsg.includes('invalid-api-key')) {
        msg = 'Invalid Firebase API Key configured. Please check your setup.';
      } else {
        msg = 'Invalid email or password.';
      }
    } else if (errCode === 'auth/email-already-in-use' || errMsg.includes('email-already-in-use')) {
      msg = 'This email is already in use.';
    } else if (errCode === 'auth/weak-password' || errMsg.includes('weak-password')) {
      msg = 'Password should be at least 6 characters.';
    } else if (errCode === 'auth/invalid-email' || errMsg.includes('invalid-email')) {
      msg = 'Please enter a valid email address.';
    } else if (errCode === 'auth/popup-closed-by-user' || errMsg.includes('popup-closed-by-user')) {
      msg = 'Login popup was closed before completion.';
    } else if (errCode === 'auth/popup-blocked' || errMsg.includes('popup-blocked')) {
      msg = 'Google Sign-In popup was blocked. Please try the Redirect button below.';
      setPopupBlocked(true);
    } else if (errCode === 'auth/unauthorized-domain' || errMsg.includes('unauthorized-domain')) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      msg = `Google login is not enabled for ${host} (this is normal in preview/iframe mode). Please sign in using Email/Password or Continue as Guest instead!`;
    } else if (errMsg) {
      msg = errMsg.replace('Firebase: ', '');
    }
    setError(msg);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let hasTimedOut = false;
    timeoutRef.current = setTimeout(() => {
      hasTimedOut = true;
      setLoading(false);
      setError("Login taking too long. Please try redirect mode or open in new tab.");
    }, 15000);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      if (!hasTimedOut) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        onSuccess();
      }
    } catch (err) {
      if (!hasTimedOut) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        handleError(err);
      }
    } finally {
      if (!hasTimedOut) {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    setPopupBlocked(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let hasTimedOut = false;
    timeoutRef.current = setTimeout(() => {
      hasTimedOut = true;
      setLoading(false);
      setError("Login taking too long. Please try redirect mode or open in new tab.");
    }, 15000);

    try {
      if (useRedirect) {
        console.log('Redirecting to Google for sign-in...');
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.log('Opening Google sign-in popup...');
        await signInWithPopup(auth, googleProvider);
        if (!hasTimedOut) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          onSuccess();
        }
      }
    } catch (err: any) {
      if (!hasTimedOut) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (err.code === 'auth/popup-blocked' || err.message?.includes('popup-blocked')) {
          console.warn('Popup blocked, attempting redirect fallback...');
          setPopupBlocked(true);
          try {
            await signInWithRedirect(auth, googleProvider);
          } catch (redirectErr) {
            handleError(redirectErr);
          }
        } else {
          handleError(err);
        }
      }
    } finally {
      if (!hasTimedOut) {
        setLoading(false);
      }
    }
  };

  const handleGoogleRedirectSignIn = async () => {
    setError('');
    setLoading(true);
    setPopupBlocked(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let hasTimedOut = false;
    timeoutRef.current = setTimeout(() => {
      hasTimedOut = true;
      setLoading(false);
      setError("Login taking too long. Please try redirect mode or open in new tab.");
    }, 15000);

    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      if (!hasTimedOut) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        handleError(err);
      }
    } finally {
      if (!hasTimedOut) {
        setLoading(false);
      }
    }
  };

  const handleGuestSignIn = async () => {
    setError('');
    setLoading(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    let hasTimedOut = false;
    timeoutRef.current = setTimeout(() => {
      hasTimedOut = true;
      setLoading(false);
      setError("Login taking too long. Please try redirect mode or open in new tab.");
    }, 15000);

    try {
      await signInAnonymously(auth);
      if (!hasTimedOut) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        onSuccess();
      }
    } catch (err) {
      if (!hasTimedOut) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        handleError(err);
      }
    } finally {
      if (!hasTimedOut) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-center min-h-[80vh]">
      {/* Visual Identity Title */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-saffron-100 to-amber-100 dark:from-saffron-950/20 dark:to-gold-950/20 border border-gold-500/30 mb-4 animate-pulse" style={{ animationDuration: '4s' }}>
          <Sparkles className="text-saffron-500 dark:text-gold-400 w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold font-serif text-amber-900 dark:text-gold-400 tracking-wide golden-glow">
          NaamSadhana
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans max-w-xs mx-auto">
          "Divine sound is the bridge from the soul to the infinite" • Track your daily chanting.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-spiritual-panel/50 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl dark:shadow-black/60 relative overflow-hidden">
        {/* Subtle decorative glow in card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-saffron-500 to-transparent" />

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              isLogin 
                ? 'bg-white dark:bg-spiritual-card text-saffron-600 dark:text-gold-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              !isLogin 
                ? 'bg-white dark:bg-spiritual-card text-saffron-600 dark:text-gold-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-xs flex gap-2 items-start">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yoursoul@spiritual.com"
                className="w-full bg-slate-50 dark:bg-spiritual-card pl-10 pr-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800 text-sm focus:outline-hidden focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500/20 text-slate-800 dark:text-slate-200 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-50 dark:bg-spiritual-card pl-10 pr-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800 text-sm focus:outline-hidden focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500/20 text-slate-800 dark:text-slate-200 transition-colors"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-saffron-500/10 transition-all duration-300 mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              'Enter NaamSadhana'
            ) : (
              'Begin Spiritual Journey'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/60 dark:border-slate-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-spiritual-panel text-xs text-slate-400 font-sans">
            Or connect with
          </span>
        </div>

        {/* Popup Blocked Warning Info Card */}
        {(popupBlocked || (typeof window !== 'undefined' && window.self !== window.top)) && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-900/40 text-slate-700 dark:text-slate-300 text-xs space-y-2 font-sans">
            <div className="flex gap-2 items-center font-bold text-amber-800 dark:text-gold-400">
              <AlertCircle size={15} className="shrink-0" />
              <span>Preview Mode Auth Tip</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
              Inside iframes or preview screens, browsers often block Google login popups. Use <strong>Redirect Mode</strong> or open in a new tab.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleGoogleRedirectSignIn}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-500 text-white font-bold text-[10px] hover:from-saffron-600 hover:to-amber-600 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink size={10} />
                Redirect Mode
              </button>
              <button
                type="button"
                onClick={() => window.open(window.location.href, '_blank')}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-spiritual-card border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink size={10} />
                Open in New Tab
              </button>
            </div>
          </div>
        )}

        {/* Alternative Auth Buttons */}
        <div className="space-y-3">
          {/* Google Sign-In with Note */}
          <div className="space-y-1">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-spiritual-card dark:hover:bg-spiritual-card/80 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800/80 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-1.11 2.76-2.39 3.62v3h3.86c2.26-2.09 3.67-5.17 3.67-8.45z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.82-2.13-6.78-5.01H1.27v3.1a12 12 0 0 0 10.73 6.66z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.22 14.24c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3V6.54H1.27A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.27 5.36l3.95-3.12z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.54l3.95 3.12c.96-2.88 3.63-5.01 6.78-5.01z"
                />
              </svg>
              {useRedirect ? 'Sign In with Google (Redirect Mode)' : 'Sign In with Google'}
            </button>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-sans">
              Google login works best on deployed app.
            </p>
          </div>

          {/* Guest Sign-In */}
          <button
            onClick={handleGuestSignIn}
            disabled={loading}
            className="w-full bg-amber-50/40 hover:bg-amber-100/40 dark:bg-amber-950/10 dark:hover:bg-amber-950/20 text-amber-800 dark:text-gold-400 border border-amber-100/40 dark:border-amber-900/20 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <UserCheck size={15} />
            Continue as Guest / Offline
          </button>
        </div>
      </div>

      {/* Guest Note */}
      <div className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto flex items-start gap-1.5">
        <Info size={12} className="shrink-0 mt-0.5 text-amber-500/80" />
        <span>
          Guest progress is saved locally and synced to the cloud if you create or log into an account later.
        </span>
      </div>
    </div>
  );
}
