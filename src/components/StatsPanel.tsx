import { motion } from 'motion/react';
import { Flame, Calendar, Award, RefreshCw, BarChart2 } from 'lucide-react';

interface StatsPanelProps {
  currentCount: number;
  goal: number;
  dailyCount: number;
  lifetimeCount: number;
  streak: number;
  onReset: () => void;
}

export default function StatsPanel({
  currentCount,
  goal,
  dailyCount,
  lifetimeCount,
  streak,
  onReset,
}: StatsPanelProps) {
  // Calculate completion percentage
  const progressPercent = goal > 0 ? Math.min(100, Math.round((currentCount / goal) * 100)) : 0;

  return (
    <div className="w-full space-y-6">
      {/* Progress Section */}
      <div className="bg-white dark:bg-spiritual-panel/40 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 bg-saffron-500/5 dark:bg-gold-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-sans">
              <BarChart2 size={16} className="text-saffron-500" />
              Current Round Progress
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Your active chanting session vs goal
            </p>
          </div>
          <span className="text-2xl font-black text-saffron-600 dark:text-gold-400 font-mono">
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar tracks */}
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-200/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className="h-full bg-gradient-to-r from-saffron-500 via-amber-500 to-gold-400 rounded-full relative"
          >
            {/* Animated shine line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full animate-pulse" />
          </motion.div>
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>{currentCount} chants</span>
          <span>Goal: {goal}</span>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-3 gap-3">
        {/* Daily Stats */}
        <div className="bg-white dark:bg-spiritual-panel/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 text-center relative overflow-hidden">
          <div className="text-saffron-500 dark:text-saffron-400 mb-1.5 flex justify-center">
            <Calendar size={18} />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold font-sans">
            Today
          </div>
          <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-1 font-mono">
            {dailyCount}
          </div>
        </div>

        {/* Lifetime Stats */}
        <div className="bg-white dark:bg-spiritual-panel/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 text-center relative overflow-hidden">
          <div className="text-gold-500 dark:text-gold-400 mb-1.5 flex justify-center">
            <Award size={18} />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold font-sans">
            Lifetime
          </div>
          <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-1 font-mono">
            {lifetimeCount}
          </div>
        </div>

        {/* Streak Stats */}
        <div className="bg-white dark:bg-spiritual-panel/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 text-center relative overflow-hidden">
          <div className="text-amber-500 dark:text-amber-400 mb-1.5 flex justify-center">
            <Flame size={18} className="animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold font-sans">
            Streak
          </div>
          <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-1 font-mono">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/25 dark:border-slate-700/30 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} />
          Reset Current Session
        </button>
      </div>
    </div>
  );
}
