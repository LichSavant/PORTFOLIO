export default function HeroCopy() {
  return (
    <section className="hero-copy relative z-20 flex min-w-0 flex-col justify-center">
      <p className="mb-7 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--foreground)] sm:text-[11px] lg:mb-8">
        <span>Design</span>
        <span className="mx-3 text-[var(--muted)]">.</span>
        <span>Engineer</span>
        <span className="mx-3 text-[var(--muted)]">.</span>
        <span className="text-[var(--accent)]">Solve.</span>
      </p>

      <h1 className="hero-title max-w-full font-light uppercase">
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
