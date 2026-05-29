export function App() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#12203a_0%,#06070d_42%,#03040a_100%)] text-slate-100">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-3xl border border-xp-400/20 bg-abyss-850/80 p-10 text-center shadow-xp-glow backdrop-blur">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.45em] text-xp-400">
            PWA Shell
          </p>
          <h1 className="font-display text-5xl font-black tracking-tight text-white sm:text-7xl">
            HeroPath
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            A dark-mode-first foundation for heroic progression, quests, and XP glows.
          </p>
        </div>
      </section>
    </main>
  );
}
