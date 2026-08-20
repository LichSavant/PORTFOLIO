import AsciiPortrait from "./AsciiPortrait";
import TechDriftWall from "./TechDriftWall";

const TECH = [
  { name: "Python", image: "/tech/python.svg" },
  { name: "Java", image: "/tech/java.svg" },
  { name: "C", image: "/tech/c.svg" },
  { name: "JavaScript", image: "/tech/javascript.svg" },
  { name: "TypeScript", image: "/tech/typescript.svg" },
  { name: "Node.js", image: "/tech/node.svg" },
  { name: "Next.js", image: "/tech/nextjs.svg" },
  { name: "React", image: "/tech/react.svg" },
  { name: "Vercel", image: "/tech/vercel.svg" },
  { name: "VS Code", image: "/tech/vscode.svg" },
  { name: "Supabase", image: "/tech/supabase.svg" },
  { name: "GitHub", image: "/tech/github.svg" },
  { name: "Git", image: "/tech/git.svg" },
  { name: "Figma", image: "/tech/figma.svg" },
  { name: "PostgreSQL", image: "/tech/postgresql.svg" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative isolate min-h-[100svh] overflow-hidden bg-white"
    >
      <div className="absolute inset-0 z-0">
        <TechDriftWall
          items={TECH}
          columns={5}
          tileWidth={150}
          tileHeight={96}
          gap={22}
          tilt={12}
          turn={-12}
          perspective={1300}
          depth={100}
          speed={22}
          variance={0.28}
        />
      </div>

      <div className="relative z-20 min-h-[100svh] bg-transparent">
        <AsciiPortrait />
      </div>
    </section>
  );
}
