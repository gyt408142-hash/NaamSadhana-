import { useState, FormEvent } from 'react';
import { Target, Sparkles } from 'lucide-react';

interface GoalSetterProps {
  currentGoal: number;
  onGoalChange: (goal: number) => void;
}

const PRESET_GOALS = [108, 540, 1008];

export default function GoalSetter({ currentGoal, onGoalChange }: GoalSetterProps) {
  const [customGoal, setCustomGoal] = useState(currentGoal.toString());
  const [showCustom, setShowCustom] = useState(!PRESET_GOALS.includes(currentGoal));

  const handlePresetClick = (goal: number) => {
    setShowCustom(false);
    onGoalChange(goal);
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customGoal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onGoalChange(parsed);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-wider text-saffron-700 dark:text-gold-400 font-bold font-sans flex items-center gap-1.5">
          <Target size={16} className="text-saffron-500" />
          Set Chanting Goal
        </h3>
        <span className="text-xs font-mono font-bold text-amber-800 dark:text-gold-500 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/40">
          Goal: {currentGoal}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_GOALS.map((preset) => {
          const isSelected = currentGoal === preset && !showCustom;
          return (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`flex-1 min-w-[70px] text-center px-3 py-2.5 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-saffron-500 to-amber-500 border-gold-500 text-white font-bold shadow-md shadow-saffron-500/15'
                  : 'bg-white dark:bg-spiritual-panel/40 border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-saffron-200 dark:hover:border-saffron-900'
              }`}
            >
              <div className="text-xs uppercase tracking-wider opacity-80">
                {preset === 108 ? '1 Mala' : preset === 540 ? '5 Malas' : '10 Malas'}
              </div>
              <div className="text-base font-bold font-mono mt-0.5">{preset}</div>
            </button>
          );
        })}

        <button
          onClick={() => setShowCustom(true)}
          className={`flex-1 min-w-[80px] text-center px-3 py-2.5 rounded-xl border transition-all duration-300 ${
            showCustom
              ? 'bg-gradient-to-r from-saffron-500 to-amber-500 border-gold-500 text-white font-bold shadow-md shadow-saffron-500/15'
              : 'bg-white dark:bg-spiritual-panel/40 border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-saffron-200 dark:hover:border-saffron-900'
          }`}
        >
          <div className="text-xs uppercase tracking-wider opacity-80 flex items-center justify-center gap-1">
            <Sparkles size={10} className="text-gold-300" /> Custom
          </div>
          <div className="text-base font-bold font-mono mt-0.5">
            {showCustom ? currentGoal : 'Edit'}
          </div>
        </button>
      </div>

      {showCustom && (
        <form onSubmit={handleCustomSubmit} className="mt-2 bg-saffron-50/50 dark:bg-spiritual-panel/20 p-4 rounded-2xl border border-saffron-100 dark:border-saffron-900/40 flex gap-2 items-center">
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max="5000"
              step="1"
              value={customGoal}
              onChange={(e) => {
                setCustomGoal(e.target.value);
                const parsed = parseInt(e.target.value, 10);
                if (!isNaN(parsed) && parsed > 0) {
                  onGoalChange(parsed);
                }
              }}
              className="w-full accent-saffron-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
              <span>1</span>
              <span>1000</span>
              <span>2500</span>
              <span>5000</span>
            </div>
          </div>
          <div className="w-24">
            <input
              type="number"
              min="1"
              max="10000"
              value={customGoal}
              onChange={(e) => {
                setCustomGoal(e.target.value);
                const parsed = parseInt(e.target.value, 10);
                if (!isNaN(parsed) && parsed > 0) {
                  onGoalChange(parsed);
                }
              }}
              className="w-full bg-white dark:bg-spiritual-card px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-center text-slate-800 dark:text-slate-200 font-mono"
            />
          </div>
        </form>
      )}
    </div>
  );
}
