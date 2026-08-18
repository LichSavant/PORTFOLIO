export default function SystemHUD() {
  return (
    <aside className="border-t border-[var(--line)] px-5 py-9 sm:px-8 lg:border-t-0 lg:border-l lg:px-7 lg:py-12 xl:px-9">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
        <section>
          <p className="mb-5 font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Current focus
          </p>
          <ul className="space-y-2 font-mono text-[9px] uppercase tracking-[0.11em]">
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
          <p className="mb-5 font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Mission
          </p>
          <p className="max-w-48 text-sm leading-6 text-[var(--muted)]">
            Create solutions that make complex things simple and meaningful.
          </p>
        </section>
      </div>
    </aside>
  );
}
