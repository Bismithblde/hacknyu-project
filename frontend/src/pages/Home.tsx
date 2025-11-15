export default function HomePage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-emerald-500">
          Overview
        </p>
        <h2 className="text-3xl font-bold text-slate-900">Community pulse</h2>
        <p className="mt-2 text-slate-600">
          Track safety reports, verification momentum, and data exports for your demo.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active pins</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">42</p>
          <p className="text-xs text-slate-400">+6 in the last hour</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Verification streak</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">87%</p>
          <p className="text-xs text-slate-400">community trust score</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Export-ready dataset</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">3.5k rows</p>
          <p className="text-xs text-slate-400">last refreshed 5 minutes ago</p>
        </article>
      </div>
    </section>
  );
}

