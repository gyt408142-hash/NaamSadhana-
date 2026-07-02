import { useState, FormEvent } from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { Mantra } from '../types';

interface MantraSelectorProps {
  selectedMantra: Mantra;
  onMantraChange: (mantra: Mantra) => void;
}

const PRESET_MANTRAS: Omit<Mantra, 'id'>[] = [
  { name: 'Radhe Radhe', translation: 'राधे राधे • Eternal Devotion & Love' },
  { name: 'Shri Ram', translation: 'जय श्री राम • Divine Victory & Righteousness' },
  { name: 'Hare Krishna', translation: 'हरे कृष्ण • Absolute Peace & Consciousness' },
  { name: 'Om Namah Shivaya', translation: 'ॐ नमः शिवाय • Auspicious Liberation & Power' },
];

export default function MantraSelector({ selectedMantra, onMantraChange }: MantraSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(selectedMantra.isCustom || false);
  const [customName, setCustomName] = useState(selectedMantra.isCustom ? selectedMantra.name : '');

  const handleSelectPreset = (preset: Omit<Mantra, 'id'>) => {
    setShowCustomInput(false);
    onMantraChange({
      id: preset.name.toLowerCase().replace(/\s+/g, '-'),
      name: preset.name,
      translation: preset.translation,
      isCustom: false
    });
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onMantraChange({
      id: 'custom-' + Date.now(),
      name: customName.trim(),
      translation: 'Custom Chanting Mantra',
      isCustom: true
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-wider text-saffron-700 dark:text-gold-400 font-bold font-sans">
          Select Your Mantra
        </h3>
        {selectedMantra.isCustom && (
          <span className="text-[10px] bg-saffron-100 dark:bg-saffron-950/40 text-saffron-700 dark:text-gold-400 px-2 py-0.5 rounded-full border border-saffron-200 dark:border-saffron-900 font-semibold">
            Custom Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESET_MANTRAS.map((preset) => {
          const id = preset.name.toLowerCase().replace(/\s+/g, '-');
          const isSelected = selectedMantra.id === id && !selectedMantra.isCustom;

          return (
            <button
              key={id}
              onClick={() => handleSelectPreset(preset)}
              className={`text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-saffron-50 to-amber-50 dark:from-spiritual-panel dark:to-spiritual-card border-gold-500 shadow-md shadow-saffron-500/5 dark:shadow-black/40'
                  : 'bg-white dark:bg-spiritual-panel/40 border-slate-100 dark:border-slate-800/60 hover:border-saffron-200 dark:hover:border-saffron-900'
              }`}
            >
              {/* Corner Aura */}
              {isSelected && (
                <div className="absolute right-0 top-0 w-16 h-16 bg-saffron-500/10 dark:bg-gold-500/10 rounded-full blur-xl pointer-events-none" />
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-serif text-lg font-bold tracking-wide transition-colors ${
                    isSelected ? 'text-saffron-600 dark:text-gold-400' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {preset.translation}
                  </p>
                </div>

                {isSelected && (
                  <span className="text-saffron-600 dark:text-gold-400 p-1 bg-saffron-100 dark:bg-saffron-950/40 rounded-full">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Custom option button */}
        <button
          onClick={() => {
            setShowCustomInput(true);
            if (customName) {
              onMantraChange({
                id: 'custom-active',
                name: customName,
                translation: 'Custom Chanting Mantra',
                isCustom: true
              });
            }
          }}
          className={`text-left p-4 rounded-2xl border transition-all duration-300 relative group ${
            showCustomInput
              ? 'bg-gradient-to-br from-saffron-50 to-amber-50 dark:from-spiritual-panel dark:to-spiritual-card border-gold-500 shadow-md shadow-saffron-500/5'
              : 'bg-white dark:bg-spiritual-panel/40 border-slate-100 dark:border-slate-800/60 hover:border-saffron-200 dark:hover:border-saffron-900'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`font-serif text-lg font-bold tracking-wide flex items-center gap-1.5 transition-colors ${
                showCustomInput ? 'text-saffron-600 dark:text-gold-400' : 'text-slate-800 dark:text-slate-200'
              }`}>
                <Sparkles size={16} className="text-gold-500 animate-pulse" />
                Custom Mantra
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {customName ? `"${customName}"` : 'Enter your own prayer/mantra'}
              </p>
            </div>
            {showCustomInput && !selectedMantra.isCustom && (
              <span className="text-amber-500 p-1 bg-amber-100 dark:bg-amber-950/40 rounded-full">
                <Plus size={14} strokeWidth={3} />
              </span>
            )}
            {selectedMantra.isCustom && (
              <span className="text-saffron-600 dark:text-gold-400 p-1 bg-saffron-100 dark:bg-saffron-950/40 rounded-full">
                <Check size={14} strokeWidth={3} />
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Custom input form */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="mt-2 bg-saffron-50/50 dark:bg-spiritual-panel/20 p-4 rounded-2xl border border-saffron-100 dark:border-saffron-900/40 flex gap-2 items-center">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Type custom mantra (e.g., Om, Waheguru, Soham)"
            className="flex-1 bg-white dark:bg-spiritual-card px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-hidden focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500/20 text-slate-800 dark:text-slate-200 transition-colors"
            required
            maxLength={40}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-md shadow-saffron-500/10 flex items-center gap-1 cursor-pointer"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
}
