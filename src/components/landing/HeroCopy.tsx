export default function HeroCopy() {
  return (
    <section className="relative z-20 flex min-h-[calc(100svh-88px)] min-w-0 w-full flex-col justify-center py-14 pb-24 lg:w-[48%] lg:py-10 lg:pb-20">
      <p className="mb-7 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--foreground)] sm:text-[11px] lg:mb-8">
        <span>Design</span>
        <span className="mx-3 text-[var(--muted)]">.</span>
        <span>Engineer</span>
        <span className="mx-3 text-[var(--muted)]">.</span>
        <span className="text-[var(--accent)]">Solve.</span>
      </p>

      <h1 className="max-w-full text-[clamp(2.9rem,14.5vw,7rem)] leading-[0.83] font-light uppercase tracking-[-0.062em] sm:text-[clamp(4.5rem,12vw,8rem)] lg:max-w-[900px] lg:text-[clamp(5rem,7vw,8.5rem)]">
        Dhanwil
        <br />
        Alcover<span className="text-[var(--accent)]">_</span>
      </h1>

      <div className="mt-7 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.11em] text-[var(--foreground)] sm:text-[12px] lg:mt-8">
        <p>Computer Science Student</p>
        <p>Full-Stack Developer</p>
        <p>UI/UX Designer</p>
      </div>

      <span className="mt-5 block h-px w-6 bg-[var(--foreground)] opacity-50" />

      <p className="mt-5 w-full max-w-[440px] text-[15px] leading-[1.7] text-[var(--muted)] sm:text-base">
        I build digital products and intelligent systems where engineering,
        design, and human impact meet.
      </p>

      <div className="mt-8 flex w-full max-w-[440px] flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-x-10">
        <a
          href="#about"
          className="flex h-14 w-[min(100%,250px)] items-center justify-between bg-[var(--foreground)] px-6 font-mono text-[10px] uppercase tracking-[0.13em] text-white transition-transform duration-300 hover:-translate-y-1 sm:text-[11px]"
        >
          <span>Enter experience</span>
          <span aria-hidden="true">→</span>
        </a>

        <a
          href="#projects"
          className="w-fit border-b border-[var(--foreground)] pb-1 font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--foreground)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] sm:text-[11px]"
        >
          View projects
        </a>
      </div>

      <div className="mt-8">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          Connect
        </p>

        <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.11em] sm:text-[11px]">
          <a href="#" className="transition-colors hover:text-[var(--accent)]">
            GH
          </a>
          <a href="#" className="transition-colors hover:text-[var(--accent)]">
            IN
          </a>
          <a href="#" className="transition-colors hover:text-[var(--accent)]">
            MAIL
          </a>
        </div>
      </div>
    </section>
  );
}
