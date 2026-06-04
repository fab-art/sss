import { memo } from 'react';
import { type MuscleGrowth } from '../domain/types';

const muscleHighlight = {
  chest: 'fill-orange-400/80 stroke-orange-200',
  core: 'fill-fuchsia-400/75 stroke-fuchsia-200',
  legs: 'fill-cyan-400/75 stroke-cyan-200',
  shoulders: 'fill-orange-400/80 stroke-orange-200',
  back: 'fill-emerald-400/75 stroke-emerald-200',
  cardio: 'fill-emerald-400/75 stroke-emerald-200'
};

const inactiveMuscle = 'fill-slate-700/70 stroke-slate-500/50';

/**
 * Performance Optimization: Memoized complex SVG component.
 * Prevents expensive path recalculations and DOM diffing when 'growth' prop is stable.
 */
export const MuscleGraphic = memo(function MuscleGraphic({ growth }: { growth: MuscleGrowth }) {
  // 0% = baseline, 100% = +15% larger
  const scaleFactor = (growth: number) => 1 + (growth / 100) * 0.15;
  const opacityFactor = (growth: number) => 0.3 + (growth / 100) * 0.7;

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 shadow-inner shadow-black/40">
      <svg
        aria-labelledby="muscle-physique-title"
        className="mx-auto h-64 w-full max-w-64 drop-shadow-[0_0_18px_rgba(249,115,22,0.18)]"
        role="img"
        viewBox="0 0 160 220"
      >
        <title id="muscle-physique-title">Hero physique development</title>

        {/* Head */}
        <circle
          className="fill-slate-600 stroke-slate-400/60"
          cx="80"
          cy="24"
          r="15"
          strokeWidth="2"
        />

        {/* Torso / Core */}
        <rect
          className={growth.core > 0 ? muscleHighlight.core : inactiveMuscle}
          height="64"
          rx="24"
          strokeWidth="2"
          width="54"
          x="53"
          y="45"
          style={{
            transform: `scale(${scaleFactor(growth.core)})`,
            transformOrigin: '80px 77px',
            opacity: opacityFactor(growth.core)
          }}
        />

        {/* Chest */}
        <path
          className={growth.chest > 0 ? muscleHighlight.chest : inactiveMuscle}
          d="M52 52 C29 58 21 75 18 101 L35 105 C40 83 45 72 58 66 Z"
          strokeWidth="2"
          style={{
            transform: `scale(${scaleFactor(growth.chest)})`,
            transformOrigin: '52px 78px',
            opacity: opacityFactor(growth.chest)
          }}
        />
        <path
          className={growth.chest > 0 ? muscleHighlight.chest : inactiveMuscle}
          d="M108 52 C131 58 139 75 142 101 L125 105 C120 83 115 72 102 66 Z"
          strokeWidth="2"
          style={{
            transform: `scale(${scaleFactor(growth.chest)})`,
            transformOrigin: '108px 78px',
            opacity: opacityFactor(growth.chest)
          }}
        />

        {/* Shoulders (simplified) */}
        <circle
           className={growth.shoulders > 0 ? muscleHighlight.shoulders : inactiveMuscle}
           cx="50" cy="55" r="8"
           style={{ opacity: opacityFactor(growth.shoulders) }}
        />
        <circle
           className={growth.shoulders > 0 ? muscleHighlight.shoulders : inactiveMuscle}
           cx="110" cy="55" r="8"
           style={{ opacity: opacityFactor(growth.shoulders) }}
        />

        {/* Legs */}
        <path
          className={growth.legs > 0 ? muscleHighlight.legs : inactiveMuscle}
          d="M56 113 C51 143 47 170 43 203 H62 C67 173 72 146 78 116 Z"
          strokeWidth="2"
          style={{
            transform: `scale(${scaleFactor(growth.legs)})`,
            transformOrigin: '56px 150px',
            opacity: opacityFactor(growth.legs)
          }}
        />
        <path
          className={growth.legs > 0 ? muscleHighlight.legs : inactiveMuscle}
          d="M104 113 C109 143 113 170 117 203 H98 C93 173 88 146 82 116 Z"
          strokeWidth="2"
          style={{
            transform: `scale(${scaleFactor(growth.legs)})`,
            transformOrigin: '104px 150px',
            opacity: opacityFactor(growth.legs)
          }}
        />

        {/* Cardio (Heart glow) */}
        <path
          className={growth.cardio > 0 ? muscleHighlight.cardio : inactiveMuscle}
          d="M74 69 C74 61 86 61 86 69 C94 66 101 76 96 86 C92 94 83 99 80 103 C77 99 68 94 64 86 C59 76 66 66 74 69 Z"
          strokeWidth="2"
          style={{
            transform: `scale(${scaleFactor(growth.cardio)})`,
            transformOrigin: '80px 86px',
            opacity: opacityFactor(growth.cardio)
          }}
        />
      </svg>
    </div>
  );
});
