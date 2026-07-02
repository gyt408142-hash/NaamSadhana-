import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowLeft, EyeOff, Lock, Server } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export default function PrivacyPage({ onBack }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-spiritual-dark text-slate-850 dark:text-slate-100 flex flex-col transition-colors duration-300 px-4 py-8">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        {/* Header navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-spiritual-panel border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-spiritual-card transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Back to Sadhana</span>
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full">
            Privacy Policy
          </span>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Lock size={30} />
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-amber-950 dark:text-gold-400 mt-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Effective Date: July 1, 2026. Your spiritual practices are entirely yours. We respect and secure your personal data.
          </p>
        </motion.div>

        {/* Content Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-spiritual-panel rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-md space-y-6 text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans"
        >
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100">
              <EyeOff size={16} className="text-emerald-600 dark:text-emerald-400" />
              <h4>1. What Data We Collect</h4>
            </div>
            <p>
              We only collect information necessary to track your chanting progression. This includes your:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Profile information provided by your Google account (Name, Email, Profile Picture).</li>
              <li>Chanting statistics (Daily counts, Lifetime counts, Current active session counts, Streak counters, Custom goal counts).</li>
              <li>Saved mantra preferences and history logs.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100">
              <Server size={16} className="text-emerald-600 dark:text-emerald-400" />
              <h4>2. How Your Data is Stored & Secured</h4>
            </div>
            <p>
              Your data is synced securely in a Google Cloud-hosted Firebase Firestore database.
            </p>
            <p>
              Under our strict Firebase Security Rules, <strong>each user's data is isolated and completely private under their UID.</strong> Nobody else can read, write, or access your chants. If you choose to log out, your locally cached data is safely purged from memory.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100">
              <ShieldAlert size={16} className="text-emerald-600 dark:text-emerald-400" />
              <h4>3. No Third-Party Sharing</h4>
            </div>
            <p>
              We do not sell, trade, rent, or monetize your personal or chanting details to marketing firms, tracking agencies, or any other third parties. NaamSadhana is built entirely with zero external trackers, trackers-cookies, or targeted advertising banners.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">4. Contacting Us About Your Privacy</h4>
            <p>
              If you wish to purge or request a copy of all your stored chanting logs and account data from our cloud databases, you can reach out to us at anytime via our Contact channel.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center pt-2 text-[10px] text-slate-400 dark:text-slate-500">
          Your path to devotion is secure and private.
        </div>
      </div>
    </div>
  );
}
