import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useNutritionStore } from '../../store/useNutritionStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Dumbbell, Moon, User, Scale, Ruler, Calendar } from 'lucide-react';
import type { ActivityLevel, NutritionGoal } from '../../domain/types';

export function Onboarding() {
  const { setHeroName, updateProfile, completeOnboarding } = useUserStore();
  const { updateProtocol } = useNutritionStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(150);
  const [height, setHeight] = useState(67);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<NutritionGoal>('maintenance');
  const [fasting, setFasting] = useState<'none' | '16:8' | '14:10' | '18:6'>('16:8');

  const next = () => setStep(s => s + 1);

  const handleFinish = async () => {
    setHeroName(name.trim() || 'Hero');
    updateProfile({
        age,
        weight,
        height,
        activityLevel,
        goal
    });
    await updateProtocol({
        userId: 'default',
        protocolType: fasting,
        eatingWindowStart: '12:00',
        eatingWindowEnd: fasting === '16:8' ? '20:00' : fasting === '14:10' ? '22:00' : '18:00',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
    });
    completeOnboarding();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full space-y-8 text-center"
          >
            <div className="w-20 h-20 bg-orange-500 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-orange-500/20">
                <Dumbbell className="w-10 h-10" />
            </div>
            <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">The Civilian's Path</h1>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">Every hero began here. Let's begin yours.</p>
            </div>
            <button onClick={next} className="w-full py-5 rounded-3xl bg-orange-500 font-black text-lg flex items-center justify-center gap-2 hover:bg-orange-400 transition">
                Next <ChevronRight className="w-5 h-5" />
            </button>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="space-y-2">
                <p className="text-orange-500 font-black uppercase tracking-widest text-xs">Step 2 of 5</p>
                <h2 className="text-4xl font-black tracking-tight">Vitals</h2>
            </div>
            <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-500">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <input
                        id="age-input"
                        type="number"
                        value={age}
                        onChange={e => setAge(parseInt(e.target.value))}
                        placeholder="Age"
                        className="w-full py-6 pl-16 pr-6 rounded-3xl bg-slate-900 border border-white/10 text-xl font-bold focus:border-orange-500 transition outline-none"
                    />
                    <label htmlFor="age-input" className="absolute -top-3 left-6 bg-slate-950 px-2 text-[10px] font-black text-slate-500 uppercase">Age</label>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-500">
                        <Scale className="w-6 h-6" />
                    </div>
                    <input
                        id="weight-input"
                        type="number"
                        value={weight}
                        onChange={e => setWeight(parseInt(e.target.value))}
                        placeholder="Weight (lbs)"
                        className="w-full py-6 pl-16 pr-6 rounded-3xl bg-slate-900 border border-white/10 text-xl font-bold focus:border-orange-500 transition outline-none"
                    />
                    <label htmlFor="weight-input" className="absolute -top-3 left-6 bg-slate-950 px-2 text-[10px] font-black text-slate-500 uppercase">Weight (lbs)</label>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-500">
                        <Ruler className="w-6 h-6" />
                    </div>
                    <input
                        id="height-input"
                        type="number"
                        value={height}
                        onChange={e => setHeight(parseInt(e.target.value))}
                        placeholder="Height (inches)"
                        className="w-full py-6 pl-16 pr-6 rounded-3xl bg-slate-900 border border-white/10 text-xl font-bold focus:border-orange-500 transition outline-none"
                    />
                    <label htmlFor="height-input" className="absolute -top-3 left-6 bg-slate-950 px-2 text-[10px] font-black text-slate-500 uppercase">Height (inches)</label>
                </div>
            </div>
            <button onClick={next} className="w-full py-5 rounded-3xl bg-orange-500 font-black text-lg flex items-center justify-center gap-2 hover:bg-orange-400 transition">
                Next <ChevronRight className="w-5 h-5" />
            </button>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="space-y-2">
                <p className="text-orange-500 font-black uppercase tracking-widest text-xs">Step 3 of 5</p>
                <h2 className="text-4xl font-black tracking-tight">Fitness Level</h2>
            </div>
            <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <p className="font-bold text-slate-300">How active are you?</p>
                    <div className="grid grid-cols-1 gap-2">
                        {(['sedentary', 'light', 'moderate', 'active', 'veryActive'] as ActivityLevel[]).map(levelId => (
                            <button
                                key={levelId}
                                onClick={() => setActivityLevel(levelId)}
                                className={`py-4 rounded-2xl border font-bold transition capitalize ${activityLevel === levelId ? 'bg-orange-500 border-orange-500' : 'bg-white/5 border-white/5 hover:border-orange-500/50'}`}
                            >
                                {levelId.replace(/([A-Z])/g, ' $1')}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <p className="font-bold text-slate-300">What is your goal?</p>
                    <div className="grid grid-cols-1 gap-2">
                        {(['weightLoss', 'maintenance', 'muscleGain'] as NutritionGoal[]).map(gId => (
                            <button
                                key={gId}
                                onClick={() => setGoal(gId)}
                                className={`py-4 rounded-2xl border font-bold transition capitalize ${goal === gId ? 'bg-cyan-500 border-cyan-500' : 'bg-white/5 border-white/5 hover:border-cyan-500/50'}`}
                            >
                                {gId.replace(/([A-Z])/g, ' $1')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={next} className="w-full py-5 rounded-3xl bg-orange-500 font-black text-lg flex items-center justify-center gap-2 hover:bg-orange-400 transition">
                Next <ChevronRight className="w-5 h-5" />
            </button>
          </motion.section>
        )}

        {step === 4 && (
          <motion.section
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="space-y-2">
                <p className="text-orange-500 font-black uppercase tracking-widest text-xs">Step 4 of 5</p>
                <h2 className="text-4xl font-black tracking-tight">Fasting Choice</h2>
                <p className="text-slate-400">Do you want to track nutrition with intermittent fasting?</p>
            </div>
            <div className="space-y-3">
                {[
                    { id: 'none', title: 'No tracking', desc: 'Eat all day' },
                    { id: '16:8', title: '16:8 Protocol', desc: 'Standard protocol' },
                    { id: '14:10', title: '14:10 Protocol', desc: 'Moderate fasting' },
                    { id: '18:6', title: '18:6 Protocol', desc: 'Aggressive fasting' }
                ].map(p => (
                    <button
                        key={p.id}
                                onClick={() => setFasting(p.id as 'none' | '16:8' | '14:10' | '18:6')}
                        className={`w-full p-6 rounded-3xl border text-left transition flex items-center gap-4 ${fasting === p.id ? 'bg-indigo-500/10 border-indigo-500' : 'bg-white/5 border-white/5'}`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${fasting === p.id ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                            <Moon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-lg">{p.title}</p>
                            <p className="text-sm text-slate-500">{p.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
            <button onClick={next} className="w-full py-5 rounded-3xl bg-orange-500 font-black text-lg flex items-center justify-center gap-2 hover:bg-orange-400 transition">
                Next <ChevronRight className="w-5 h-5" />
            </button>
          </motion.section>
        )}

        {step === 5 && (
          <motion.section
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="space-y-2">
                <p className="text-orange-500 font-black uppercase tracking-widest text-xs">Final Step</p>
                <h2 className="text-4xl font-black tracking-tight">Name your hero</h2>
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-500">
                    <User className="w-6 h-6" />
                </div>
                <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your hero name"
                    className="w-full py-6 pl-16 pr-6 rounded-3xl bg-slate-900 border border-white/10 text-xl font-bold focus:border-orange-500 transition outline-none"
                />
            </div>
            <button onClick={handleFinish} className="w-full py-6 rounded-3xl bg-orange-500 font-black text-xl shadow-2xl shadow-orange-500/20 hover:bg-orange-400 transition">
                Create Profile
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
