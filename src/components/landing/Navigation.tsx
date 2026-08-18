import { navigationItems } from "@/data/navigation";

export default function Navigation() {
  return (
    <header className="relative z-30 flex min-h-16 items-center border-b border-[var(--line)] px-5 sm:px-8 lg:min-h-24 lg:px-12">
      <a
        href="#home"
        aria-label="Dhanwil Alcover — home"
        className="font-mono text-sm font-medium tracking-[-0.04em]"
      >
        DA<span className="text-[var(--accent)]">.</span>
      </a>

      <nav
        aria-label="Primary navigation"
        className="ml-auto hidden items-start gap-5 md:flex lg:gap-8"
      >
        {navigationItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={`group flex min-w-10 flex-col gap-1 font-mono uppercase transition-colors ${
              index === 0
                ? "text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span className="text-[7px] tracking-[0.16em] opacity-60">
              {item.number}
            </span>
            <span className="relative text-[8px] tracking-[0.12em] lg:text-[9px]">
              {item.label}
              {index === 0 ? (
                <span className="absolute -bottom-2 left-0 h-px w-4 bg-[var(--accent)]" />
              ) : null}
            </span>
          </a>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-[var(--muted)] md:ml-8 lg:ml-12">
        <span className="hidden sm:inline">Available</span>
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
        />
      </div>
    </header>
  );
}
