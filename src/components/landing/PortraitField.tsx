"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   CONFIG
============================================================ */

const FONT =
  '"IBM Plex Mono", "Cascadia Mono", "SFMono-Regular", Consolas, monospace';

const GLYPHS = [" ", "·", ".", ":", "-", "=", "+", "*", "#", "%", "@"];

const FPS = 30;
const FRAME_TIME = 1000 / FPS;

const TURNS = 1.27;

const HELIX_RADIUS = 0.205;

const BASE_THICKNESS = 5;
const FRONT_THICKNESS = 4;

/*
 * Smaller value = slower rotation.
 */
const ROTATION_SPEED = 0.24;

/* ============================================================
   HELPERS
============================================================ */

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const range = Math.max(edge1 - edge0, 0.0001);

  const t = clamp((value - edge0) / range, 0, 1);

  return t * t * (3 - 2 * t);
}

function gaussian(value: number, center: number, width: number) {
  const x = (value - center) / width;

  return Math.exp(-(x * x));
}

function glyph(brightness: number) {
  const normalized = clamp(brightness, 0, 1);

  const index = Math.round(
    normalized * (GLYPHS.length - 1)
  );

  return GLYPHS[index];
}

/* ============================================================
   FRAME TYPES
============================================================ */

type FrameRow = {
  text: string;
  depth: number;
};

type StaticRowData = {
  t: number;

  centerBase: number;

  phaseVariation: number;

  radiusMultiplier: number;

  rungStrength: number;
};

/* ============================================================
   PRECOMPUTED ROW DATA
============================================================ */

/*
 * A large amount of the old DNA math depended ONLY on row
 * position, yet it was recalculated every single animation
 * frame.
 *
 * This calculates those values only when the canvas/grid size
 * changes.
 */

function buildStaticRows(
  rows: number,
  columns: number
): StaticRowData[] {
  const result: StaticRowData[] = [];

  for (let row = 0; row < rows; row++) {
    const t =
      row / Math.max(rows - 1, 1);

    /* ----------------------------
       Sculptural centerline
    ---------------------------- */

    const upperRight =
      gaussian(t, 0.055, 0.22) *
      columns *
      0.043;

    const centerLeft =
      -gaussian(t, 0.47, 0.27) *
      columns *
      0.076;

    const lowerRight =
      gaussian(t, 0.9, 0.25) *
      columns *
      0.045;

    const structural =
      Math.sin(
        t *
          Math.PI *
          1.5 +
          0.43
      ) *
      columns *
      0.0055;

    const centerBase =
      columns / 2 +
      upperRight +
      centerLeft +
      lowerRight +
      structural;

    /* ----------------------------
       Twist variation
    ---------------------------- */

    const phaseVariation =
      Math.sin(
        t *
          Math.PI *
          2.2
      ) *
      0.022;

    /* ----------------------------
       Radius / body shape
    ---------------------------- */

    const centerVolume =
      0.955 +
      Math.sin(t * Math.PI) *
        0.055;

    const radiusTexture =
      1 +
      Math.sin(
        t *
          Math.PI *
          4.1
      ) *
        0.008;

    const radiusMultiplier =
      columns *
      HELIX_RADIUS *
      centerVolume *
      radiusTexture;

    /* ----------------------------
       Rungs
    ---------------------------- */

    const rungWave =
      Math.sin(
        t *
          Math.PI *
          19.2
      );

    const rungStrength =
      smoothstep(
        0.76,
        1,
        Math.abs(rungWave)
      );

    result.push({
      t,
      centerBase,
      phaseVariation,
      radiusMultiplier,
      rungStrength,
    });
  }

  return result;
}

/* ============================================================
   FRAME GENERATOR
============================================================ */

