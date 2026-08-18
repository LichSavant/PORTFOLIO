import { navigationItems } from "@/data/navigation";

export default function Navigation() {
  return (
    <header className="flex h-14 items-center border-b border-white/10 px-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.15em]">
        Dhanwil Alcover
      </div>

      <nav className="ml-auto hidden items-center gap-6 md:flex">
        {navigationItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={`font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
              index === 0 ? "text-white" : "text-white/40 hover:text-white"
            }`}
          >
            _{item.label}
          </a>
        ))}
      </nav>

      <div className="ml-8 hidden font-mono text-[9px] text-white/30 xl:block">
        SYS.ONLINE
      </div>
    </header>
  );
}
