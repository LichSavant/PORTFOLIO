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

        <div className="page-frame hero-stage relative flex-1">
          <HeroCopy />
          <PortraitField />
          <SystemHUD />

          <svg aria-hidden="true" className="hero-graph" viewBox="0 0 760 170" preserveAspectRatio="none">
            <g fill="none" stroke="currentColor" strokeWidth="0.75">
              <path d="M0 146 C90 112 150 150 230 121 S360 94 430 126 565 116 620 58 704 72 760 16" />
              <path opacity=".55" d="M0 153 C95 139 154 109 228 138 S358 128 430 105 560 145 628 88 704 105 760 52" />
              <path opacity=".3" d="M0 160 C120 126 176 161 258 145 S390 108 470 143 600 126 760 85" />
            </g>
            <g fill="currentColor" opacity=".55">
              {Array.from({ length: 36 }, (_, index) => (
                <circle key={index} cx={index * 22} cy={145 - Math.sin(index * 0.63) * 22} r="1" />
              ))}
            </g>
          </svg>
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
