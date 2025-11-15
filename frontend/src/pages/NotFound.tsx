import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">404</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Route not wired yet</h2>
        <p className="mt-2 text-slate-600">
          Plug this into any new workflow once the backend endpoint is ready.
        </p>
      </div>
      <Link
        to="/"
        className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
      >
        Back to dashboard
      </Link>
    </section>
  );
}

