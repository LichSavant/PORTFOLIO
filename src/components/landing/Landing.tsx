import type { CSSProperties } from "react";

import Navigation from "./Navigation";
import HeroCopy from "./HeroCopy";
import PortraitField from "./PortraitField";
import SystemHUD from "./SystemHUD";
import StructureFocus from "./StructureFocus";

/* ============================================================
   STATIC GRAPH DATA
============================================================ */

const GRAPH_POINTS = Array.from(
  { length: 42 },
  (_, index) => ({
    cx: index * 19,
    cy:
      143 -
      Math.sin(index * 0.57) * 18 -
      Math.sin(index * 0.19) * 8,
  })
);

const TELEMETRY_BARS = [
  7,
  12,
  5,
  18,
  8,
  26,
  10,
  14,
  7,
  22,
  32,
  11,
  17,
  8,
  38,
  15,
  9,
  29,
  13,
  21,
  7,
  35,
  16,
  10,
  25,
  8,
];

/* ============================================================
   BOTTOM TRANSITION
============================================================ */

const BOTTOM_BLUR_STYLE: CSSProperties = {
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",

  WebkitMaskImage: `
    linear-gradient(
      to top,
      black 0%,
      rgba(0, 0, 0, 0.7) 24%,
      rgba(0, 0, 0, 0.24) 56%,
      transparent 100%
    )
  `,

  maskImage: `
    linear-gradient(
      to top,
      black 0%,
      rgba(0, 0, 0, 0.7) 24%,
      rgba(0, 0, 0, 0.24) 56%,
      transparent 100%
    )
  `,
};

/* ============================================================
   CROSSHAIR
============================================================ */

function Crosshair({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`
        hero-crosshair
        pointer-events-none
        absolute
        h-3
        w-3
        ${className}
      `}
    >
      <span
        className="
          absolute
          left-1/2
          top-0
          h-full
          w-px
          -translate-x-1/2
          bg-current
        "
      />

      <span
        className="
          absolute
          left-0
          top-1/2
          h-px
          w-full
          -translate-y-1/2
          bg-current
        "
      />
    </span>
  );
}

/* ============================================================
   RIGHT TELEMETRY RAIL
============================================================ */

