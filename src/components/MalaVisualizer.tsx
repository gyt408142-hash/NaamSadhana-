import { motion } from 'motion/react';

interface MalaVisualizerProps {
  currentCount: number;
  goal: number;
  onTap: () => void;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
}

export default function MalaVisualizer({
  currentCount,
  goal,
  onTap,
  soundEnabled,
  vibrateEnabled
}: MalaVisualizerProps) {
  // 108 beads total
  const TOTAL_BEADS = 108;
  const beadIndex = currentCount % TOTAL_BEADS;
  const completedMalas = Math.floor(currentCount / TOTAL_BEADS);

  // SVG parameters
  const size = 320;
  const center = size / 2;
  const radius = 120;

  // Generate coordinates for 108 beads
  // Angle starting from -90 degrees (top of the circle)
  const beads = Array.from({ length: TOTAL_BEADS }).map((_, i) => {
    const angleInDegrees = (i * 360) / TOTAL_BEADS - 90;
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const x = center + radius * Math.cos(angleInRadians);
    const y = center + radius * Math.sin(angleInRadians);
    
    // Bead types: Sumeru (bead 0/108) is the main bead at the top
    const isSumeru = i === 0;
    
    return {
      index: i,
      x,
      y,
      isSumeru,
    };
  });

  // Calculate rotation to keep the active bead near the top (e.g., at -90 degrees)
  // When beadIndex changes, we rotate the entire group backward so the active bead stays at the top
  const rotationAngle = - (beadIndex * 360) / TOTAL_BEADS;

  const handleMalaTap = () => {
    // Vibrate device if possible
    if (vibrateEnabled && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40); // small tap vibration
    }
    
    // Play custom click sound if enabled
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        // Cozy bell/bowl sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5 note
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (e) {
        console.error('Audio failed', e);
      }
    }
    
    onTap();
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none">
      {/* Outer Glow Ring container */}
      <div className="relative w-[320px] h-[320px] flex items-center justify-center">
        {/* Absolute interactive tapping layer over the SVG center */}
        <div 
          onClick={handleMalaTap}
          id="tap-target-area"
          className="absolute w-[200px] h-[200px] rounded-full z-10 cursor-pointer flex flex-col items-center justify-center text-center bg-radial from-saffron-500/10 to-transparent hover:from-saffron-500/15 transition-all duration-300"
        >
          <motion.div
            key={currentCount}
            initial={{ scale: 0.92, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 15 }}
            className="flex flex-col items-center justify-center"
          >
            {/* Round display */}
            <span className="text-[10px] uppercase tracking-wider text-saffron-600 dark:text-gold-400 font-semibold font-sans">
              Mala {completedMalas + 1}
            </span>
            {/* Bead Count */}
            <span className="text-5xl font-extrabold font-serif text-amber-900 dark:text-amber-100 mt-1 drop-shadow-sm">
              {beadIndex}
            </span>
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-gold-500 to-transparent my-2" />
            <span className="text-[11px] font-medium text-amber-700/70 dark:text-amber-300/60 font-sans">
              Total: <span className="font-mono text-xs">{currentCount}</span>
            </span>
            {goal > 0 && (
              <span className="text-[10px] text-saffron-600/80 dark:text-gold-500/80 mt-1">
                Goal: {goal}
              </span>
            )}
          </motion.div>
        </div>

        {/* Japa Mala SVG */}
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="pointer-events-none drop-shadow-[0_4px_12px_rgba(255,115,0,0.15)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          {/* Decorative halo behind beads */}
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="0.5" 
            strokeDasharray="4 4"
            className="opacity-40"
          />

          {/* Golden gradients */}
          <defs>
            <radialGradient id="sumeruGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff5cc" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#a37e1a" />
            </radialGradient>
            <radialGradient id="activeBeadGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="40%" stopColor="#ff9f43" />
              <stop offset="100%" stopColor="#ee5253" />
            </radialGradient>
            <radialGradient id="regularBead" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe3cc" />
              <stop offset="75%" stopColor="#ff8533" />
              <stop offset="100%" stopColor="#d35400" />
            </radialGradient>
            <radialGradient id="completedBead" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7e6" />
              <stop offset="60%" stopColor="#f39c12" />
              <stop offset="100%" stopColor="#d4af37" />
            </radialGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe494" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8a6d1c" />
            </linearGradient>
            <linearGradient id="tasselGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="50%" stopColor="#ff9933" />
              <stop offset="100%" stopColor="#ffcc00" />
            </linearGradient>
          </defs>

          {/* Rotating Mala Group */}
          <g 
            style={{ 
              transform: `rotate(${rotationAngle}deg)`, 
              transformOrigin: `${center}px ${center}px`,
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {/* Draw string connecting beads */}
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              fill="none" 
              stroke="#e67e22" 
              strokeWidth="2" 
              className="opacity-30 dark:opacity-20"
            />

            {/* Render all beads */}
            {beads.map((bead) => {
              const isCurrent = bead.index === beadIndex;
              const isCompleted = bead.index < beadIndex;
              
              // Sumeru bead styling
              if (bead.isSumeru) {
                return (
                  <g key={bead.index}>
                    {/* Sumeru Tassel connector */}
                    <line 
                      x1={bead.x} 
                      y1={bead.y} 
                      x2={bead.x} 
                      y2={bead.y - 15} 
                      stroke="#d4af37" 
                      strokeWidth="3" 
                    />
                    {/* Decorative gold cap */}
                    <rect 
                      x={bead.x - 4} 
                      y={bead.y - 18} 
                      width="8" 
                      height="4" 
                      fill="#b89326" 
                      rx="1"
                    />
                    {/* Tassel threads */}
                    <path 
                      d={`M ${bead.x} ${bead.y - 18} Q ${bead.x - 8} ${bead.y - 35} ${bead.x - 12} ${bead.y - 50} 
                         M ${bead.x} ${bead.y - 18} Q ${bead.x} ${bead.y - 38} ${bead.x} ${bead.y - 55}
                         M ${bead.x} ${bead.y - 18} Q ${bead.x + 8} ${bead.y - 35} ${bead.x + 12} ${bead.y - 50}`}
                      stroke="url(#tasselGradient)" 
                      strokeWidth="2.5" 
                      fill="none" 
                      strokeLinecap="round"
                    />
                    {/* The Sumeru Bead (Large golden bead) */}
                    <circle
                      cx={bead.x}
                      cy={bead.y}
                      r="10"
                      fill="url(#sumeruGlow)"
                      stroke="#b89326"
                      strokeWidth="1.5"
                    />
                    {/* Core dot */}
                    <circle
                      cx={bead.x}
                      cy={bead.y}
                      r="3"
                      fill="#7f6000"
                    />
                  </g>
                );
              }

              return (
                <circle
                  key={bead.index}
                  cx={bead.x}
                  cy={bead.y}
                  r={isCurrent ? 7 : isCompleted ? 5 : 4}
                  fill={isCurrent ? 'url(#activeBeadGlow)' : isCompleted ? 'url(#completedBead)' : 'url(#regularBead)'}
                  stroke={isCurrent ? '#ff7300' : isCompleted ? '#b89326' : 'rgba(139, 69, 19, 0.3)'}
                  strokeWidth={isCurrent ? 2 : 0.8}
                  style={{
                    filter: isCurrent ? 'drop-shadow(0 0 4px rgba(255,115,0,0.8))' : 'none',
                    transition: 'r 0.3s, fill 0.3s, stroke 0.3s'
                  }}
                />
              );
            })}
          </g>

          {/* Fixed Golden Pointer at the very top indicating active counting bead */}
          <path 
            d={`M ${center - 8} 25 L ${center + 8} 25 L ${center} 40 Z`}
            fill="url(#goldGradient)"
            className="drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]"
          />
        </svg>
      </div>

      <p className="text-xs font-sans text-amber-700/60 dark:text-amber-300/40 mt-3 text-center animate-pulse">
        Tap the center to count • Click reset in dashboard to restart
      </p>
    </div>
  );
}
