import Navigation from "./Navigation";
import HeroCopy from "./HeroCopy";
import PortraitField from "./PortraitField";
import SystemHUD from "./SystemHUD";

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-[#f1f1ed]">
      <div className="absolute inset-0 technical-grid" />

      <div className="relative z-10 flex min-h-screen flex-col border border-white/10">
        <Navigation />

        <section className="relative flex flex-1">
          <HeroCopy />

          <PortraitField />

          <SystemHUD />
        </section>

        <footer className="flex h-12 items-center justify-between border-t border-white/10 px-6 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
          <span>Portfolio Interface / 2026</span>

          <span>
            Cebu, Philippines · System Online
          </span>
        </footer>
      </div>
    </main>
  );
}