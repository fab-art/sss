import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useNutritionStore } from '../../store/useNutritionStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Moon, Shield } from 'lucide-react';
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

  const next = () => setStep((s) => s + 1);

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
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-md w-full space-y-10 text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] mx-auto flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10">
              <Shield className="w-12 h-12 text-primary fill-primary/20" />
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-black tracking-tighter italic uppercase">HeroPath</h1>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed px-4 text-balance">
                The next evolution of your physical potential begins here.
              </p>
            </div>
            <button
              onClick={next}
              className="w-full py-6 rounded-[2.5rem] bg-primary text-black font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20"
            >
              Initiate <ChevronRight className="w-6 h-6" />
            </button>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full space-y-10"
          >
            <div className="space-y-2">
              <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                Phase 01
              </p>
              <h2 className="text-4xl font-black tracking-tight uppercase italic">Biometrics</h2>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <input
                  id="age-input"
                  type="number"
                  value={age || ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') {
                      setAge(0);
                      return;
                    }
                    const val = parseInt(raw);
                    if (!isNaN(val)) setAge(val);
                  }}
                  placeholder="Age"
                  className="w-full py-8 px-8 rounded-3xl bg-zinc-900 border border-white/5 text-2xl font-black focus:border-primary transition-all outline-none"
                />
                <label
                  htmlFor="age-input"
                  className="absolute -top-3 left-6 bg-black px-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-white/5 rounded-full"
                >
                  Age
                </label>
              </div>
              <div className="relative">
                <input
                  id="weight-input"
                  type="number"
                  value={weight || ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') {
                      setWeight(0);
                      return;
                    }
                    const val = parseInt(raw);
                    if (!isNaN(val)) setWeight(val);
                  }}
                  placeholder="Weight (lbs)"
                  className="w-full py-8 px-8 rounded-3xl bg-zinc-900 border border-white/5 text-2xl font-black focus:border-primary transition-all outline-none"
                />
                <label
                  htmlFor="weight-input"
                  className="absolute -top-3 left-6 bg-black px-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-white/5 rounded-full"
                >
                  Weight (lbs)
                </label>
              </div>
              <div className="relative">
                <input
                  id="height-input"
                  type="number"
                  value={height || ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') {
                      setHeight(0);
                      return;
                    }
                    const val = parseInt(raw);
                    if (!isNaN(val)) setHeight(val);
                  }}
                  placeholder="Height (inches)"
                  className="w-full py-8 px-8 rounded-3xl bg-zinc-900 border border-white/5 text-2xl font-black focus:border-primary transition-all outline-none"
                />
                <label
                  htmlFor="height-input"
                  className="absolute -top-3 left-6 bg-black px-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-white/5 rounded-full"
                >
                  Height (in)
                </label>
              </div>
            </div>
            <button
              onClick={next}
              className="w-full py-6 rounded-[2.5rem] bg-primary text-black font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20"
            >
              Continue <ChevronRight className="w-6 h-6" />
            </button>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full space-y-10"
          >
            <div className="space-y-2">
              <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                Phase 02
              </p>
              <h2 className="text-4xl font-black tracking-tight uppercase italic">Directives</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2">
                  Current Load
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(
                    ['sedentary', 'light', 'moderate', 'active', 'veryActive'] as ActivityLevel[]
                  ).map((levelId) => (
                    <button
                      key={levelId}
                      onClick={() => setActivityLevel(levelId)}
                      className={`py-4 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all ${activityLevel === levelId ? 'bg-primary border-primary text-black' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-primary/50'}`}
                    >
                      {levelId.replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2">
                  Primary Objective
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(['weightLoss', 'maintenance', 'muscleGain'] as NutritionGoal[]).map((gId) => (
                    <button
                      key={gId}
                      onClick={() => setGoal(gId)}
                      className={`py-4 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all ${goal === gId ? 'bg-zinc-100 border-zinc-100 text-black' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-zinc-100/50'}`}
                    >
                      {gId.replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={next}
              className="w-full py-6 rounded-[2.5rem] bg-primary text-black font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20"
            >
              Seal Directive <ChevronRight className="w-6 h-6" />
            </button>
          </motion.section>
        )}

        {step === 4 && (
          <motion.section
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full space-y-10"
          >
            <div className="space-y-2">
              <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                Phase 03
              </p>
              <h2 className="text-4xl font-black tracking-tight uppercase italic">Fasting</h2>
              <p className="text-zinc-500 font-medium">Select your metabolic protocol.</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'none', title: 'Standard', desc: 'Continuous intake' },
                { id: '16:8', title: 'Tactical', desc: '16h Fast / 8h Eat' },
                { id: '14:10', title: 'Balanced', desc: '14h Fast / 10h Eat' },
                { id: '18:6', title: 'Aggressive', desc: '18h Fast / 6h Eat' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFasting(p.id as 'none' | '16:8' | '14:10' | '18:6')}
                  className={`w-full p-6 rounded-3xl border transition-all flex items-center gap-5 ${fasting === p.id ? 'bg-primary/10 border-primary text-primary' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${fasting === p.id ? 'bg-primary text-black' : 'bg-black text-zinc-700'}`}
                  >
                    <Moon className="w-7 h-7 fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-lg uppercase italic leading-none mb-1">
                      {p.title}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {p.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={next}
              className="w-full py-6 rounded-[2.5rem] bg-primary text-black font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/20"
            >
              Commit <ChevronRight className="w-6 h-6" />
            </button>
          </motion.section>
        )}

        {step === 5 && (
          <motion.section
            key="step5"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full space-y-10"
          >
            <div className="space-y-4 text-center">
              <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                Final Initialization
              </p>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic">
                Hero Identity
              </h2>
            </div>
            <div className="relative">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ENTER CODENAME"
                className="w-full py-10 px-8 rounded-3xl bg-zinc-900 border border-white/5 text-3xl font-black text-center focus:border-primary transition-all outline-none placeholder:text-zinc-800"
              />
            </div>
            <button
              onClick={handleFinish}
              className="w-full py-8 rounded-[3rem] bg-primary text-black font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Initialize Profile
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
