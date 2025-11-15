interface HeroProps {
  onCtaClick?: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section
      id="main"
      className="hero-section relative flex items-center justify-center px-6 pt-32 pb-12 text-center"
      data-animate="rise"
    >
      <div className="max-w-2xl space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-300 -mt-2">
          Civic AI console
        </p>
        <div className="hero-logo text-5xl font-black uppercase tracking-[0.4em] text-amber-300 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]">
          patch
        </div>
        <p className="hero-tagline text-sm uppercase tracking-[0.25em] text-slate-200">
          See it. Patch it.
        </p>
        <button
          onClick={onCtaClick}
          className="hero-cta rounded-full border border-slate-50/70 bg-slate-50 px-10 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-white"
        >
          Start Reporting
        </button>
      </div>
    </section>
  );
}
