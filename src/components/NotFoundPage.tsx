import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Compass, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onBack: () => void;
}

export default function NotFoundPage({ onBack }: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-spiritual-dark text-slate-850 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/40 flex items-center justify-center mx-auto text-amber-600 dark:text-gold-400"
        >
          <HelpCircle size={36} />
        </motion.div>

        {/* Title & subtitle */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-saffron-600 dark:text-gold-500 font-extrabold bg-saffron-50 dark:bg-saffron-950/20 px-3 py-1 rounded-full">
            404 Error
          </span>
          <h1 className="text-3xl font-serif font-extrabold text-amber-950 dark:text-amber-100">
            Lost Pilgrim Path
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
            The path you are seeking does not exist or has dissolved into the ether. Let us return to the sanctuary.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-saffron-500/10 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Return to Sadhana</span>
        </button>

        {/* Quiet spiritual footer */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 italic font-sans">
          "Not all who wander are lost, but returning home brings peace."
        </div>
      </div>
    </div>
  );
}
