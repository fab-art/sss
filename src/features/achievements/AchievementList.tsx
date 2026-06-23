import { ACHIEVEMENTS } from '../../domain/achievements';
import { useProgressionStore } from '../../store/useProgressionStore';
import { Trophy } from 'lucide-react';

export function AchievementList() {
  const { achievements } = useProgressionStore();
  const unlockedIds = new Set(achievements.map((a) => a.id));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlockedIds.has(achievement.id);
        const unlockedAt = achievements.find((a) => a.id === achievement.id)?.unlockedAt;

        return (
          <div
            className={`rounded-3xl border p-6 transition ${
              isUnlocked
                ? 'border-primary/30 bg-primary/10'
                : 'border-white/5 bg-slate-900 grayscale opacity-50'
            }`}
            key={achievement.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className={`text-lg font-black ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                  {achievement.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{achievement.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-lg bg-primary/20 px-2 py-1 text-xs font-bold text-accent">
                    +{achievement.xpReward} XP
                  </span>
                  {unlockedAt && (
                    <span className="text-[10px] font-bold text-slate-600 uppercase">
                      Unlocked {unlockedAt.slice(0, 10)}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`rounded-2xl p-3 ${
                  isUnlocked ? 'bg-primary text-black' : 'bg-slate-800 text-slate-600'
                }`}
              >
                <Trophy />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
