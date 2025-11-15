export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative mx-auto mb-32 flex min-h-[60vh] max-w-5xl items-center px-6 py-16"
      data-animate="slide"
    >
      <div className="patch-card space-y-5 rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-slate-100 backdrop-blur-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-500/40 px-4 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-200">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_0_0_rgba(250,204,21,0.7)] animate-pulse" />
          About Patch
        </div>
        <h2 className="text-3xl font-semibold text-white">A Modern Way to See and Fix the World!</h2>
        <p className="text-base leading-relaxed text-slate-300">
          Patch blends AI agents, multimodal analysis, and civic gamification so anyone can report hazards with
          a single photo and sentence. It is a seamless ecosystem for environmental stewardship and rapid action.
        </p>
        <div className="flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.24em]">
          <span className="chip-outline">AI-powered</span>
          <span className="chip-gold">Civic impact</span>
          <span className="chip-outline">Gamified engagement</span>
        </div>
      </div>
    </section>
  );
}

