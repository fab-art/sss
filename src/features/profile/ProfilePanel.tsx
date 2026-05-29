import { getRankForXp } from '../../domain/ranks';
import { useProgressionStore } from '../../store/useProgressionStore';
import { useUserStore } from '../../store/useUserStore';

export function ProfilePanel() {
  const heroName = useUserStore((state) => state.heroName);
  const progression = useProgressionStore((state) => state.progression);
  const rank = getRankForXp(progression.totalXp);

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/10 p-6 text-white">
      <p className="text-sm uppercase tracking-[0.25em] text-orange-200">Profile</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-orange-500 text-3xl">{rank.emblem}</div>
        <div>
          <h2 className="text-2xl font-black">{heroName}</h2>
          <p className="text-slate-300">{rank.title} • Level {progression.level}</p>
        </div>
      </div>
    </aside>
  );
}
