"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./TechDriftWall.css";

type TechItem = {
  image: string;
  name: string;
};

interface TechDriftWallProps {
  items: TechItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  tilt?: number;
  turn?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  variance?: number;
}

function columnFactor(
  index: number,
  variance: number
) {
  const pseudo =
    (
      (
        index *
          0.6180339887 +
        0.35
      ) %
      1
    ) *
      2 -
    1;

  return (
    1 +
    variance *
      pseudo
  );
}

export default function TechDriftWall({
  items,

  columns = 5,

  tileWidth = 150,

  tileHeight = 96,

  gap = 22,

  tilt = 12,

  turn = -12,

  perspective = 1300,

  depth = 100,

  speed = 22,

  variance = 0.28,
}: TechDriftWallProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const planeRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const trackRefs =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  const rafRef =
    useRef<number | null>(
      null
    );

  const offsetsRef =
    useRef<number[]>([]);

  const lastTimeRef =
    useRef<number | null>(
      null
    );

  const [
    containerHeight,
    setContainerHeight,
  ] = useState(700);

  const [
    reducedMotion,
    setReducedMotion,
  ] = useState(false);

  /* ============================================================
     REDUCED MOTION
  ============================================================ */

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const update = () => {
      setReducedMotion(
        media.matches
      );
    };

    update();

    media.addEventListener?.(
      "change",
      update
    );

    return () => {
      media.removeEventListener?.(
        "change",
        update
      );
    };
  }, []);

  /* ============================================================
     DISTRIBUTE ITEMS INTO COLUMNS
  ============================================================ */

  const columnItems =
    useMemo(() => {
      const result =
        Array.from(
          {
            length:
              columns,
          },
          () =>
            [] as TechItem[]
        );

      items.forEach(
        (
          item,
          index
        ) => {
          result[
            index %
              columns
          ].push(item);
        }
      );

      return result.map(
        (column) =>
          column.length
            ? column
            : items.slice(
                0,
                1
              )
      );
    }, [
      items,
      columns,
    ]);

  /* ============================================================
     TRACK DIMENSIONS
  ============================================================ */

  const columnMeta =
    useMemo(() => {
      const unit =
        tileHeight +
        gap;

      return columnItems.map(
        (column) => {
          const copyHeight =
            Math.max(
              unit,
              column.length *
                unit
            );

          const copies =
            Math.max(
              3,
              Math.ceil(
                (
                  containerHeight *
                  1.8
                ) /
                  copyHeight
              ) +
                2
            );

          return {
            copyHeight,
            copies,
          };
        }
      );
    }, [
      columnItems,
      tileHeight,
      gap,
      containerHeight,
    ]);

  /* ============================================================
     RESIZE OBSERVER
  ============================================================ */

  useLayoutEffect(() => {
    const element =
      containerRef.current;

    if (!element) {
      return;
    }

    const observer =
      new ResizeObserver(
        ([entry]) => {
          setContainerHeight(
            entry
              .contentRect
              .height ||
              700
          );
        }
      );

    observer.observe(
      element
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ============================================================
     COLUMN SPEEDS
  ============================================================ */

  const velocities =
    useMemo(() => {
      return columnItems.map(
        (
          _,
          column
        ) => {
          /*
           * Alternate directions.
           *
           * This gives the wall that nice
           * drifting mechanical motion.
           */

          const direction =
            column %
              2 ===
            0
              ? 1
              : -1;

          return (
            speed *
            columnFactor(
              column,
              variance
            ) *
            direction
          );
        }
      );
    }, [
      columnItems,
      speed,
      variance,
    ]);

  /* ============================================================
     RESET OFFSETS WHEN GEOMETRY CHANGES
  ============================================================ */

  useEffect(() => {
    offsetsRef.current =
      columnMeta.map(
        (
          meta,
          column
        ) =>
          meta.copyHeight *
          (
            (
              column *
                0.37
            ) %
            1
          )
      );
  }, [columnMeta]);

  /* ============================================================
     STATIC 3D PLANE
  ============================================================ */

  useEffect(() => {
    const plane =
      planeRef.current;

    if (!plane) {
      return;
    }

    plane.style.transform = `
      translate(-50%, -50%)
      scale(1.2)
      rotateX(${tilt}deg)
      rotateY(${turn}deg)
      translateZ(${-depth}px)
    `;
  }, [
    tilt,
    turn,
    depth,
  ]);

  /* ============================================================
     ANIMATION
  ============================================================ */

  useEffect(() => {
    if (
      reducedMotion
    ) {
      return;
    }

    function animate(
      timestamp: number
    ) {
      if (
        lastTimeRef.current ===
        null
      ) {
        lastTimeRef.current =
          timestamp;
      }

      const delta =
        Math.min(
          0.05,
          (
            timestamp -
            lastTimeRef.current
          ) /
            1000
        );

      lastTimeRef.current =
        timestamp;

      for (
        let column = 0;
        column <
        trackRefs.current
          .length;
        column++
      ) {
        const track =
          trackRefs.current[
            column
          ];

        const meta =
          columnMeta[
            column
          ];

        if (
          !track ||
          !meta
        ) {
          continue;
        }

        let next =
          (
            offsetsRef
              .current[
              column
            ] ??
            0
          ) +
          velocities[
            column
          ] *
            delta;

        next =
          (
            (
              next %
              meta.copyHeight
            ) +
            meta.copyHeight
          ) %
          meta.copyHeight;

        offsetsRef.current[
          column
        ] = next;

        track.style.transform =
          `translate3d(
            0,
            ${-next}px,
            0
          )`;
      }

      rafRef.current =
        requestAnimationFrame(
          animate
        );
    }

    rafRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (
        rafRef.current !==
        null
      ) {
        cancelAnimationFrame(
          rafRef.current
        );
      }

      rafRef.current =
        null;

      lastTimeRef.current =
        null;
    };
  }, [
    columnMeta,
    reducedMotion,
    velocities,
  ]);

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="tech-drift-wall"
      style={
        {
          "--tdw-tile-w":
            `${tileWidth}px`,

          "--tdw-tile-h":
            `${tileHeight}px`,

          "--tdw-gap":
            `${gap}px`,

          "--tdw-perspective":
            `${perspective}px`,
        } as React.CSSProperties
      }
    >
      <div
        ref={planeRef}
        className="tech-drift-wall__plane"
      >
        {columnItems.map(
          (
            column,
            columnIndex
          ) => {
            const meta =
              columnMeta[
                columnIndex
              ];

            const copies =
              Array.from({
                length:
                  meta.copies,
              });

            return (
              <div
                key={
                  columnIndex
                }
                className="tech-drift-wall__column"
              >
                <div
                  ref={(
                    element
                  ) => {
                    trackRefs.current[
                      columnIndex
                    ] =
                      element;
                  }}
                  className="tech-drift-wall__track"
                >
                  {copies.map(
                    (
                      _,
                      copyIndex
                    ) =>
                      column.map(
                        (
                          item,
                          itemIndex
                        ) => (
                          <div
                            key={`${columnIndex}-${copyIndex}-${itemIndex}`}
                            className="tech-drift-wall__tile"
                          >
                            <div className="tech-drift-wall__inner">
                              <img
                                src={
                                  item.image
                                }
                                alt=""
                                draggable={
                                  false
                                }
                              />

                              <span className="tech-drift-wall__veil" />
                            </div>
                          </div>
                        )
                      )
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}