function buildFrame(
  rows: number,
  columns: number,
  time: number,
  staticRows: StaticRowData[]
): FrameRow[] {
  const frame = new Array<FrameRow>(rows);

  /*
   * Reusable arrays.
   *
   * Avoids creating unnecessary temporary arrays for every
   * glyph operation.
   */

  for (let row = 0; row < rows; row++) {
    const staticRow = staticRows[row];

    const t = staticRow.t;

    const chars =
      new Array<string>(columns).fill(" ");

    const priority =
      new Float32Array(columns);

    /* ========================================================
       CENTER DRIFT
    ======================================================== */

    const drift =
      Math.sin(
        t *
          Math.PI *
          1.65 +
          time *
            0.2
      ) *
      columns *
      0.0017;

    const center =
      staticRow.centerBase +
      drift;

    /* ========================================================
       ROTATION
    ======================================================== */

    const angle =
      t *
        Math.PI *
        2 *
        TURNS +
      time *
        ROTATION_SPEED +
      staticRow.phaseVariation;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const radius =
      staticRow.radiusMultiplier;

    /* ========================================================
       STRANDS
    ======================================================== */

    const strandA =
      center +
      sin *
        radius;

    const strandB =
      center -
      sin *
        radius;

    const depthA = cos;
    const depthB = -cos;

    /* ========================================================
       PIXEL / CHARACTER WRITER
    ======================================================== */

    function put(
      x: number,
      character: string,
      score: number
    ) {
      const index = Math.round(x);

      if (
        index < 0 ||
        index >= columns
      ) {
        return;
      }

      if (
        score <
        priority[index]
      ) {
        return;
      }

      priority[index] = score;
      chars[index] = character;
    }

    /* ========================================================
       BRIDGES / RUNGS
    ======================================================== */

    const left =
      Math.round(
        Math.min(
          strandA,
          strandB
        )
      );

    const right =
      Math.round(
        Math.max(
          strandA,
          strandB
        )
      );

    const crossingStrength =
      1 -
      smoothstep(
        0.055,
        0.16,
        Math.abs(sin)
      );

    const bridgeStrength =
      Math.max(
        staticRow.rungStrength,
        crossingStrength
      );

    if (
      bridgeStrength > 0.11 &&
      right - left > 10
    ) {
      const inset = 5;

      const start =
        left +
        inset;

      const end =
        right -
        inset;

      const length =
        Math.max(
          end -
            start,
          1
        );

      /*
       * Draw every character for the rung.
       *
       * This is relatively cheap compared with the old
       * blur/filter passes and keeps your DNA detailed.
       */

      for (
        let x = start;
        x <= end;
        x++
      ) {
        const progress =
          (x - start) /
          length;

        const profile =
          Math.sin(
            progress *
              Math.PI
          );

        const centerBrightness =
          profile *
          profile;

        let character = ":";

        if (
          centerBrightness >
          0.18
        ) {
          character = "-";
        }

        if (
          centerBrightness >
          0.42
        ) {
          character = "=";
        }

        if (
          centerBrightness >
          0.72
        ) {
          character = "+";
        }

        /*
         * Mechanical segmentation.
         */
        if (
          (x - start) %
            9 ===
          0
        ) {
          character = "+";
        }

        /*
         * Strong central bridge.
         */
        if (
          Math.abs(
            progress -
              0.5
          ) <
          0.085
        ) {
          character = "=";
        }

        put(
          x,
          character,
          0.25 +
            bridgeStrength *
              0.1
        );
      }

      /*
       * Connection joints
       */

      put(
        start,
        "O",
        0.42
      );

      put(
        start + 1,
        "+",
        0.4
      );

      put(
        end - 1,
        "+",
        0.4
      );

      put(
        end,
        "O",
        0.42
      );
    }

    /* ========================================================
       STRAND DRAWER
    ======================================================== */

    function drawStrand(
      position: number,
      depth: number,
      phaseBias: number
    ) {
      const depth01 =
        (depth + 1) *
        0.5;

      const thickness =
        BASE_THICKNESS +
        Math.round(
          depth01 *
            FRONT_THICKNESS
        );

      const core =
        Math.round(position);

      /*
       * Precompute common values once per strand.
       */

      const inverseThickness =
        1 /
        Math.max(
          thickness,
          1
        );

      const body =
        0.2 +
        depth01 *
          0.43;

      /* ======================================================
         MATERIAL BODY
      ====================================================== */

      for (
        let offset =
          -thickness;
        offset <= thickness;
        offset++
      ) {
        const x =
          core +
          offset;

        if (
          x < 0 ||
          x >= columns
        ) {
          continue;
        }

        const local =
          offset *
          inverseThickness;

        const normalized =
          Math.abs(local);

        /*
         * Faster circular approximation.
         *
         * Still gives the rails their rounded look.
         */

        const circle =
          Math.sqrt(
            Math.max(
              0,
              1 -
                local *
                  local
            )
          );

        /* ----------------------------
           Satin body
        ---------------------------- */

        const satin =
          circle *
          0.12;

        /* ----------------------------
           Central gloss
        ---------------------------- */

        const circleSquared =
          circle *
          circle;

        const gloss =
          circleSquared *
          circleSquared *
          0.18;

        /* ----------------------------
           Left-side highlight
        ---------------------------- */

        const highlightDistance =
          (local + 0.24) /
          0.22;

        const highlight =
          Math.exp(
            -highlightDistance *
              highlightDistance
          ) *
          (
            0.105 +
            depth01 *
              0.055
          );

        /* ----------------------------
           Small animated reflection
        ---------------------------- */

        const reflection =
          Math.sin(
            t *
              10.36 -
              time *
                0.4 +
              offset *
                0.18 +
              phaseBias
          ) *
          0.01;

        const directional =
          offset < 0
            ? 0.06
            : -0.012;

        let brightness =
          body +
          satin +
          gloss +
          highlight +
          directional +
          reflection;

        /*
         * Edge falloff.
         */

        if (
          normalized >
          0.67
        ) {
          brightness *=
            1 -
            smoothstep(
              0.67,
              1,
              normalized
            ) *
              0.5;
        }

        /*
         * Keep outer border intact.
         */

        if (
          normalized >
          0.92
        ) {
          brightness =
            Math.max(
              brightness,
              0.19 +
                depth01 *
                  0.12
            );
        }

        const score =
          0.52 +
          depth01 *
            0.44;

        put(
          x,
          glyph(
            brightness
          ),
          score
        );
      }

      /* ======================================================
         STRONG SOLID CORE
      ====================================================== */

      const highlightDirection =
        depth > 0
          ? -1
          : 1;

      const centerGlyph =
        depth01 > 0.82
          ? "@"
          : depth01 > 0.64
          ? "%"
          : depth01 > 0.42
          ? "#"
          : "*";

      put(
        core,
        centerGlyph,
        0.94 +
          depth01 *
            0.05
      );

      put(
        core +
          highlightDirection,
        depth01 > 0.72
          ? "@"
          : "%",
        0.95
      );

      put(
        core +
          highlightDirection *
            2,
        depth01 > 0.62
          ? "%"
          : "#",
        0.91
      );

      put(
        core +
          highlightDirection *
            3,
        depth01 > 0.52
          ? "#"
          : "*",
        0.86
      );

      /*
       * Dark opposing rim.
       */

      put(
        core -
          highlightDirection *
            thickness,
        depth01 > 0.55
          ? ":"
          : "·",
        0.87
      );
    }

    /* ========================================================
       TRUE DEPTH ORDER
    ======================================================== */

    if (
      depthA <
      depthB
    ) {
      drawStrand(
        strandA,
        depthA,
        0
      );

      drawStrand(
        strandB,
        depthB,
        Math.PI
      );
    } else {
      drawStrand(
        strandB,
        depthB,
        Math.PI
      );

      drawStrand(
        strandA,
        depthA,
        0
      );
    }

    frame[row] = {
      text: chars.join(""),

      depth:
        (
          Math.max(
            depthA,
            depthB
          ) +
          1
        ) *
        0.5,
    };
  }

  return frame;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function PortraitField() {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container =
      containerRef.current;

    const canvas =
      canvasRef.current;

    if (
      !container ||
      !canvas
    ) {
      return;
    }

    const context =
      canvas.getContext(
        "2d",
        {
          alpha: true,
          desynchronized: true,
        }
      );

    if (!context) {
      return;
    }

    let rafId = 0;

    let destroyed = false;
    let visible = true;

    let lastFrameTime = 0;

    let width = 1;
    let height = 1;

    let fontSize = 12;

    let charWidth = 7;
    let lineHeight = 9;

    let columns = 80;
    let rows = 100;

    let startX = 0;
    let startY = 0;

    let staticRows:
      StaticRowData[] = [];

    const startTime =
      performance.now();

    /* ========================================================
       RESIZE
    ======================================================== */

    function resize() {
      const bounds =
        container.getBoundingClientRect();

      width =
        Math.max(
          bounds.width,
          1
        );

      height =
        Math.max(
          bounds.height,
          1
        );

      /*
       * BIG PERFORMANCE DIFFERENCE.
       *
       * 2x Retina means FOUR TIMES as many pixels.
       *
       * 1.25x is still plenty for an ASCII sculpture.
       */

      const dpr =
        Math.min(
          window.devicePixelRatio ||
            1,
          1.25
        );

      canvas.width =
        Math.round(
          width *
            dpr
        );

      canvas.height =
        Math.round(
          height *
            dpr
        );

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      fontSize =
        clamp(
          width / 55,
          9.75,
          14
        );

      context.font =
        `600 ${fontSize}px ${FONT}`;

      charWidth =
        Math.max(
          context.measureText(
            "@"
          ).width,
          1
        );

      lineHeight =
        fontSize *
        0.78;

      /*
       * Original could become roughly 104 × 132.
       *
       * This still looks high resolution while doing
       * substantially less CPU work.
       */

      columns =
        Math.round(
          clamp(
            width /
              charWidth,
            66,
            90
          )
        );

      rows =
        Math.round(
          clamp(
            height /
              lineHeight,
            76,
            108
          )
        );

      const contentWidth =
        columns *
        charWidth;

      const contentHeight =
        rows *
        lineHeight;

      startX =
        (
          width -
          contentWidth
        ) /
        2;

      startY =
        (
          height -
          contentHeight
        ) /
        2;

      /*
       * Rebuild only when dimensions change.
       */

      staticRows =
        buildStaticRows(
          rows,
          columns
        );
    }

    resize();

    /* ========================================================
       RESIZE OBSERVER
    ======================================================== */

    const resizeObserver =
      new ResizeObserver(() => {
        resize();
      });

    resizeObserver.observe(
      container
    );

    /* ========================================================
       ONLY ANIMATE WHEN VISIBLE
    ======================================================== */

    const intersectionObserver =
      new IntersectionObserver(
        ([entry]) => {
          visible =
            entry.isIntersecting;
        },
        {
          threshold: 0.01,
        }
      );

    intersectionObserver.observe(
      container
    );

    /* ========================================================
       REDUCED MOTION
    ======================================================== */

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    /* ========================================================
       DRAW
    ======================================================== */

    function render(now: number) {
      if (destroyed) {
        return;
      }

      rafId =
        requestAnimationFrame(
          render
        );

      /*
       * Don't do DNA calculations while it isn't even visible.
       */

      if (
        !visible ||
        document.hidden
      ) {
        return;
      }

      /*
       * 30 FPS cap.
       */

      const delta =
        now -
        lastFrameTime;

      if (
        delta <
        FRAME_TIME
      ) {
        return;
      }

      /*
       * Prevent timer drift.
       */

      lastFrameTime =
        now -
        (
          delta %
          FRAME_TIME
        );

      const elapsed =
        reducedMotion.matches
          ? 0
          : (
              now -
              startTime
            ) /
            1000;

      const frame =
        buildFrame(
          rows,
          columns,
          elapsed,
          staticRows
        );

      context.clearRect(
        0,
        0,
        width,
        height
      );

      context.font =
        `600 ${fontSize}px ${FONT}`;

      context.textAlign =
        "left";

      context.textBaseline =
        "top";

      /* ======================================================
         MAIN DNA + DEPTH SHADOW

         IMPORTANT:

         The old implementation drew entire frames multiple
         times and used context.filter = blur().

         That is expensive.

         Canvas shadow properties give us similar dimensional
         separation in ONE primary pass.
      ====================================================== */

      context.save();

      context.fillStyle =
        "#070707";

      context.shadowColor =
        "rgba(0, 0, 0, 0.20)";

      context.shadowBlur =
        2;

      context.shadowOffsetX =
        2.5;

      context.shadowOffsetY =
        3;

      for (
        let row = 0;
        row < frame.length;
        row++
      ) {
        context.globalAlpha =
          0.68 +
          frame[row].depth *
            0.32;

        context.fillText(
          frame[row].text,
          startX,
          startY +
            row *
              lineHeight
        );
      }

      context.restore();

      /* ======================================================
         SPECULAR HIGHLIGHT

         Only every second row.

         Visually blends into a continuous highlight, but is
         roughly half the text drawing cost of another full pass.
      ====================================================== */

      context.save();

      context.fillStyle =
        "rgba(255,255,255,0.72)";

      context.globalAlpha =
        0.26;

      context.shadowColor =
        "transparent";

      context.shadowBlur =
        0;

      for (
        let row = 0;
        row < frame.length;
        row += 2
      ) {
        context.fillText(
          frame[row].text,
          startX - 0.55,
          startY +
            row *
              lineHeight -
            0.45
        );
      }

      context.restore();
    }

    /* ========================================================
       FONT + START
    ======================================================== */

    async function start() {
      try {
        await document.fonts.load(
          '600 12px "IBM Plex Mono"'
        );

        await document.fonts.ready;
      } catch {
        /*
         * Browser/system monospace fallback is fine.
         */
      }

      if (destroyed) {
        return;
      }

      resize();

      rafId =
        requestAnimationFrame(
          render
        );
    }

    void start();

    /* ========================================================
       CLEANUP
    ======================================================== */

    return () => {
      destroyed = true;

      cancelAnimationFrame(
        rafId
      );

      resizeObserver.disconnect();

      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="
        portrait-field
        pointer-events-none
        absolute
        hidden
        overflow-visible
        lg:block
      "
    >
      <div
        ref={containerRef}
        className="
          absolute
          inset-0
          overflow-visible
        "
      >
        <canvas
          ref={canvasRef}
          className="
            absolute
            inset-0
            h-full
            w-full
          "
        />
      </div>
    </div>
  );
}