import React from 'react';
import { motion } from 'motion/react';
import { WifiOff, ShieldCheck, Compass, ArrowLeft } from 'lucide-react';

interface OfflinePageProps {
  onBack: () => void;
}

export default function OfflinePage({ onBack }: OfflinePageProps) {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-spiritual-dark text-slate-855 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Icon Container */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/40 flex items-center justify-center mx-auto text-amber-600 dark:text-gold-400 shadow-inner"
        >
          <WifiOff size={36} />
        </motion.div>

        {/* Text Title */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-saffron-600 dark:text-gold-500 font-extrabold bg-saffron-50 dark:bg-saffron-950/20 px-3 py-1 rounded-full">
            Devotion Offline
          </span>
          <h1 className="text-3xl font-serif font-extrabold text-amber-950 dark:text-amber-100">
            Offline Sadhana Room
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
            You are currently offline, but do not worry! NaamSadhana is built to be a resilient companion.
          </p>
        </div>

        {/* Feature Check Grid */}
        <div className="bg-white dark:bg-spiritual-panel p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md space-y-3.5 text-left text-xs text-slate-650 dark:text-slate-300 font-sans max-w-xs mx-auto">
          <div className="flex gap-2.5 items-start">
            <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={14} />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 dark:text-gold-400">Chant Counter Works</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">Your active count is safely recorded offline.</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-start">
            <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={14} />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 dark:text-gold-400">Auto-Cloud Synchronization</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">Data will automatically sync with Firestore once your device reconnects.</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-saffron-500/10 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <Compass size={14} />
          <span>Enter Offline Sadhana</span>
        </button>

        {/* Bottom indicator */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">
          Your connection status is monitored continuously.
        </div>
      </div>
    </div>
  );
}
