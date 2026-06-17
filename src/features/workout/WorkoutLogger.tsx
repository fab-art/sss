import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, ChevronRight, Target, List, Play, Square, CheckCircle2 } from 'lucide-react';
import { useProgressionStore } from '../../store/useProgressionStore';
import { MuscleGraphic } from '../../components/MuscleGraphic';

export function QuestRewardModal({ onClose }: { onClose: () => void }) {
  const { progression, activeQuest, streak } = useProgressionStore();

  if (!activeQuest) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full rounded-[3.5rem] bg-zinc-900 border border-primary/30 p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-2 border border-primary/20">
            <Trophy className="w-10 h-10 text-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]" />
          </div>

          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-2 uppercase tracking-tighter italic">Victory!</h2>
            <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">Mission Accomplished</p>
          </div>

          <div className="py-2">
            <div className="bg-black/40 rounded-[2.5rem] p-8 border border-white/5 shadow-inner">
              <MuscleGraphic growth={progression.muscleGrowth} />
            </div>
            <p className="mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Physique Adaptation Active</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 rounded-3xl p-5 border border-white/5">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">XP Earned</p>
                <p className="text-2xl font-black text-white">+{activeQuest.xpReward}</p>
            </div>

            <div className="bg-zinc-800/50 rounded-3xl p-5 border border-white/5">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Streak</p>
                <p className="text-2xl font-black text-primary italic">{streak.current}d</p>
            </div>
          </div>

          <button
            onClick={() => {
                onClose();
                window.location.reload();
            }}
            className="w-full py-6 rounded-[2rem] bg-primary text-black font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Acknowledge
          </button>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function GpsTracker({ targetDistance, onComplete, exerciseType }: { targetDistance: number, onComplete: (distance: number) => void, exerciseType: string }) {
    const [isTracking, setIsTracking] = useState(false);
    const [distance, setDistance] = useState(0);
    const [path, setPath] = useState<{x: number, y: number}[]>([]);
    const [time, setTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const watchRef = useRef<number | null>(null);
    const lastPosRef = useRef<{lat: number, lon: number} | null>(null);
    const simulationRef = useRef<boolean>(false);

    const startTracking = () => {
        setIsTracking(true);
        setDistance(0);
        setPath([]);
        setTime(0);
        lastPosRef.current = null;

        timerRef.current = setInterval(() => {
            setTime(t => t + 1);
        }, 1000);

        if ("geolocation" in navigator) {
            watchRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    simulationRef.current = false;
                    const { latitude, longitude } = position.coords;

                    if (lastPosRef.current) {
                        const delta = calculateHaversineDistance(
                            lastPosRef.current.lat,
                            lastPosRef.current.lon,
                            latitude,
                            longitude
                        );
                        // Filter out GPS noise (less than 1m or extremely fast jumps)
                        if (delta > 1 && delta < 30) {
                            setDistance(prev => prev + delta);
                        }
                    }

                    lastPosRef.current = { lat: latitude, lon: longitude };

                    // Update visual path (scaled)
                    setPath(prev => {
                        const last = prev[prev.length - 1] || { x: 195, y: 150 };
                        return [...prev, {
                            x: last.x + (Math.random() * 4 - 2),
                            y: last.y - (Math.random() * 4)
                        }].slice(-50);
                    });
                },
                (error) => {
                    console.error("GPS Error:", error);
                    startSimulation();
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            startSimulation();
        }
    };

    const startSimulation = () => {
        if (simulationRef.current) return;
        simulationRef.current = true;
        console.warn("Using simulation mode");

        const simInterval = setInterval(() => {
            if (!isTracking) {
                clearInterval(simInterval);
                return;
            }
            setDistance(prev => prev + (Math.random() * 2 + 1));
            setPath(prev => {
                const last = prev[prev.length - 1] || { x: 195, y: 150 };
                return [...prev, {
                    x: last.x + (Math.random() * 6 - 3),
                    y: last.y - (Math.random() * 5 + 1)
                }].slice(-50);
            });
        }, 2000);
    };

    const stopTracking = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
        setIsTracking(false);
        onComplete(distance);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
        };
    }, []);

    const svgPath = path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div className="w-full space-y-8">
            <div className="relative h-80 bg-zinc-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-inner">
                <svg className="w-full h-full">
                    <motion.path
                        d={svgPath}
                        fill="transparent"
                        stroke="#22c55e"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        className="drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    />
                    {path.length > 0 && (
                        <circle cx={path[path.length-1].x} cy={path[path.length-1].y} r="6" fill="#22c55e" className="animate-pulse" />
                    )}
                </svg>
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live GPS Signal</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                    <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Time</p>
                        <p className="text-lg font-black text-white">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
                    </div>
                    <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Pace</p>
                        <p className="text-lg font-black text-white">{distance > 0 ? (time / (distance / 1000) / 60).toFixed(2) : '0.00'} /km</p>
                    </div>
                </div>
            </div>

            <div className="text-center space-y-2">
                <div className="flex items-baseline justify-center gap-2">
                    <input
                        type="number"
                        aria-label="Manual distance entry"
                        value={(exerciseType === 'walking' || exerciseType === 'footsteps') ? Math.round(distance * 1.31) : Math.round(distance) || ''}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (exerciseType === 'walking' || exerciseType === 'footsteps') {
                                setDistance(val / 1.31);
                            } else {
                                setDistance(val);
                            }
                        }}
                        className="w-48 bg-transparent text-7xl font-black italic tracking-tighter tabular-nums text-center outline-none border-b-2 border-transparent focus:border-primary/30"
                    />
                    <span className="text-xl text-zinc-600 uppercase italic not-italic font-bold">
                        {(exerciseType === 'walking' || exerciseType === 'footsteps') ? 'steps' : 'm'}
                    </span>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Target: {(exerciseType === 'walking' || exerciseType === 'footsteps') ? Math.round(targetDistance * 1.31) : targetDistance}
                    {(exerciseType === 'walking' || exerciseType === 'footsteps') ? ' steps' : 'm'}
                </p>
            </div>

            {!isTracking ? (
                <button
                    onClick={startTracking}
                    className="w-full py-6 rounded-[2rem] bg-primary text-black font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <Play className="w-6 h-6 fill-current" /> Start Tracking
                </button>
            ) : (
                <button
                    onClick={stopTracking}
                    className="w-full py-6 rounded-[2rem] bg-zinc-100 text-black font-black flex items-center justify-center gap-3 shadow-xl hover:bg-white active:scale-95 transition-all"
                >
                    <Square className="w-6 h-6 fill-current" /> Stop & Sync
                </button>
            )}
        </div>
    );
}

