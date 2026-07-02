import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Shield, Heart, ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-saffron-600 dark:text-gold-500 bg-saffron-50 dark:bg-saffron-950/20 px-3 py-1 rounded-full">
            About US
          </span>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-saffron-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-saffron-500/20">
            <Compass size={32} className="animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-amber-950 dark:text-gold-400 mt-4 tracking-tight">
            About NaamSadhana
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto italic">
            "Sadhana is the key that unlocks the door to inner peacefulness and divine resonance."
          </p>
        </motion.div>

        {/* Core Description Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-spiritual-panel rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-md space-y-4"
        >
          <h2 className="text-lg font-serif font-bold text-amber-950 dark:text-amber-100">
            Our Spiritual Mission
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
            NaamSadhana was born out of a desire to merge ancient Vedic traditions with modern, clean, offline-first digital experiences. Chanting, or <strong>Japa Yoga</strong>, is a scientific path to quiet the mind, steady the nervous system, and invoke spiritual alignment.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
            Whether you are practicing mindfulness, counting sacred mantras, or tracking daily meditation goals, NaamSadhana acts as a completely private, beautiful, and fluid digital companion.
          </p>
        </motion.div>

        {/* Pillars / Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-spiritual-panel rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-gold-400 flex items-center justify-center mx-auto">
              <Sparkles size={18} />
            </div>
            <h3 className="text-xs font-bold text-amber-950 dark:text-gold-400">Pristine Aesthetic</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Saffron, white, and gold accents create an environment of peace and focus.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-spiritual-panel rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Shield size={18} />
            </div>
            <h3 className="text-xs font-bold text-amber-950 dark:text-gold-400">Absolute Privacy</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Your counts are completely secure under your personal credentials.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-spiritual-panel rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Heart size={18} />
            </div>
            <h3 className="text-xs font-bold text-amber-950 dark:text-gold-400">Pure Devotion</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              No distracting ads, no monetization. Built solely for the path of Sadhana.
            </p>
          </motion.div>
        </div>

        {/* Dedication footer */}
        <div className="text-center pt-4 text-[10px] text-slate-400 dark:text-slate-500">
          Made with reverence to the chanting traditions of the sages.
        </div>
      </div>
    </div>
  );
}
