import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';

export function Onboarding() {
  const { heroName, setHeroName, completeOnboarding } = useUserStore();
  const [draftName, setDraftName] = useState(heroName);

  return (
    <main className="flex min-h-screen items-center justify-center bg-midnight p-6 text-white">
      <section className="max-w-xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-orange-950/30">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-200">
          Begin your path
        </p>
        <h1 className="mt-4 text-4xl font-black">Name your hero</h1>
        <p className="mt-3 text-slate-300">
          Your profile stays on this device for the MVP. No backend, no account, no network
          required.
        </p>
        <input
          className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-950 p-4 text-lg"
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
        />
        <button
          className="mt-4 w-full rounded-2xl bg-orange-500 px-5 py-4 font-black transition hover:bg-orange-400"
          type="button"
          onClick={() => {
            setHeroName(draftName.trim() || 'New Hero');
            completeOnboarding();
          }}
        >
          Enter HeroPath
        </button>
      </section>
    </main>
  );
}
