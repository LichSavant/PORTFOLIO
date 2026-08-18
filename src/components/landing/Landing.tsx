import Navigation from "./Navigation";
import HeroCopy from "./HeroCopy";
import PortraitField from "./PortraitField";
import SystemHUD from "./SystemHUD";

export default function Landing() {
  return (
    <main
      id="home"
      className="relative min-h-[100svh] overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="technical-grid pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <Navigation />

        <div className="page-frame relative flex-1">
          <HeroCopy />
          <PortraitField />
          <SystemHUD />
        </div>
      </div>

      <div className="pointer-events-none absolute top-[22%] bottom-[8%] left-3 hidden w-8 xl:block">
        <div className="absolute top-0 left-1/2 h-[65%] w-px bg-[var(--line)]" />
        <span className="absolute top-[34%] left-0 font-mono text-[9px] tracking-[0.14em] text-[var(--accent)]">
          001
        </span>
        <span className="absolute top-[34.5%] left-[17px] h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />

        <div className="absolute bottom-0 left-[13px] flex flex-col items-center gap-4">
          <span
            className="font-mono text-[8px] uppercase tracking-[0.17em] text-[var(--muted)]"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
          <span className="font-mono text-sm text-[var(--foreground)]">↓</span>
        </div>
      </div>

      <div className="page-frame pointer-events-none absolute right-0 bottom-5 left-0 hidden font-mono text-[8px] uppercase tracking-[0.15em] text-[var(--muted)] lg:block">
        Dhanwil Alcover / Portfolio 2026
      </div>
    </main>
  );
}