export function WorkoutLogger() {
  const { activeQuest, updateExerciseProgress, completeActiveQuest } = useProgressionStore();
  const [view, setView] = useState<'list' | 'exercise'>('list');
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [manualEntry, setManualEntry] = useState('');

  const { progression, startQuest } = useProgressionStore();

  if (!activeQuest) {
    return (
        <section className="max-w-xl mx-auto min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-24 font-sans text-center space-y-8">
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center border border-primary/20 shadow-2xl">
                <Target className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">No Active Quest</h2>
                <p className="text-zinc-500 font-medium px-8">Initialize your daily protocol to begin training and earn XP.</p>
            </div>
            <button
                onClick={() => startQuest(progression.level)}
                className="w-full py-6 rounded-[2.5rem] bg-primary text-black font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
                Start Daily Protocol
            </button>
        </section>
    );
  }

  const activeEx = activeQuest.exercises[activeExIdx];

  const handleCompleteQuest = async () => {
    await completeActiveQuest();
    setShowReward(true);
  };

  const handleManualUpdate = () => {
      const val = parseInt(manualEntry);
      if (!isNaN(val)) {
          updateExerciseProgress(activeEx.id, val);
          setManualEntry('');
      }
  };

  const isAllComplete = activeQuest.exercises.every(ex => ex.state === 'completed');
  const progressPercent = ((activeEx?.repsLogged || activeEx?.distanceLogged || 0) / (activeEx?.targetReps || activeEx?.targetDistance || 1)) * 100;

  const questCompletion = (activeQuest.exercises.filter(ex => ex.state === 'completed').length / activeQuest.exercises.length) * 100;

  return (
    <section className="max-w-xl mx-auto min-h-screen bg-black text-white flex flex-col p-6 pb-24 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <button
            onClick={() => view === 'exercise' ? setView('list') : window.location.reload()}
            aria-label="Go back to quest list"
            className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Mission {activeQuest.rank}</p>
            <h2 className="text-xl font-black tracking-tighter uppercase italic">
                {view === 'list' ? 'Quest List' : activeEx.exerciseType.split('-').join(' ')}
            </h2>
        </div>
        <div className="w-10" />
      </header>

      {view === 'list' ? (
          <div className="space-y-8">
              <div className="relative bg-zinc-900 border border-white/5 rounded-[3rem] p-8 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 p-6">
                      <div className="w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center relative">
                          <span className="text-xs font-black text-primary">{Math.round(questCompletion)}%</span>
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                              <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-primary/10" />
                              <motion.circle
                                cx="32" cy="32" r="28" fill="transparent" stroke="#22c55e" strokeWidth="4"
                                strokeDasharray={175.9}
                                initial={{ strokeDashoffset: 175.9 }}
                                animate={{ strokeDashoffset: 175.9 - (175.9 * questCompletion) / 100 }}
                              />
                          </svg>
                      </div>
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                          <List className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="font-black text-lg">Daily Protocol</h3>
                          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{activeQuest.exercises.length} Exercises Assigned</p>
                      </div>
                  </div>

                  <div className="space-y-4">
                      {activeQuest.exercises.map((ex, idx) => (
                          <button
                            key={ex.id}
                            onClick={() => { setActiveExIdx(idx); setView('exercise'); }}
                            className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${ex.state === 'completed' ? 'bg-primary/5 border-primary/20 opacity-60' : 'bg-black/40 border-white/5 hover:border-primary/30'}`}
                          >
                              <div className="flex items-center gap-4">
                                  {ex.state === 'completed' ? (
                                      <CheckCircle2 className="w-6 h-6 text-primary" />
                                  ) : (
                                      <div className="w-6 h-6 rounded-full border-2 border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-700">{idx + 1}</div>
                                  )}
                                  <div className="text-left">
                                      <p className={`font-black uppercase italic ${ex.state === 'completed' ? 'text-zinc-500 line-through' : 'text-white'}`}>{ex.exerciseType.split('-').join(' ')}</p>
                                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                          {ex.targetReps
                                            ? `${ex.repsLogged || 0} / ${ex.targetReps} reps`
                                            : (ex.exerciseType as string) === 'walking' || (ex.exerciseType as string) === 'footsteps'
                                                ? `${Math.round((ex.distanceLogged || 0) * 1.31)} / ${Math.round((ex.targetDistance || 0) * 1.31)} steps`
                                                : `${ex.distanceLogged || 0} / ${ex.targetDistance} m`
                                          }
                                      </p>
                                  </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-zinc-700" />
                          </button>
                      ))}
                  </div>
              </div>

              {isAllComplete && (
                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={handleCompleteQuest}
                    className="w-full py-6 rounded-[2.5rem] bg-primary text-black font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/30 animate-pulse"
                >
                    Extract Rewards
                </motion.button>
              )}
          </div>
      ) : (
          <div className="flex-1 flex flex-col">
              {(activeEx.exerciseType as string).includes('run') || (activeEx.exerciseType as string) === 'walking' || (activeEx.exerciseType as string) === 'footsteps' ? (
                  <GpsTracker
                    targetDistance={activeEx.targetDistance || 0}
                    onComplete={(d) => updateExerciseProgress(activeEx.id, undefined, (activeEx.distanceLogged || 0) + Math.round(d))}
                    exerciseType={activeEx.exerciseType}
                  />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                    <div className="relative w-72 h-72 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
                            <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-900" />
                            <motion.circle
                                cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray={816.8}
                                initial={{ strokeDashoffset: 816.8 }}
                                animate={{ strokeDashoffset: 816.8 - (816.8 * Math.min(100, progressPercent)) / 100 }}
                                strokeLinecap="round"
                                className="text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                            />
                        </svg>
                        <div className="text-center z-10">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">Logged</p>
                            <div className="text-8xl font-black tracking-tighter italic leading-none tabular-nums">
                                {activeEx.repsLogged || 0}
                            </div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                                    {activeEx.targetReps
                                        ? `${activeEx.targetReps} reps`
                                        : (activeEx.exerciseType as string) === 'walking' || (activeEx.exerciseType as string) === 'footsteps'
                                            ? `${Math.round((activeEx.targetDistance || 0) * 1.31)} steps`
                                            : `${activeEx.targetDistance} m`
                                    }
                                </span>
                        </div>
                    </div>

                    <div className="w-full max-w-[280px] bg-zinc-900/50 rounded-[2.5rem] p-8 border border-white/5">
                        <MuscleGraphic growth={activeEx.muscleGroups.reduce((acc, mg) => {
                            acc[mg.name as keyof typeof acc] = (activeEx.repsLogged ? (activeEx.repsLogged / (activeEx.targetReps || 1)) * mg.growthPercentage : 0);
                            return acc;
                        }, { chest: 0, core: 0, legs: 0, shoulders: 0, back: 0, cardio: 0 })} />
                    </div>

                    <div className="w-full grid grid-cols-3 gap-3">
                        <button
                            onClick={() => updateExerciseProgress(activeEx.id, (activeEx.repsLogged || 0) + 1)}
                            className="py-8 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all"
                        >
                            <span className="text-3xl font-black text-primary">+1</span>
                        </button>
                        <button
                            onClick={() => updateExerciseProgress(activeEx.id, (activeEx.repsLogged || 0) + 5)}
                            className="py-8 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all"
                        >
                            <span className="text-3xl font-black text-white">+5</span>
                        </button>
                        <div className="relative">
                            <input
                                type="number"
                                aria-label="Manual repetitions entry"
                                value={manualEntry}
                                onChange={(e) => setManualEntry(e.target.value)}
                                onBlur={handleManualUpdate}
                                onKeyDown={(e) => e.key === 'Enter' && handleManualUpdate()}
                                placeholder="Edit"
                                className="w-full h-full py-8 rounded-3xl bg-zinc-900 border border-white/5 text-center font-black text-xl focus:border-primary outline-none"
                            />
                        </div>
                    </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setView('list')}
                    className="flex-1 py-5 rounded-[2rem] bg-zinc-900 border border-white/5 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                      <List className="w-4 h-4" /> All Exercises
                  </button>
                  {activeExIdx < activeQuest.exercises.length - 1 && (
                      <button
                        onClick={() => setActiveExIdx(activeExIdx + 1)}
                        className="flex-1 py-5 rounded-[2rem] bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl"
                      >
                          Next <ChevronRight className="w-4 h-4" />
                      </button>
                  )}
              </div>
          </div>
      )}

      <AnimatePresence>
          {showReward && <QuestRewardModal onClose={() => { setShowReward(false); }} />}
      </AnimatePresence>
    </section>
  );
}
