"use client";

import { useEffect, useRef } from "react";

const PHOTO_PATH = "/about/dhanwil-reference.jpg";

const SOURCE_WIDTH = 420;
const SAMPLE_STEP = 5;

const FPS = 30;
const FRAME_TIME = 1000 / FPS;

const ROTATION_SPEED = 0.12;

const GLYPHS = " .,:;-~=+*#%@";

type Vec2 = {
  x: number;
  y: number;
};

type BodyRegion = {
  polygon: Vec2[];
  depth: number;
  backShade: number;
};

type PortraitPoint = {
  x: number;
  y: number;
  z: number;
  darkness: number;
  frontness: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pointInsidePolygon(
  x: number,
  y: number,
  polygon: Vec2[]
) {
  let inside = false;

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const a = polygon[i];
    const b = polygon[j];

    const intersects =
      a.y > y !== b.y > y &&
      x <
        ((b.x - a.x) * (y - a.y)) /
          (b.y - a.y + 0.000001) +
          a.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

const REGIONS: BodyRegion[] = [
  {
    depth: 0.31,
    backShade: 0.48,
    polygon: [
      { x: 0.49, y: 0.17 },
      { x: 0.62, y: 0.17 },
      { x: 0.69, y: 0.21 },
      { x: 0.71, y: 0.29 },
      { x: 0.68, y: 0.36 },
      { x: 0.61, y: 0.39 },
      { x: 0.53, y: 0.37 },
      { x: 0.48, y: 0.31 },
      { x: 0.46, y: 0.24 },
    ],
  },

  {
    depth: 0.18,
    backShade: 0.6,
    polygon: [
      { x: 0.43, y: 0.22 },
      { x: 0.55, y: 0.18 },
      { x: 0.63, y: 0.2 },
      { x: 0.57, y: 0.25 },
      { x: 0.47, y: 0.27 },
    ],
  },

  {
    depth: 0.48,
    backShade: 0.76,
    polygon: [
      { x: 0.44, y: 0.35 },
      { x: 0.61, y: 0.34 },
      { x: 0.69, y: 0.39 },
      { x: 0.73, y: 0.48 },
      { x: 0.71, y: 0.58 },
      { x: 0.65, y: 0.64 },
      { x: 0.52, y: 0.65 },
      { x: 0.42, y: 0.59 },
      { x: 0.35, y: 0.5 },
      { x: 0.37, y: 0.42 },
    ],
  },

  {
    depth: 0.22,
    backShade: 0.58,
    polygon: [
      { x: 0.38, y: 0.4 },
      { x: 0.46, y: 0.42 },
      { x: 0.43, y: 0.52 },
      { x: 0.36, y: 0.6 },
      { x: 0.27, y: 0.58 },
      { x: 0.31, y: 0.49 },
    ],
  },

  {
    depth: 0.22,
    backShade: 0.58,
    polygon: [
      { x: 0.6, y: 0.42 },
      { x: 0.69, y: 0.45 },
      { x: 0.68, y: 0.57 },
      { x: 0.62, y: 0.64 },
      { x: 0.55, y: 0.59 },
    ],
  },

  {
    depth: 0.35,
    backShade: 0.77,
    polygon: [
      { x: 0.31, y: 0.52 },
      { x: 0.53, y: 0.54 },
      { x: 0.58, y: 0.63 },
      { x: 0.52, y: 0.69 },
      { x: 0.38, y: 0.69 },
      { x: 0.25, y: 0.65 },
      { x: 0.09, y: 0.6 },
      { x: 0.08, y: 0.54 },
      { x: 0.2, y: 0.52 },
    ],
  },

  {
    depth: 0.21,
    backShade: 0.62,
    polygon: [
      { x: 0.05, y: 0.51 },
      { x: 0.2, y: 0.52 },
      { x: 0.26, y: 0.59 },
      { x: 0.2, y: 0.65 },
      { x: 0.08, y: 0.65 },
      { x: 0.04, y: 0.6 },
    ],
  },

  {
    depth: 0.28,
    backShade: 0.78,
    polygon: [
      { x: 0.34, y: 0.61 },
      { x: 0.49, y: 0.61 },
      { x: 0.48, y: 0.75 },
      { x: 0.42, y: 0.9 },
      { x: 0.31, y: 0.9 },
      { x: 0.31, y: 0.77 },
    ],
  },

  {
    depth: 0.2,
    backShade: 0.65,
    polygon: [
      { x: 0.27, y: 0.86 },
      { x: 0.42, y: 0.86 },
      { x: 0.42, y: 0.93 },
      { x: 0.34, y: 0.96 },
      { x: 0.22, y: 0.95 },
      { x: 0.2, y: 0.91 },
    ],
  },
];

function findRegion(x: number, y: number) {
  for (const region of REGIONS) {
    if (pointInsidePolygon(x, y, region.polygon)) {
      return region;
    }
  }

  return null;
}

function buildPortraitPoints(image: HTMLImageElement) {
  const aspect = image.height / image.width;

  const sourceWidth = SOURCE_WIDTH;
  const sourceHeight = Math.round(sourceWidth * aspect);

  const canvas = document.createElement("canvas");

  canvas.width = sourceWidth;
  canvas.height = sourceHeight;

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    return [];
  }

  context.drawImage(
    image,
    0,
    0,
    sourceWidth,
    sourceHeight
  );

  const pixels = context.getImageData(
    0,
    0,
    sourceWidth,
    sourceHeight
  ).data;

  const points: PortraitPoint[] = [];

  const modelHeight = 4.8;
  const modelWidth = modelHeight / aspect;

  for (
    let py = 0;
    py < sourceHeight;
    py += SAMPLE_STEP
  ) {
    for (
      let px = 0;
      px < sourceWidth;
      px += SAMPLE_STEP
    ) {
      const nx = px / sourceWidth;
      const ny = py / sourceHeight;

      const region = findRegion(nx, ny);

      if (!region) {
        continue;
      }

      const pixelIndex =
        (py * sourceWidth + px) * 4;

      const r = pixels[pixelIndex];
      const g = pixels[pixelIndex + 1];
      const b = pixels[pixelIndex + 2];

      const luminance =
        (r * 0.2126 +
          g * 0.7152 +
          b * 0.0722) /
        255;

      let darkness = 1 - luminance;

      darkness = clamp(
        darkness * 1.18 + 0.08,
        0.08,
        1
      );

      const x =
        (nx - 0.5) * modelWidth;

      const y =
        (0.5 - ny) * modelHeight;

      const depth = region.depth;

      const relief =
        (darkness - 0.5) * 0.065;

      points.push({
        x,
        y,
        z: depth + relief,
        darkness,
        frontness: 1,
      });

      points.push({
        x,
        y,
        z: -depth,
        darkness: region.backShade,
        frontness: 0,
      });

      const gx = Math.floor(
        px / SAMPLE_STEP
      );

      const gy = Math.floor(
        py / SAMPLE_STEP
      );

      const pattern =
        (gx + gy) % 3;

      if (pattern === 0) {
        points.push({
          x,
          y,
          z: 0,
          darkness:
            region.backShade * 0.88,
          frontness: 0,
        });
      }

      if (
        pattern === 1 &&
        depth > 0.25
      ) {
        points.push({
          x,
          y,
          z: depth * 0.48,
          darkness:
            darkness * 0.84,
          frontness: 0.55,
        });

        points.push({
          x,
          y,
          z: -depth * 0.48,
          darkness:
            region.backShade * 0.88,
          frontness: 0,
        });
      }
    }
  }

  return points;
}

export default function AsciiPortrait() {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container =
      containerRef.current;

    const canvas =
      canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const context =
      canvas.getContext("2d", {
        alpha: true,
        desynchronized: true,
      });

    if (!context) {
      return;
    }

    let destroyed = false;
    let visible = true;

    let animationFrame = 0;
    let lastFrame = 0;

    let points: PortraitPoint[] = [];

    let width = 1;
    let height = 1;

    let fontSize = 8;
    let cellWidth = 5;
    let cellHeight = 8;

    let columns = 1;
    let rows = 1;

    let depthBuffer =
      new Float32Array(1);

    let shadeBuffer =
      new Float32Array(1);

    let reducedMotion = false;

    const startTime =
      performance.now();

    const image = new Image();

    image.onload = () => {
      if (destroyed) {
        return;
      }

      points =
        buildPortraitPoints(image);

      console.log(
        "[AsciiPortrait] image loaded:",
        image.width,
        image.height
      );

      console.log(
        "[AsciiPortrait] point count:",
        points.length
      );
    };

    image.onerror = () => {
      console.error(
        "[AsciiPortrait] Failed to load:",
        PHOTO_PATH
      );
    };

    image.src = PHOTO_PATH;

    const motionMedia =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const updateMotion = () => {
      reducedMotion =
        motionMedia.matches;
    };

    updateMotion();

    motionMedia.addEventListener?.(
      "change",
      updateMotion
    );

    function resize() {
      const rect =
        container.getBoundingClientRect();

      width = Math.max(
        rect.width,
        1
      );

      height = Math.max(
        rect.height,
        1
      );

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.2
      );

      canvas.width = Math.round(
        width * dpr
      );

      canvas.height = Math.round(
        height * dpr
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

      fontSize = clamp(
        width / 105,
        6.5,
        8.6
      );

      context.font =
        `500 ${fontSize}px "IBM Plex Mono", "Cascadia Mono", Consolas, monospace`;

      context.textBaseline = "top";
      context.textAlign = "left";

      cellWidth = Math.max(
        context.measureText("@").width,
        1
      );

      cellHeight =
        fontSize * 0.95;

      columns = Math.ceil(
        width / cellWidth
      );

      rows = Math.ceil(
        height / cellHeight
      );

      const totalCells =
        columns * rows;

      depthBuffer =
        new Float32Array(
          totalCells
        );

      shadeBuffer =
        new Float32Array(
          totalCells
        );
    }

    resize();

    const resizeObserver =
      new ResizeObserver(resize);

    resizeObserver.observe(
      container
    );

    const intersectionObserver =
      new IntersectionObserver(
        (entries) => {
          visible =
            entries[0]
              ?.isIntersecting ??
            true;
        },
        {
          threshold: 0.01,
        }
      );

    intersectionObserver.observe(
      container
    );

    function render(now: number) {
      if (destroyed) {
        return;
      }

      animationFrame =
        requestAnimationFrame(
          render
        );

      if (
        !visible ||
        document.hidden
      ) {
        return;
      }

      const delta =
        now - lastFrame;

      if (
        delta < FRAME_TIME
      ) {
        return;
      }

      lastFrame =
        now -
        (delta % FRAME_TIME);

      context.clearRect(
        0,
        0,
        width,
        height
      );

      if (
        points.length === 0
      ) {
        return;
      }

      depthBuffer.fill(-999);
      shadeBuffer.fill(0);

      const elapsed =
        (now - startTime) /
        1000;

      const angle =
        reducedMotion
          ? 0
          : elapsed *
            ROTATION_SPEED;

      const cosY =
        Math.cos(angle);

      const sinY =
        Math.sin(angle);

      const tilt = -0.035;

      const cosX =
        Math.cos(tilt);

      const sinX =
        Math.sin(tilt);

      const modelScale =
        Math.min(
          width * 0.26,
          height * 0.37
        );

      const centerX =
        width * 0.5;

      const centerY =
        height * 0.5;

      const cameraDistance =
        6.2;

      for (
        let i = 0;
        i < points.length;
        i++
      ) {
        const point =
          points[i];

        const rx =
          point.x * cosY +
          point.z * sinY;

        let rz =
          -point.x * sinY +
          point.z * cosY;

        const ry =
          point.y * cosX -
          rz * sinX;

        rz =
          point.y * sinX +
          rz * cosX;

        const perspective =
          cameraDistance /
          (
            cameraDistance -
            rz
          );

        const screenX =
          centerX +
          rx *
            modelScale *
            perspective;

        const screenY =
          centerY -
          ry *
            modelScale *
            perspective;

        if (
          screenX < 0 ||
          screenX >= width ||
          screenY < 0 ||
          screenY >= height
        ) {
          continue;
        }

        const col =
          Math.floor(
            screenX /
              cellWidth
          );

        const row =
          Math.floor(
            screenY /
              cellHeight
          );

        if (
          col < 0 ||
          col >= columns ||
          row < 0 ||
          row >= rows
        ) {
          continue;
        }

        const cell =
          row *
            columns +
          col;

        if (
          rz <
          depthBuffer[cell]
        ) {
          continue;
        }

        depthBuffer[cell] =
          rz;

        const frontFacing =
          (cosY + 1) *
          0.5;

        const sideLight =
          0.74 +
          Math.abs(sinY) *
            0.18;

        let shade =
          point.darkness;

        if (
          point.frontness > 0
        ) {
          shade *=
            0.64 +
            frontFacing *
              0.48;
        } else {
          shade *=
            sideLight;
        }

        const depthLight =
          clamp(
            (rz + 1.1) /
              2.2,
            0,
            1
          );

        shade *=
          0.76 +
          depthLight *
            0.24;

        shadeBuffer[cell] =
          clamp(
            shade,
            0,
            1
          );
      }

      context.fillStyle =
        "#111111";

      context.font =
        `500 ${fontSize}px "IBM Plex Mono", "Cascadia Mono", Consolas, monospace`;

      for (
        let row = 0;
        row < rows;
        row++
      ) {
        const y =
          row *
          cellHeight;

        for (
          let col = 0;
          col < columns;
          col++
        ) {
          const cell =
            row *
              columns +
            col;

          const shade =
            shadeBuffer[cell];

          if (
            shade < 0.09
          ) {
            continue;
          }

          const glyphIndex =
            Math.round(
              clamp(
                shade,
                0,
                1
              ) *
                (
                  GLYPHS.length -
                  1
                )
            );

          const character =
            GLYPHS[glyphIndex];

          if (
            !character ||
            character === " "
          ) {
            continue;
          }

          context.globalAlpha =
            clamp(
              0.34 +
                shade *
                  0.7,
              0.34,
              1
            );

          context.fillText(
            character,
            col *
              cellWidth,
            y
          );
        }
      }

      context.globalAlpha = 1;
    }

    animationFrame =
      requestAnimationFrame(
        render
      );

    return () => {
      destroyed = true;

      cancelAnimationFrame(
        animationFrame
      );

      resizeObserver.disconnect();

      intersectionObserver.disconnect();

      motionMedia.removeEventListener?.(
        "change",
        updateMotion
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="
        relative
        h-full
        min-h-[680px]
        w-full
        overflow-hidden
        bg-transparent
      "
    >
      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          h-full
          w-full
          bg-transparent
        "
      />
    </div>
  );
}