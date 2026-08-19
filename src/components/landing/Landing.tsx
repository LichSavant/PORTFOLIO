import type { CSSProperties } from "react";

import Navigation from "./Navigation";
import HeroCopy from "./HeroCopy";
import PortraitField from "./PortraitField";
import SystemHUD from "./SystemHUD";

/* ============================================================
   STATIC HERO GRAPH DATA

   Defined once instead of regenerating the circle coordinates
   every time Landing renders.
============================================================ */

const GRAPH_POINTS = Array.from(
  { length: 36 },
  (_, index) => ({
    cx: index * 22,
    cy:
      145 -
      Math.sin(index * 0.63) * 22,
  })
);

/* ============================================================
   BOTTOM TRANSITION

   No top blur anymore.

   This is intentionally lighter than the previous 7px blur.
   It only softens the very bottom edge of the DNA/graph so the
   hero still transitions naturally into the next section.
============================================================ */

const BOTTOM_BLUR_STYLE: CSSProperties = {
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",

  WebkitMaskImage: `
    linear-gradient(
      to top,
      black 0%,
      rgba(0, 0, 0, 0.82) 24%,
      rgba(0, 0, 0, 0.38) 58%,
      transparent 100%
    )
  `,

  maskImage: `
    linear-gradient(
      to top,
      black 0%,
      rgba(0, 0, 0, 0.82) 24%,
      rgba(0, 0, 0, 0.38) 58%,
      transparent 100%
    )
  `,
};

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
      {/* =====================================================
          BACKGROUND GRID
      ====================================================== */}

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

      {/* =====================================================
          MAIN HERO
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
        {/* ===================================================
            NAVIGATION

            Navigation already controls its own stacking.
            No additional positioning wrapper needed.
        ==================================================== */}

        <Navigation />

        {/* ===================================================
            HERO STAGE
        ==================================================== */}

        <div
          className="
            page-frame
            hero-stage
            relative
            flex-1
          "
        >
          {/* =================================================
              ASCII DNA

              Dedicated layer below text/HUD.

              We intentionally do NOT add top masking or blur.
              The sculpture can remain sharp all the way through
              the upper viewport.
          ================================================== */}

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

          {/* =================================================
              BOTTOM TRANSITION ONLY

              Kept below hero content but above DNA.
          ================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-[-6vw]
              bottom-0
              z-[15]
              h-[10vh]
            "
            style={BOTTOM_BLUR_STYLE}
          />

          {/* =================================================
              HERO COPY

              HeroCopy already owns its grid-column layout and
              z-index, so no display:contents wrapper is needed.
          ================================================== */}

          <HeroCopy />

          {/* =================================================
              SYSTEM HUD
          ================================================== */}

          <SystemHUD />

          {/* =================================================
              TECHNICAL GRAPH

              Lower than the DNA/content so it reads as a subtle
              environmental detail rather than another foreground
              element.
          ================================================== */}

          <svg
            aria-hidden="true"
            focusable="false"
            className="
              hero-graph
              z-[5]
            "
            viewBox="0 0 760 170"
            preserveAspectRatio="none"
          >
            {/* CURVES */}

            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              vectorEffect="non-scaling-stroke"
            >
              <path
                d="
                  M0 146
                  C90 112 150 150 230 121
                  S360 94 430 126
                  565 116 620 58
                  704 72 760 16
                "
              />

              <path
                opacity=".55"
                d="
                  M0 153
                  C95 139 154 109 228 138
                  S358 128 430 105
                  560 145 628 88
                  704 105 760 52
                "
              />

              <path
                opacity=".3"
                d="
                  M0 160
                  C120 126 176 161 258 145
                  S390 108 470 143
                  600 126 760 85
                "
              />
            </g>

            {/* GRAPH POINTS */}

            <g
              fill="currentColor"
              opacity=".55"
            >
              {GRAPH_POINTS.map(
                ({ cx, cy }, index) => (
                  <circle
                    key={index}
                    cx={cx}
                    cy={cy}
                    r="1"
                  />
                )
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* =====================================================
          LEFT SCROLL INDICATOR
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          top-[22%]
          bottom-[8%]
          left-3
          z-40
          hidden
          w-8
          xl:block
        "
      >
        {/* VERTICAL RULE */}

        <div
          className="
            absolute
            top-0
            left-1/2
            h-[65%]
            w-px
            bg-[var(--line)]
          "
        />

        {/* SECTION NUMBER */}

        <span
          className="
            absolute
            top-[34%]
            left-0
            font-mono
            text-[9px]
            tracking-[0.14em]
            text-[var(--accent)]
          "
        >
          001
        </span>

        {/* BLUE MARKER */}

        <span
          className="
            absolute
            top-[34.5%]
            left-[17px]
            h-1.5
            w-1.5
            rounded-full
            bg-[var(--accent)]
          "
        />

        {/* SCROLL LABEL */}

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
              writingMode: "vertical-rl",
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
          BOTTOM PORTFOLIO LABEL
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          page-frame
          pointer-events-none
          absolute
          right-0
          bottom-5
          left-0
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