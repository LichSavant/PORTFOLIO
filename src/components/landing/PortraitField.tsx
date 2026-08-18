export default function PortraitField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-[8%] right-[18%] left-[43%] hidden items-center justify-center lg:flex"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted)] opacity-45">
        [ Object field reserved ]
      </span>
    </div>
  );
}
