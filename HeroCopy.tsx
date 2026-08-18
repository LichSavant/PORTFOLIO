export default function HeroCopy() {
  return (
    <div className="relative z-20 flex w-full flex-col justify-center px-7 py-16 md:w-[45%] md:px-12 lg:px-16">
      <div className="mb-12 font-mono text-[9px] leading-relaxed tracking-[0.12em] text-white/25">
        <p>&gt; INITIALIZING PORTFOLIO.EXE</p>
        <p>&gt; USER: DHANWIL</p>
        <p>&gt; STATUS: AVAILABLE</p>
      </div>

      <p className="mb-3 font-mono text-xs tracking-[0.08em] text-white/60">
        Hello, I'm
      </p>

      <h1 className="max-w-[680px] text-[clamp(3.5rem,7vw,8rem)] font-medium leading-[0.83] tracking-[-0.065em]">
        Dhanwil
        <br />
        Alcover<span className="animate-cursor">_</span>
      </h1>

      <div className="mt-8 space-y-1 font-mono text-[12px] leading-relaxed text-white/65">
        <p>Computer Science Student</p>
        <p>Full-Stack Developer</p>
        <p>UI/UX Designer</p>
      </div>

      <p className="mt-8 max-w-[430px] text-sm leading-6 text-white/45">
        I build thoughtful digital products where engineering,
        design, and intelligent systems meet.
      </p>

      <div className="mt-10 flex items-center gap-7">
        <a
          href="#projects"
          className="group border border-white/25 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] transition-all hover:bg-white hover:text-black"
        >
          &gt; View my work
        </a>

        <a
          href="#contact"
          className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-white"
        >
          Contact me →
        </a>
      </div>
    </div>
  );
}