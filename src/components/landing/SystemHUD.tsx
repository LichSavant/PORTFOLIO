export default function SystemHUD() {
  return (
    <aside
      className="
        pointer-events-none
        absolute
        right-[4.5%]
        top-[27%]
        z-[25]
        hidden
        w-[245px]
        xl:block
      "
    >
      <section>
        <p
          className="
            mb-5
            font-mono
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-[var(--muted)]
          "
        >
          Current focus
        </p>

        <ul
          className="
            space-y-2.5
            font-mono
            text-[11px]
            uppercase
            tracking-[0.1em]
            text-[var(--foreground)]
          "
        >
          <li className="flex items-center gap-3">
            <span className="text-[var(--accent)]">›</span>
            <span>Building products</span>
          </li>

          <li className="flex items-center gap-3">
            <span className="text-[var(--accent)]">›</span>
            <span>Exploring AI</span>
          </li>

          <li className="flex items-center gap-3">
            <span className="text-[var(--accent)]">›</span>
            <span>Design systems</span>
          </li>

          <li className="flex items-center gap-3">
            <span className="text-[var(--accent)]">›</span>
            <span>Solving problems</span>
          </li>
        </ul>
      </section>
    </aside>
  );
}