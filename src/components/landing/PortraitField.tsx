export default function PortraitField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative hidden min-h-[28rem] items-center justify-center border-l border-[var(--line-soft)] md:flex lg:min-h-0"
    >
      <span className="absolute top-5 left-5 font-mono text-[7px] uppercase tracking-[0.18em] text-[var(--muted)]">
        Object study / Phase 02
      </span>

      <div className="relative flex aspect-square w-[58%] max-w-72 items-center justify-center rounded-full border border-[var(--line-soft)]">
        <span className="absolute inset-x-[-12%] top-1/2 h-px bg-[var(--line-soft)]" />
        <span className="absolute inset-y-[-12%] left-1/2 w-px bg-[var(--line-soft)]" />
        <span className="h-2 w-2 rounded-full border border-[var(--accent)]" />
      </div>

      <span className="absolute right-5 bottom-5 font-mono text-[7px] uppercase tracking-[0.16em] text-[var(--muted)]">
        [ 3D object placeholder ]
      </span>
    </div>
  );
}
