import Navigation from "./Navigation";
import HeroCopy from "./HeroCopy";
import PortraitField from "./PortraitField";
import SystemHUD from "./SystemHUD";

export default function Landing() {
  return (
    <main
      id="home"
      className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="technical-grid pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navigation />

        <section className="relative grid flex-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)_minmax(15rem,0.4fr)]">
          <HeroCopy />
          <PortraitField />
          <SystemHUD />
        </section>

        <footer className="flex min-h-11 items-center justify-between border-t border-[var(--line)] px-5 font-mono text-[7px] uppercase tracking-[0.18em] text-[var(--muted)] sm:px-8 lg:px-12">
          <span>Portfolio / 2026</span>
          <span>Cebu, Philippines · 10.3157° N</span>
        </footer>
      </div>
    </main>
  );
}
