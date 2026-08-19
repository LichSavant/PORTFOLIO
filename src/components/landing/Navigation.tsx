import { navigationItems } from "@/data/navigation";

export default function Navigation() {
  return (
    <header className="relative z-40 h-[92px]">
      <div className="page-frame grid h-full grid-cols-[1fr_auto_1fr] items-center">
        <a
          href="#home"
          aria-label="Dhanwil Alcover — home"
          className="col-start-1 justify-self-start text-[28px] font-semibold tracking-[-0.08em]"
        >
          DA
        </a>

        <nav
          aria-label="Primary navigation"
          className="col-start-2 hidden items-start gap-[clamp(1.15rem,2vw,2.6rem)] xl:flex"
        >
          {navigationItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative flex min-w-12 flex-col gap-1.5 font-mono uppercase"
            >
              <span className="text-[9px] tracking-[0.16em] text-[var(--muted)]">
                {item.number}
              </span>

              <span
                className={`text-[11px] tracking-[0.09em] transition-colors ${
                  index === 0
                    ? "text-[var(--foreground)]"
                    : "text-[var(--foreground)] hover:text-[var(--accent)]"
                }`}
              >
                {item.label}
              </span>

              {index === 0 ? (
                <span className="absolute -bottom-3 left-0 h-px w-7 bg-[var(--accent)]" />
              ) : null}
            </a>
          ))}
        </nav>

        <div className="col-start-3 flex items-center gap-3 justify-self-end font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--foreground)]">
          <span className="hidden sm:inline">SYS.STATUS</span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
          />
        </div>
      </div>
    </header>
  );
}
