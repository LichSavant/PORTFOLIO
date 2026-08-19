"use client";

import {
  CSSProperties,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ============================================================
   DNA CONFIG
============================================================ */

const ROWS = 80;
const WIDTH = 70;
const TURNS = 1.27;

/*
 * Carefully spaced luminance ramp.
 * Less noisy than a traditional ASCII gradient.
 */
const SHADE_CHARS = [
  "·",
  ".",
  ":",
  "-",
  "=",
  "+",
  "*",
  "#",
  "%",
  "@",
];

const ASCII_FONT =
  '"IBM Plex Mono", "JetBrains Mono", "Cascadia Mono", "SFMono-Regular", Consolas, monospace';

type DNALine = {
  text: string;

  /*
   * How close this section is to camera.
   */
  depth: number;

  /*
   * Sparse blue highlight.
   */
  accent: boolean;

  /*
   * Additional reflective intensity.
   */
  specularity: number;
};

/* ============================================================
   MATH
============================================================ */

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function smoothstep(
  edge0: number,
  edge1: number,
  x: number
) {
  const t = clamp(
    (x - edge0) /
      (edge1 - edge0),
    0,
    1
  );

  return (
    t *
    t *
    (3 - 2 * t)
  );
}

function shadeCharacter(
  light: number
) {
  const value =
    clamp(light, 0, 1);

  const index =
    Math.round(
      value *
        (
          SHADE_CHARS.length -
          1
        )
    );

  return SHADE_CHARS[index];
}

/* ============================================================
   CENTERLINE / BODY CURVE
============================================================ */

function getCurveOffset(
  t: number,
  time: number
) {
  /*
   * Main sculptural posture.
   *
   * Top slightly right.
   * Midsection bows left.
   * Bottom returns right.
   */

  const upperRight =
    Math.exp(
      -Math.pow(
        (t - 0.05) / 0.22,
        2
      )
    ) * 26;

  const centerLeft =
    -Math.exp(
      -Math.pow(
        (t - 0.47) / 0.265,
        2
      )
    ) * 45;

  const lowerRight =
    Math.exp(
      -Math.pow(
        (t - 0.9) / 0.26,
        2
      )
    ) * 25;

  /*
   * Broad asymmetric shaping.
   */
  const structuralWave =
    Math.sin(
      t * Math.PI * 1.5 +
        0.43
    ) * 5;

  /*
   * Barely perceptible body motion.
   */
  const livingDrift =
    Math.sin(
      t * Math.PI * 1.6 +
        time * 0.42
    ) * 1.15;

  const secondaryDrift =
    Math.sin(
      t * Math.PI * 2.65 -
        time * 0.24 +
        0.6
    ) * 0.38;

  return (
    upperRight +
    centerLeft +
    lowerRight +
    structuralWave +
    livingDrift +
    secondaryDrift
  );
}

/* ============================================================
   DNA GENERATOR
============================================================ */

function buildDNAFrame(
  time: number
): DNALine[] {
  const lines: DNALine[] = [];

  for (
    let row = 0;
    row < ROWS;
    row++
  ) {
    const t =
      row /
      (ROWS - 1);

    /* --------------------------------------------------------
       TWIST
    -------------------------------------------------------- */

    const phaseImperfection =
      Math.sin(
        t * Math.PI * 3.1 +
          time * 0.08
      ) * 0.018 +
      Math.sin(
        t * Math.PI * 7.7 -
          time * 0.045
      ) * 0.006;

    const angle =
      t *
        Math.PI *
        2 *
        TURNS +
      time +
      phaseImperfection;

    const sin =
      Math.sin(angle);

    const cos =
      Math.cos(angle);

    const center =
      WIDTH / 2;

    /* --------------------------------------------------------
       SILHOUETTE
    -------------------------------------------------------- */

    /*
     * Fuller through the middle,
     * cleaner toward ends.
     */
    const bodyVolume =
      0.94 +
      Math.sin(
        t * Math.PI
      ) * 0.06;

    const radiusNoise =
      Math.sin(
        t * Math.PI * 3.35
      ) * 0.0065;

    const breathing =
      Math.sin(
        time * 0.31 +
          t * Math.PI * 1.7
      ) * 0.0018;

    const radius =
      WIDTH *
      (
        0.258 +
        radiusNoise +
        breathing
      ) *
      bodyVolume;

    const strandAX =
      center +
      sin * radius;

    const strandBX =
      center -
      sin * radius;

    const depthA =
      cos;

    const depthB =
      -cos;

    const chars =
      Array(WIDTH).fill(" ");

    /* ========================================================
       STRAND
    ======================================================== */

    function drawStrand(
      x: number,
      depth: number,
      strand:
        | "A"
        | "B"
    ) {
      const depth01 =
        (depth + 1) /
        2;

      /*
       * Foreground strands are subtly larger.
       */
      const perspectiveThickness =
        smoothstep(
          0,
          1,
          depth01
        );

      const thickness =
        3 +
        Math.round(
          perspectiveThickness *
            4
        );

      const core =
        Math.round(x);

      for (
        let offset =
          -thickness;
        offset <=
        thickness;
        offset++
      ) {
        const px =
          core + offset;

        if (
          px < 0 ||
          px >= WIDTH
        ) {
          continue;
        }

        const normalized =
          Math.abs(offset) /
          Math.max(
            thickness,
            1
          );

        /*
         * True circular cross-section approximation.
         */
        const roundProfile =
          Math.sqrt(
            Math.max(
              0,
              1 -
                normalized *
                  normalized
            )
          );

        /* ----------------------------------------------------
           BASE BODY
        ---------------------------------------------------- */

        const body =
          0.09 +
          depth01 * 0.62;

        /* ----------------------------------------------------
           BROAD GLASS / METAL REFLECTION
        ---------------------------------------------------- */

        const satin =
          Math.pow(
            roundProfile,
            0.75
          ) * 0.1;

        /*
         * Narrow central specular.
         */
        const gloss =
          Math.pow(
            roundProfile,
            4.2
          ) * 0.285;

        /*
         * Very sharp hot spot.
         */
        const hotSpecular =
          Math.pow(
            roundProfile,
            9
          ) *
          (
            0.055 +
            depth01 *
              0.05
          );

        /* ----------------------------------------------------
           STUDIO DIRECTIONAL LIGHT
        ---------------------------------------------------- */

        const directional =
          offset < 0
            ? 0.115
            : -0.05;

        /* ----------------------------------------------------
           MOVING REFLECTION
        ---------------------------------------------------- */

        const reflectionBand =
          Math.sin(
            t *
              Math.PI *
              3.75 -
              time *
                1.1 +
              offset *
                0.2
          ) * 0.026;

        /*
         * Secondary slower reflection.
         */
        const secondaryBand =
          Math.sin(
            t *
              Math.PI *
              1.9 +
              time *
                0.48 -
              offset *
                0.1
          ) * 0.012;

        /* ----------------------------------------------------
           MICRO MATERIAL DETAIL
        ---------------------------------------------------- */

        const microSurface =
          Math.sin(
            row * 1.31 +
              offset *
                0.79 +
              time *
                0.23
          ) * 0.0075;

        const strandBias =
          strand === "A"
            ? 0.008
            : -0.004;

        let light =
          body +
          satin +
          gloss +
          hotSpecular +
          directional +
          reflectionBand +
          secondaryBand +
          microSurface +
          strandBias;

        /* ----------------------------------------------------
           EDGE FALLOFF
        ---------------------------------------------------- */

        const rimDarkening =
          1 -
          smoothstep(
            0.58,
            1,
            normalized
          ) *
            0.77;

        light *=
          rimDarkening;

        /*
         * Deep polished rim.
         */
        if (
          normalized >
          0.93
        ) {
          light *= 0.48;
        }

        if (
          normalized >
          0.985
        ) {
          light *= 0.36;
        }

        chars[px] =
          shadeCharacter(
            light
          );
      }

      /* ------------------------------------------------------
         PRIMARY SPECULAR
      ------------------------------------------------------ */

      const highlightDirection =
        depth > 0
          ? -1
          : 1;

      const specular =
        core +
        highlightDirection;

      if (
        specular >= 0 &&
        specular < WIDTH
      ) {
        chars[specular] =
          depth01 > 0.88
            ? "@"
            : depth01 >
                0.72
              ? "%"
              : depth01 >
                  0.52
                ? "#"
                : "*";
      }

      /* ------------------------------------------------------
         SECONDARY SPECULAR
      ------------------------------------------------------ */

      const secondary =
        core +
        highlightDirection *
          2;

      if (
        secondary >= 0 &&
        secondary < WIDTH
      ) {
        chars[secondary] =
          depth01 > 0.72
            ? "#"
            : depth01 >
                0.5
              ? "+"
              : "=";
      }

      /* ------------------------------------------------------
         DARK OPPOSING EDGE
      ------------------------------------------------------ */

      const oppositeRim =
        core -
        highlightDirection *
          thickness;

      if (
        oppositeRim >= 0 &&
        oppositeRim <
          WIDTH
      ) {
        chars[oppositeRim] =
          depth01 > 0.58
            ? ":"
            : "·";
      }
    }

    /* ========================================================
       BRIDGES
    ======================================================== */

    const left =
      Math.round(
        Math.min(
          strandAX,
          strandBX
        )
      );

    const right =
      Math.round(
        Math.max(
          strandAX,
          strandBX
        )
      );

    /*
     * Slightly irregular spacing prevents
     * bridges looking machine-generated.
     */
    const rungPhase =
      t *
        Math.PI *
        12.35 +
      Math.sin(
        t * Math.PI * 4
      ) * 0.12;

    const rungWave =
      Math.sin(
        rungPhase
      );

    const drawBridge =
      Math.abs(
        rungWave
      ) > 0.74 ||
      Math.abs(sin) <
        0.115;

    if (drawBridge) {
      const bridgeDepth =
        Math.max(
          depthA,
          depthB
        );

      const depth01 =
        (
          bridgeDepth + 1
        ) / 2;

      const inset = 5;

      const start =
        left + inset;

      const end =
        right - inset;

      const length =
        Math.max(
          end - start,
          1
        );

      for (
        let x = start;
        x <= end;
        x++
      ) {
        if (
          x < 0 ||
          x >= WIDTH
        ) {
          continue;
        }

        const progress =
          (x - start) /
          length;

        /*
         * Rounded bridge body.
         */
        const centerProfile =
          Math.sin(
            progress *
              Math.PI
          );

        const bridgeGloss =
          Math.pow(
            centerProfile,
            2.25
          );

        /*
         * Slight rim darkness.
         */
        const bridgeEdge =
          Math.pow(
            centerProfile,
            0.55
          );

        const movingReflection =
          Math.sin(
            progress *
              Math.PI *
              2 -
              time *
                0.7 +
              t *
                Math.PI *
                3
          ) * 0.014;

        const bridgeLight =
          0.15 +
          depth01 * 0.24 +
          bridgeEdge * 0.07 +
          bridgeGloss * 0.33 +
          movingReflection;

        let character =
          "·";

        if (
          bridgeLight >
          0.69
        ) {
          character = "=";
        } else if (
          bridgeLight >
          0.52
        ) {
          character = "-";
        } else if (
          bridgeLight >
          0.35
        ) {
          character = ":";
        }

        /*
         * Sparse technical segmentation.
         */
        if (
          x % 8 === 0 &&
          bridgeLight >
            0.48
        ) {
          character = "+";
        }

        chars[x] =
          character;
      }

      /*
       * Premium rounded joints.
       */
      if (
        start >= 0 &&
        start < WIDTH
      ) {
        chars[start] =
          depth01 > 0.78
            ? "O"
            : "o";
      }

      if (
        end >= 0 &&
        end < WIDTH
      ) {
        chars[end] =
          depth01 > 0.78
            ? "O"
            : "o";
      }
    }

    /* ========================================================
       DEPTH ORDERING
    ======================================================== */

    if (
      depthA <
      depthB
    ) {
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

    const frontDepth =
      (
        Math.max(
          depthA,
          depthB
        ) + 1
      ) / 2;

    /*
     * Specularity becomes strongest when
     * a strand is facing toward us.
     */
    const specularity =
      smoothstep(
        0.5,
        1,
        frontDepth
      );

    lines.push({
      text:
        chars.join(""),

      depth:
        frontDepth,

      specularity,

      /*
       * Rare accent streak.
       */
      accent:
        row % 31 === 0 &&
        frontDepth >
          0.86,
    });
  }

  return lines;
}

/* ============================================================
   SHARED TYPOGRAPHY
============================================================ */

const BASE_TEXT_STYLE: CSSProperties = {
  fontFamily:
    ASCII_FONT,

  fontVariantLigatures:
    "none",

  fontKerning:
    "none",

  textRendering:
    "geometricPrecision",

  WebkitFontSmoothing:
    "antialiased",
};

/* ============================================================
   DNA LAYERS
============================================================ */

type LayerType =
  | "ambient"
  | "contact"
  | "reflection"
  | "main";

type LayerProps = {
  lines: DNALine[];
  time: number;
  type: LayerType;
};

const DNALayer =
  memo(
    function DNALayer({
      lines,
      time,
      type,
    }: LayerProps) {
      const isMain =
        type === "main";

      const isReflection =
        type ===
        "reflection";

      let transform = `
        rotateZ(-1.5deg)
        scaleX(1.18)
        scaleY(1.29)
      `;

      if (
        type ===
        "ambient"
      ) {
        transform = `
          translate3d(
            22px,
            27px,
            0
          )
          rotateZ(-1.5deg)
          scaleX(1.18)
          scaleY(1.29)
        `;
      }

      if (
        type ===
        "contact"
      ) {
        transform = `
          translate3d(
            7px,
            9px,
            0
          )
          rotateZ(-1.5deg)
          scaleX(1.18)
          scaleY(1.29)
        `;
      }

      if (
        type ===
        "reflection"
      ) {
        transform = `
          translate3d(
            -1.3px,
            -1.2px,
            0
          )
          rotateZ(-1.5deg)
          scaleX(1.18)
          scaleY(1.29)
        `;
      }

      if (isMain) {
        transform = `
          perspective(
            1600px
          )
          rotateZ(-1.5deg)
          scaleX(1.18)
          scaleY(1.29)
        `;
      }

      const className =
        type ===
        "ambient"
          ? `
              absolute
              text-black/[0.022]
              blur-[4.5px]
            `
          : type ===
              "contact"
            ? `
                absolute
                text-black/[0.07]
                blur-[0.65px]
              `
            : type ===
                "reflection"
              ? `
                  absolute
                  text-white
                `
              : `
                  relative
                  z-10
                `;

      return (
        <pre
          className={`
            ${className}

            m-0
            select-none
            whitespace-pre
            font-semibold
            text-[clamp(12px,0.9vw,17px)]
            leading-[0.775]
            tracking-[-0.105em]
          `}
          style={{
            ...BASE_TEXT_STYLE,

            transform,

            transformOrigin:
              "center",

            backfaceVisibility:
              "hidden",

            contain:
              "layout paint",

            willChange:
              isMain
                ? "transform"
                : undefined,
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

              const curve =
                getCurveOffset(
                  t,
                  time
                );

              /*
               * Shadow layers only need silhouette.
               */
              if (
                type ===
                  "ambient" ||
                type ===
                  "contact"
              ) {
                return (
                  <span
                    key={index}
                    className="block"
                    style={{
                      transform: `
                        translate3d(
                          ${curve}px,
                          0,
                          0
                        )
                      `,
                    }}
                  >
                    {
                      line.text
                    }
                  </span>
                );
              }

              /*
               * Reflection layer:
               * visible primarily on brightest,
               * closest sections.
               */
              if (
                isReflection
              ) {
                const reflectionOpacity =
                  line.specularity *
                  0.105;

                return (
                  <span
                    key={index}
                    className="block"
                    style={{
                      transform: `
                        translate3d(
                          ${curve}px,
                          0,
                          0
                        )
                      `,

                      opacity:
                        reflectionOpacity,

                      filter:
                        "blur(0.25px)",
                    }}
                  >
                    {
                      line.text
                    }
                  </span>
                );
              }

              /* =================================================
                 MAIN LAYER
              ================================================= */

              const microSway =
                Math.sin(
                  t *
                    Math.PI *
                    2.1 +
                    time *
                      0.63
                ) * 0.34;

              /*
               * Tiny perspective change.
               */
              const horizontalScale =
                0.955 +
                line.depth *
                  0.07;

              /*
               * True front/back tonal separation.
               */
              const opacity =
                0.37 +
                line.depth *
                  0.63;

              const brightness =
                0.59 +
                line.depth *
                  0.5;

              const contrast =
                0.99 +
                line.depth *
                  0.37;

              /*
               * Rear portions soften just slightly.
               */
              const rearBlur =
                line.depth <
                0.13
                  ? 0.22
                  : line.depth <
                      0.22
                    ? 0.08
                    : 0;

              const shadowStrength =
                line.depth >
                0.82
                  ? `
                      -1px -1px 0 rgba(255,255,255,1),
                      -2px -1px 1px rgba(255,255,255,0.23),

                      1px 1px 1px rgba(0,0,0,0.17),
                      2px 2px 3px rgba(0,0,0,0.045),
                      4px 4px 8px rgba(0,0,0,0.018)
                    `
                  : line.depth >
                      0.52
                    ? `
                        -1px 0 0 rgba(255,255,255,0.42),

                        1px 1px 1px rgba(0,0,0,0.08),
                        2px 2px 3px rgba(0,0,0,0.02)
                      `
                    : `
                        1px 1px 1px rgba(0,0,0,0.028)
                      `;

              return (
                <span
                  key={index}
                  className="block"
                  style={{
                    transform: `
                      translate3d(
                        ${
                          curve +
                          microSway
                        }px,
                        0,
                        0
                      )

                      scaleX(
                        ${horizontalScale}
                      )
                    `,

                    opacity,

                    color:
                      line.accent
                        ? "#2864ff"
                        : "#090909",

                    filter: `
                      brightness(
                        ${brightness}
                      )

                      contrast(
                        ${contrast}
                      )

                      blur(
                        ${rearBlur}px
                      )
                    `,

                    textShadow:
                      shadowStrength,
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
      );
    }
  );

/* ============================================================
   PORTRAIT FIELD
============================================================ */

export default function PortraitField() {
  const [time, setTime] =
    useState(0);

  const frameRef =
    useRef<number | null>(
      null
    );

  const startTimeRef =
    useRef<number | null>(
      null
    );

  const previousRenderRef =
    useRef(0);

  useEffect(() => {
    /*
     * ~60 fps ceiling.
     *
     * Prevents unnecessary React updates
     * if the browser runs rAF above 60 Hz.
     */
    const FRAME_INTERVAL =
      1000 / 60;

    const animate = (
      now: number
    ) => {
      if (
        startTimeRef.current ===
        null
      ) {
        startTimeRef.current =
          now;
      }

      const sinceRender =
        now -
        previousRenderRef.current;

      if (
        sinceRender >=
        FRAME_INTERVAL
      ) {
        previousRenderRef.current =
          now -
          (
            sinceRender %
            FRAME_INTERVAL
          );

        const elapsed =
          (
            now -
            startTimeRef.current
          ) / 1000;

        /*
         * Primary twist speed.
         *
         * Slow enough to feel expensive,
         * fast enough to visibly move.
         */
        setTime(
          elapsed *
            0.072
        );
      }

      frameRef.current =
        requestAnimationFrame(
          animate
        );
    };

    frameRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }
    };
  }, []);

  const lines =
    useMemo(
      () =>
        buildDNAFrame(
          time
        ),
      [time]
    );

  return (
    <div
      aria-hidden="true"
      className="
        portrait-field
        pointer-events-none
        absolute
        hidden
        lg:block
        overflow-visible
      "
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
        {/* LARGE AMBIENT DEPTH */}
        <DNALayer
          lines={lines}
          time={time}
          type="ambient"
        />

        {/* TIGHT CONTACT SHADOW */}
        <DNALayer
          lines={lines}
          time={time}
          type="contact"
        />

        {/* SUBTLE GLASS REFLECTION */}
        <DNALayer
          lines={lines}
          time={time}
          type="reflection"
        />

        {/* MAIN SCULPTURE */}
        <DNALayer
          lines={lines}
          time={time}
          type="main"
        />
      </div>
    </div>
  );
}