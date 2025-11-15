import AboutSection from "../components/landing/AboutSection";
import Hero from "../components/landing/Hero";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Link } from "react-router-dom";

export default function LandingPage() {
  useScrollReveal();

  return (
    <div className="relative min-h-screen overflow-hidden bg-patch text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-patch-blobs" aria-hidden />
      <main className="relative z-10 space-y-16">
        <Hero onCtaClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} />
        <AboutSection />
        <section className="px-6 pb-20">
          <div className="app-container flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/70 p-12 text-center shadow-2xl backdrop-blur-2xl" data-animate="zoom">
            <h2 className="text-2xl font-semibold text-white mb-4">Ready to Report an Issue?</h2>
            <p className="text-slate-300 mb-8 max-w-md">
              Use our interactive map to report issues in your community. Click on the map to drop a pin and submit your report.
            </p>
            <Link
              to="/report"
              className="inline-block rounded-full border border-white/80 bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-slate-50"
            >
              Open Map & Report
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

