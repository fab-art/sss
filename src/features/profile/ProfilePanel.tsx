import { getRankForXp } from '../../domain/ranks';
import { useProgressionStore } from '../../store/useProgressionStore';
import { useUserStore } from '../../store/useUserStore';
import { useNutritionStore } from '../../store/useNutritionStore';

export function ProfilePanel() {
  const heroName = useUserStore((state) => state.heroName);
  const { progression, streak, quests } = useProgressionStore();
  const { mealEntries } = useNutritionStore();
  const rank = getRankForXp(progression.totalXp);

  const totalCalories = mealEntries.reduce((sum, m) => sum + m.totalCalories, 0);

  return (
    <section className="space-y-8 pb-24">
        <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-orange-500 rounded-[2.5rem] mx-auto flex items-center justify-center text-5xl shadow-2xl shadow-orange-500/20">
                {rank.emblem}
            </div>
            <div>
                <h2 className="text-3xl font-black text-white">{heroName}</h2>
                <p className="text-orange-500 font-bold uppercase tracking-widest text-sm">{rank.title} • Level {progression.level}</p>
            </div>
        </div>

        <div className="grid gap-6">
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Lifetime Stats</h3>

                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Fitness Metrics</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-2xl font-black text-white">{quests.filter(q => q.isCompleted).length}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Quests Won</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-2xl font-black text-white">{streak.longest}d</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Best Streak</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Nutrition Metrics</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-2xl font-black text-white">{mealEntries.length}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Meals Logged</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4">
                                <p className="text-2xl font-black text-white">{totalCalories}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Calories Today</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">The Path</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black">1</div>
                        <div>
                            <p className="font-black text-white">Civilian</p>
                            <p className="text-xs text-slate-500">Starting point of every hero</p>
                        </div>
                    </div>
                    <div className="w-px h-6 bg-white/10 ml-5" />
                    <div className="flex items-center gap-4 opacity-40">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-500">2</div>
                        <div>
                            <p className="font-black text-slate-300">Trainee</p>
                            <p className="text-xs text-slate-600">Requires 7 quests won</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
