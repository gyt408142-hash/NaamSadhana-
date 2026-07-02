import { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Download, Sparkles, User, HelpCircle } from 'lucide-react';
import { auth, signOut } from '../firebase';

interface HeaderProps {
  user: any;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onShowInstructions: () => void;
  onLogoutClick: () => void;
}

export default function Header({
  user,
  darkMode,
  toggleDarkMode,
  onShowInstructions,
  onLogoutClick,
}: HeaderProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Get user display string
  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.isAnonymous) return 'Guest Chanter';
    return user.displayName || user.email || 'Devotee';
  };

  const getUserInitials = () => {
    if (!user) return 'D';
    if (user.isAnonymous) return 'G';
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'D';
  };

  return (
    <header className="w-full bg-white/80 dark:bg-spiritual-panel/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/40 sticky top-0 z-40 px-4 py-3 transition-colors duration-300">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500 to-amber-500 flex items-center justify-center shadow-md shadow-saffron-500/10">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold font-serif text-amber-900 dark:text-gold-400 tracking-wide">
              NaamSadhana
            </h1>
            <p className="text-[10px] text-saffron-600 dark:text-gold-500/80 font-medium font-sans">
              Mantra Counter
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Instruction Tooltip Icon */}
          <button
            onClick={onShowInstructions}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            title="Sadhana Instructions"
          >
            <HelpCircle size={18} />
          </button>

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-saffron-100 dark:bg-saffron-950/40 text-saffron-700 dark:text-gold-400 hover:bg-saffron-200 dark:hover:bg-saffron-900 border border-saffron-200/40 dark:border-saffron-900/60 text-xs font-bold transition-all animate-bounce cursor-pointer"
              title="Install NaamSadhana"
              style={{ animationDuration: '3s' }}
            >
              <Download size={14} />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={18} className="text-gold-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>

          {/* Profile & Logout Group */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60 dark:border-slate-800/80">
              {/* User Details & Avatar */}
              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col text-right min-w-0 max-w-[80px] sm:max-w-[140px]">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-850 dark:text-slate-200 truncate leading-tight">
                    {user.isAnonymous ? 'Guest' : (user.displayName || user.email?.split('@')[0] || 'Devotee')}
                  </span>
                  {user.email && !user.isAnonymous && (
                    <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5">
                      {user.email}
                    </span>
                  )}
                </div>

                {/* Avatar Image or Initials */}
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="User Profile"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-xl object-cover border border-amber-200/50 dark:border-amber-900/50"
                  />
                ) : (
                  <div 
                    className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/50 flex items-center justify-center text-amber-800 dark:text-gold-400 text-xs font-bold font-sans"
                    title={getUserDisplayName()}
                  >
                    {getUserInitials()}
                  </div>
                )}
              </div>

              {/* Log Out */}
              <button
                onClick={onLogoutClick}
                className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
