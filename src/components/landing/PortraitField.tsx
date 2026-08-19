"use client";

import { useEffect, useMemo, useState } from "react";

const ROWS = 72;
const WIDTH = 72;
const TURNS = 1.34;

// Darkest → brightest
const SHADE_CHARS = [
  ".",
  ":",
  ";",
  "-",
  "=",
  "+",
  "*",
  "#",
  "%",
  "@",
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function shadeCharacter(light: number) {
  const value = clamp(light, 0, 1);

  return SHADE_CHARS[
    Math.round(value * (SHADE_CHARS.length - 1))
  ];
}

type DNALine = {
  text: string;
  frontness: number;
  accent: boolean;
};

function buildDNAFrame(time: number): DNALine[] {
  const lines: DNALine[] = [];

  for (let row = 0; row < ROWS; row++) {
    const t = row / (ROWS - 1);

    /*
     * Slightly irregular helix shape.
     * Keeps it from feeling perfectly mechanical.
     */
    const organicPhase =
      Math.sin(t * Math.PI * 4.2 + time * 0.025) * 0.055 +
      Math.sin(t * Math.PI * 10.4 - time * 0.018) * 0.018;

    const angle =
      t * Math.PI * 2 * TURNS +
      time +
      organicPhase;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const center = WIDTH / 2;

    /*
     * Preserve original silhouette.
     */
    const radiusVariation =
      Math.sin(t * Math.PI * 5.1) * 0.018 +
      Math.sin(t * Math.PI * 11.7) * 0.006;

    /*
     * Extremely subtle breathing.
     * Changes the geometry itself rather than scaling
     * the entire DNA object.
     */
    const breathingRadius =
      Math.sin(time * 0.23 + t * Math.PI * 1.8) * 0.006;

    const radius =
      WIDTH *
      (
        0.285 +
        radiusVariation +
        breathingRadius
      );

    /*
     * Tiny organic lateral movement.
     */
    const strandAX =
      center +
      sin * radius +
      Math.sin(t * 14 + time * 0.08) * 0.55;

    const strandBX =
      center -
      sin * radius +
      Math.cos(t * 13 - time * 0.07) * 0.55;

    const depthA = cos;
    const depthB = -cos;

    const chars = Array(WIDTH).fill(" ");

    function drawStrand(
      x: number,
      depth: number,
      strand: "A" | "B"
    ) {
      const depth01 = (depth + 1) / 2;

      /*
       * Slightly thicker than your previous version,
       * but not dramatically larger.
       */
      const breathingThickness =
        Math.sin(
          t * Math.PI * 3.5 +
          time * 0.28
        ) * 0.65;

      const thickness =
        5 +
        Math.round(
          depth01 * 4 +
          breathingThickness
        );

      const core = Math.round(x);

      for (
        let offset = -thickness;
        offset <= thickness;
        offset++
      ) {
        const px = core + offset;

        if (px < 0 || px >= WIDTH) {
          continue;
        }

        const normalizedDistance =
          Math.abs(offset) /
          Math.max(thickness, 1);

        /*
         * Fake cylindrical form.
         */
        const cylindrical =
          Math.cos(
            normalizedDistance *
              Math.PI *
              0.5
          );

        /*
         * Main light source is upper-left/front.
         */
        const directional =
          offset < 0 ? 0.125 : -0.055;

        /*
         * Front side brighter.
         * Back side darker.
         */
        const depthLight =
          0.17 + depth01 * 0.62;

        const strandBias =
          strand === "A"
            ? 0.035
            : -0.015;

        /*
         * Slow-moving light running down the helix.
         */
        const travelingLight =
          Math.sin(
            t * Math.PI * 4.5 -
            time * 0.45 +
            offset * 0.12
          ) * 0.07;

        /*
         * Small surface texture variation.
         */
        const microTexture =
          Math.sin(
            row * 1.41 +
            offset * 0.88 +
            time * 0.2
          ) * 0.028;

        let light =
          depthLight *
            (0.4 + cylindrical * 0.72) +
          directional +
          strandBias +
          travelingLight +
          microTexture;

        /*
         * Dark edge makes each strand feel rounded.
         */
        if (normalizedDistance > 0.82) {
          light *= 0.42;
        }

        chars[px] = shadeCharacter(light);
      }

      /*
       * Main specular streak.
       */
      const highlightOffset =
        depth > 0 ? -2 : 1;

      const subtleHighlightMotion =
        Math.round(
          Math.sin(
            t * Math.PI * 3.2 -
            time * 0.18
          ) * 0.5
        );

      for (let h = 0; h < 2; h++) {
        const highlight =
          core +
          highlightOffset +
          subtleHighlightMotion +
          h;

        if (
          highlight >= 0 &&
          highlight < WIDTH
        ) {
          chars[highlight] =
            depth01 > 0.8
              ? "@"
              : depth01 > 0.6
                ? "%"
                : "#";
        }
      }

      /*
       * Secondary soft highlight.
       */
      const secondaryHighlight =
        core +
        (depth > 0 ? 1 : -1);

      if (
        secondaryHighlight >= 0 &&
        secondaryHighlight < WIDTH
      ) {
        chars[secondaryHighlight] =
          depth01 > 0.62
            ? "+"
            : "=";
      }

      /*
       * Dark rim opposite the highlight.
       */
      const rim =
        core +
        (
          depth > 0
            ? thickness
            : -thickness
        );

      if (
        rim >= 0 &&
        rim < WIDTH
      ) {
        chars[rim] =
          depth01 > 0.6
            ? ":"
            : ".";
      }
    }

    const left = Math.round(
      Math.min(strandAX, strandBX)
    );

    const right = Math.round(
      Math.max(strandAX, strandBX)
    );

    /*
     * DNA bridge pattern.
     */
    const rungWave =
      Math.sin(
        t * Math.PI * 15.5 +
        time * 0.025
      );

    const drawBridge =
      Math.abs(rungWave) > 0.68 ||
      Math.abs(sin) < 0.17;

    if (drawBridge) {
      const bridgeDepth =
        Math.max(depthA, depthB);

      const bridgeDepth01 =
        (bridgeDepth + 1) / 2;

      const inset = 8;

      for (
        let x = left + inset;
        x <= right - inset;
        x++
      ) {
        if (
          x < 0 ||
          x >= WIDTH
        ) {
          continue;
        }

        const progress =
          (x - (left + inset)) /
          Math.max(
            right -
              left -
              inset * 2,
            1
          );

        /*
         * Slightly brighter bridge center.
         */
        const centerHighlight =
          Math.sin(progress * Math.PI);

        /*
         * Internal light pulse.
         */
        const bridgePulse =
          Math.sin(
            time * 0.28 +
            t * Math.PI * 5
          ) * 0.045;

        const bridgeLight =
          bridgeDepth01 * 0.54 +
          centerHighlight * 0.22 +
          bridgePulse;

        let character = ".";

        if (bridgeLight > 0.68) {
          character = "=";
        } else if (bridgeLight > 0.46) {
          character = "-";
        } else if (bridgeLight > 0.28) {
          character = ":";
        }

        /*
         * Segmented structure.
         */
        if (
          x % 5 === 0 &&
          bridgeLight > 0.46
        ) {
          character = "+";
        }

        chars[x] = character;
      }

      /*
       * Connector nodes.
       */
      const nodeLeft =
        left + inset + 1;

      const nodeRight =
        right - inset - 1;

      if (
        nodeLeft >= 0 &&
        nodeLeft < WIDTH
      ) {
        chars[nodeLeft] =
          bridgeDepth01 > 0.62
            ? "O"
            : "o";
      }

      if (
        nodeRight >= 0 &&
        nodeRight < WIDTH
      ) {
        chars[nodeRight] =
          bridgeDepth01 > 0.62
            ? "O"
            : "o";
      }
    }

    /*
     * Correct depth ordering.
     */
    if (depthA < depthB) {
      drawStrand(
        strandAX,
        depthA,
        "A"
      );

      drawStrand(
        strandBX,
        depthB,
        "B"
      );
    } else {
      drawStrand(
        strandBX,
        depthB,
        "B"
      );

      drawStrand(
        strandAX,
        depthA,
        "A"
      );
    }

    const frontness =
      (
        Math.max(
          depthA,
          depthB
        ) + 1
      ) / 2;

    lines.push({
      text: chars.join(""),
      frontness,

      /*
       * Very sparse blue accents.
       */
      accent:
        row % 27 === 0 &&
        frontness > 0.8,
    });
  }

  return lines;
}

export default function PortraitField() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame = 0;

    let previous =
      performance.now();

    const animate = (
      now: number
    ) => {
      const delta = Math.min(
        (now - previous) /
          1000,
        0.05
      );

      previous = now;

      /*
       * Slower than previous 0.16.
       * Still noticeable enough to feel alive.
       */
      setTime(
        (current) =>
          current +
          delta * 0.12
      );

      frame =
        requestAnimationFrame(
          animate
        );
    };

    frame =
      requestAnimationFrame(
        animate
      );

    return () => {
      cancelAnimationFrame(
        frame
      );
    };
  }, []);

  const lines = useMemo(
    () =>
      buildDNAFrame(time),
    [time]
  );

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        hidden
        lg:block
        overflow-visible
      "
      style={{
        left: "24%",
        right: "8%",
        top: "-20%",
        bottom: "-22%",
      }}
    >
      <div
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
          overflow-visible
        "
      >
        {/* =========================================
            FAR SOFT SHADOW
        ========================================= */}

        <pre
          className="
            absolute
            m-0
            select-none
            whitespace-pre
            font-mono
            font-black
            text-[clamp(11px,0.83vw,16px)]
            leading-[0.78]
            tracking-[-0.12em]
            text-black/[0.05]
            blur-[3px]
          "
          style={{
            transform: `
              translate(20px, 24px)
              rotateZ(18deg)
              scaleX(1.30)
              scaleY(1.20)
            `,
            transformOrigin:
              "center",
          }}
        >
          {lines.map(
            (
              line,
              index
            ) => (
              <span
                key={index}
                className="block"
              >
                {line.text}
              </span>
            )
          )}
        </pre>

        {/* =========================================
            NEAR OCCLUSION SHADOW
        ========================================= */}

        <pre
          className="
            absolute
            m-0
            select-none
            whitespace-pre
            font-mono
            font-black
            text-[clamp(11px,0.83vw,16px)]
            leading-[0.78]
            tracking-[-0.12em]
            text-black/[0.11]
            blur-[1px]
          "
          style={{
            transform: `
              translate(10px, 13px)
              rotateZ(18deg)
              scaleX(1.30)
              scaleY(1.20)
            `,
            transformOrigin:
              "center",
          }}
        >
          {lines.map(
            (
              line,
              index
            ) => (
              <span
                key={index}
                className="block"
              >
                {line.text}
              </span>
            )
          )}
        </pre>

        {/* =========================================
            SECONDARY DEPTH LAYER
        ========================================= */}

        <pre
          className="
            absolute
            m-0
            select-none
            whitespace-pre
            font-mono
            font-black
            text-[clamp(11px,0.83vw,16px)]
            leading-[0.78]
            tracking-[-0.12em]
            text-black/[0.045]
          "
          style={{
            transform: `
              translate(-4px, 4px)
              rotateZ(18deg)
              scaleX(1.31)
              scaleY(1.20)
            `,
            transformOrigin:
              "center",
          }}
        >
          {lines.map(
            (
              line,
              index
            ) => (
              <span
                key={index}
                className="block"
              >
                {line.text}
              </span>
            )
          )}
        </pre>

        {/* =========================================
            MAIN ASCII DNA
        ========================================= */}

        <pre
          className="
            relative
            z-10
            m-0
            select-none
            whitespace-pre
            font-mono
            font-black
            text-[clamp(11px,0.83vw,16px)]
            leading-[0.78]
            tracking-[-0.12em]
            antialiased
          "
          style={{
            transform: `
              perspective(1300px)
              rotateZ(18deg)
              scaleX(1.30)
              scaleY(1.20)
            `,
            transformOrigin:
              "center",
          }}
        >
          {lines.map(
            (
              line,
              index
            ) => {
              const t =
                index /
                Math.max(
                  lines.length -
                    1,
                  1
                );

              const angle =
                t *
                  Math.PI *
                  2 *
                  TURNS +
                time;

              const depth =
                (
                  Math.cos(
                    angle
                  ) + 1
                ) / 2;

              /*
               * Stronger front/back depth.
               */
              const opacity =
                0.3 +
                depth * 0.7;

              const scaleX =
                0.9 +
                depth * 0.2;

              /*
               * Tiny organic sway only.
               */
              const sway =
                Math.sin(
                  t *
                    Math.PI *
                    2.1 +
                    time *
                      0.22
                ) * 1.6;

              const brightness =
                0.54 +
                depth * 0.52;

              const contrast =
                0.93 +
                depth * 0.46;

              /*
               * Slight depth-of-field.
               */
              const blur =
                depth < 0.18
                  ? 0.25
                  : depth <
                      0.3
                    ? 0.1
                    : 0;

              return (
                <span
                  key={index}
                  className="block"
                  style={{
                    opacity,

                    transform: `
                      translateX(${sway}px)
                      scaleX(${scaleX})
                    `,

                    color:
                      line.accent
                        ? "#2563eb"
                        : "#111111",

                    filter: `
                      brightness(${brightness})
                      contrast(${contrast})
                      blur(${blur}px)
                    `,

                    textShadow:
                      depth >
                      0.76
                        ? `
                          -1px -1px 0 rgba(255,255,255,0.95),
                          -2px 0 1px rgba(255,255,255,0.28),
                          1px 1px 1px rgba(0,0,0,0.18),
                          2px 2px 3px rgba(0,0,0,0.05)
                        `
                        : depth >
                            0.45
                          ? `
                            -1px 0 0 rgba(255,255,255,0.42),
                            1px 1px 1px rgba(0,0,0,0.10)
                          `
                          : `
                            1px 1px 1px rgba(0,0,0,0.06)
                          `,
                  }}
                >
                  {
                    line.text
                  }
                </span>
              );
            }
          )}
        </pre>
      </div>
    </div>
  );
}