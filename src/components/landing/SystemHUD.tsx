export default function SystemHUD() {
  return (
    <aside className="system-hud hidden md:block">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-1 lg:gap-16">
        <section>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Current focus
          </p>
          <ul className="space-y-2.5 font-mono text-[11px] uppercase tracking-[0.1em]">
            <li>
              <span className="text-[var(--accent)]">›</span> Building products
            </li>
            <li>
              <span className="text-[var(--accent)]">›</span> Exploring AI
            </li>
            <li>
              <span className="text-[var(--accent)]">›</span> Design systems
            </li>
            <li>
              <span className="text-[var(--accent)]">›</span> Solving problems
            </li>
          </ul>
        </section>

        <section>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Mission
          </p>
          <p className="max-w-[220px] text-[14px] leading-[1.65] text-[var(--muted)]">
            Create solutions that make complex things simple and meaningful.
          </p>
        </section>
      </div>
    </aside>
  );
}
