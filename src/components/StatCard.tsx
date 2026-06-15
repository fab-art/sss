type StatCardProps = {
  label: string;
  value: string | number;
  detail?: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-900/50 p-5 shadow-2xl shadow-black/20 backdrop-blur">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      {detail ? <p className="mt-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">{detail}</p> : null}
    </article>
  );
}