function RightTelemetryRail() {
  const points = [8, 26, 50, 73, 92];

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        right-[3.2%]
        top-[29%]
        z-30
        hidden
        h-[34%]
        w-6
        xl:block
      "
    >
      <div
        className="
          absolute
          bottom-0
          left-1/2
          top-0
          w-px
          -translate-x-1/2
          bg-[var(--line)]
        "
      />

      {points.map((top, index) => {
        const isActive = index === 2;

        return (
          <span
            key={top}
            className={`
              absolute
              left-1/2
              -translate-x-1/2
              rounded-full

              ${
                isActive
                  ? `
                    h-2.5
                    w-2.5
                    border
                    border-[rgba(40,100,255,0.22)]
                    bg-[var(--accent)]
                    shadow-[0_0_0_5px_rgba(40,100,255,0.08)]
                  `
                  : `
                    h-1.5
                    w-1.5
                    bg-[rgba(8,8,8,0.28)]
                  `
              }
            `}
            style={{
              top: `${top}%`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   LANDING
============================================================ */

export default function Landing() {
  return (
    <main
      id="home"
      className="
        relative
        isolate
        min-h-[100svh]
        overflow-hidden
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      {/* BACKGROUND GRID */}
      <div
        aria-hidden="true"
        className="
          technical-grid
          pointer-events-none
          absolute
          inset-0
          z-0
        "
      />

      {/* SUBTLE CENTRAL LIGHT */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-[radial-gradient(circle_at_58%_45%,rgba(255,255,255,0.62),transparent_37%)]
        "
      />

      {/* =====================================================
          HERO
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-[100svh]
          flex-col
        "
      >
        <Navigation />

        <div
          className="
            page-frame
            hero-stage
            relative
            flex-1
          "
        >
          {/* ASCII DNA */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-10
              overflow-visible
            "
          >
            <PortraitField />
          </div>

          {/* BOTTOM SOFT TRANSITION */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-[-6vw]
              bottom-0
              z-[15]
              h-[8vh]
            "
            style={BOTTOM_BLUR_STYLE}
          />

          {/* HERO COPY */}
          <HeroCopy />

          {/* SYSTEM HUD */}
          <SystemHUD />

          {/* =================================================
              TRUE FOCUS STRUCTURE DATA
          ================================================== */}

          <StructureFocus />

          {/* =================================================
              VERY SPARSE TECH MARKERS
          ================================================== */}

          <Crosshair
            className="
              left-[45%]
              top-[18%]
              text-[var(--accent)]
              opacity-55
            "
          />

          <Crosshair
            className="
              left-[72%]
              top-[52%]
              text-[var(--accent)]
              opacity-35
            "
          />

          <span
            aria-hidden="true"
            className="
              hero-floating-dot
              pointer-events-none
              absolute
              left-[46.5%]
              top-[69%]
              z-[22]
              hidden
              h-1
              w-1
              rounded-full
              bg-[var(--accent)]
              xl:block
            "
          />

          {/* =================================================
              BOTTOM TELEMETRY GRAPH
          ================================================== */}

          <svg
            aria-hidden="true"
            focusable="false"
            className="
              hero-graph
              z-[5]
            "
            viewBox="0 0 900 180"
            preserveAspectRatio="none"
          >
            {/* WAVES */}
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            >
              <path
                d="
                  M0 150
                  C95 115 150 154 226 131
                  S355 103 432 133
                  565 124 635 71
                  745 84 900 42
                "
              />

              <path
                opacity=".5"
                d="
                  M0 158
                  C112 142 176 117 250 143
                  S388 133 458 112
                  595 150 664 95
                  760 112 900 66
                "
              />

              <path
                opacity=".23"
                d="
                  M0 166
                  C125 135 196 169 280 151
                  S410 117 500 151
                  650 136 900 96
                "
              />
            </g>

            {/* DATA DOTS */}
            <g
              fill="currentColor"
              opacity=".32"
            >
              {GRAPH_POINTS.map(
                ({ cx, cy }, index) => (
                  <circle
                    key={index}
                    cx={cx}
                    cy={cy}
                    r="0.9"
                  />
                )
              )}
            </g>

            {/* TELEMETRY LINES */}
            <g
              stroke="var(--accent)"
              strokeWidth="0.75"
              opacity=".48"
            >
              {TELEMETRY_BARS.map(
                (height, index) => {
                  const x =
                    475 + index * 15;

                  return (
                    <line
                      key={index}
                      x1={x}
                      x2={x}
                      y1={166}
                      y2={166 - height}
                    />
                  );
                }
              )}
            </g>

            {/* TELEMETRY NODES */}
            <g
              fill="var(--accent)"
              opacity=".72"
            >
              {TELEMETRY_BARS.map(
                (height, index) => {
                  const x =
                    475 + index * 15;

                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={166 - height}
                      r="1.15"
                    />
                  );
                }
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* RIGHT SIDE DATUM RAIL */}
      <RightTelemetryRail />

      {/* =====================================================
          LEFT SCROLL INDICATOR
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[8%]
          left-3
          top-[22%]
          z-40
          hidden
          w-8
          xl:block
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-0
            h-[65%]
            w-px
            bg-[var(--line)]
          "
        />

        <span
          className="
            absolute
            left-0
            top-[34%]
            font-mono
            text-[9px]
            tracking-[0.14em]
            text-[var(--accent)]
          "
        >
          001
        </span>

        <span
          className="
            absolute
            left-[17px]
            top-[34.5%]
            h-1.5
            w-1.5
            rounded-full
            bg-[var(--accent)]
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-[13px]
            flex
            flex-col
            items-center
            gap-4
          "
        >
          <span
            className="
              font-mono
              text-[8px]
              uppercase
              tracking-[0.17em]
              text-[var(--muted)]
            "
            style={{
              writingMode:
                "vertical-rl",
            }}
          >
            Scroll
          </span>

          <span
            className="
              font-mono
              text-sm
              text-[var(--foreground)]
            "
          >
            ↓
          </span>
        </div>
      </div>

      {/* =====================================================
          BOTTOM LABEL
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          page-frame
          pointer-events-none
          absolute
          bottom-5
          left-0
          right-0
          z-40
          hidden
          font-mono
          text-[8px]
          uppercase
          tracking-[0.15em]
          text-[var(--muted)]
          lg:block
        "
      >
        Dhanwil Alcover / Portfolio 2026
      </div>
    </main>
  );
}