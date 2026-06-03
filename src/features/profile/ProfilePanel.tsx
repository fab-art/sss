import { getRankForXp } from '../../domain/ranks';
import { useProgressionStore } from '../../store/useProgressionStore';
import { useUserStore } from '../../store/useUserStore';
import { useNutritionStore } from '../../store/useNutritionStore';
import { Zap, Target } from 'lucide-react';

export function ProfilePanel() {
  const heroName = useUserStore((state) => state.heroName);
  const { progression, streak, quests } = useProgressionStore();
  const { mealEntries } = useNutritionStore();
  const rank = getRankForXp(progression.totalXp);

  const totalCalories = mealEntries.reduce((sum, m) => sum + m.totalCalories, 0);

  return (
    <section className="space-y-10 pb-24 font-sans">
        <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-primary/10 rounded-[3rem] mx-auto flex items-center justify-center text-6xl shadow-2xl border border-primary/20 relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">{rank.emblem}</span>
            </div>
            <div>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{heroName}</h2>
                <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-2 italic">{rank.title} • Division {progression.level}</p>
            </div>
        </div>

        <div className="grid gap-8">
            <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Operational Metrics</h3>

                <div className="space-y-10">
                    <div>
                        <p className="text-[9px] font-black text-primary uppercase mb-5 tracking-widest flex items-center gap-2">
                            <Target className="w-3 h-3" /> Training Analytics
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 shadow-inner">
                                <p className="text-3xl font-black text-white italic">{quests.filter(q => q.isCompleted).length}</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Quests Won</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 shadow-inner">
                                <p className="text-3xl font-black text-primary italic">{streak.longest}d</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Best Streak</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] font-black text-primary uppercase mb-5 tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3 fill-primary" /> Metabolic Intake
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 shadow-inner">
                                <p className="text-3xl font-black text-white italic">{mealEntries.length}</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Fuel Logs</p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 shadow-inner">
                                <p className="text-3xl font-black text-white italic">{totalCalories}</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Kcal Today</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-10 space-y-6 shadow-2xl">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">The Progression</h3>
                <div className="space-y-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center font-black text-lg italic shadow-lg shadow-primary/20">1</div>
                        <div>
                            <p className="font-black text-white uppercase italic tracking-tight">Initiate</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Entry Level Citizen</p>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-primary/20 ml-6" />
                    <div className="flex items-center gap-5 opacity-40 grayscale">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-600 flex items-center justify-center font-black text-lg italic border border-white/5">2</div>
                        <div>
                            <p className="font-black text-zinc-400 uppercase italic tracking-tight">Guardian</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Requires 7 quests won</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
