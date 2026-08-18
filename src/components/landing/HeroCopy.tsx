export default function HeroCopy() {
  return (
    <div className="relative z-20 flex min-h-[34rem] w-full flex-col justify-center px-5 py-16 sm:px-8 md:min-h-[40rem] lg:min-h-0 lg:px-12 lg:py-20 xl:px-16">
      <p className="mb-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-14">
        <span className="h-px w-7 bg-[var(--accent)]" />
        Design · Engineer · Solve ·
      </p>

      <h1 className="max-w-5xl text-[clamp(3.7rem,10vw,9rem)] leading-[0.84] font-light uppercase tracking-[-0.06em]">
        Dhanwil
        <br />
        Alcover<span className="text-[var(--accent)]">_</span>
      </h1>

      <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted)] sm:text-[9px]">
        <span>Computer Science Student</span>
        <span aria-hidden="true" className="text-[var(--accent)]">
          /
        </span>
        <span>Full-Stack Developer</span>
        <span aria-hidden="true" className="text-[var(--accent)]">
          /
        </span>
        <span>UI/UX Designer</span>
      </div>

      <p className="mt-8 max-w-md text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
        I build digital products and intelligent systems where engineering,
        design, and human impact meet.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-7 sm:mt-12">
        <a
          href="#about"
          className="bg-[var(--foreground)] px-5 py-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--surface)] transition-transform hover:-translate-y-0.5"
        >
          Enter experience →
        </a>

        <a
          href="#projects"
          className="border-b border-[var(--foreground)] pb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          View projects
        </a>
      </div>
    </div>
  );
}
