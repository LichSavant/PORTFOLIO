"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  {
    label: "Structure ID",
    value: "DA-2026",
  },
  {
    label: "Type",
    value: "Helix",
  },
  {
    label: "Mode",
    value: "Active",
    status: true,
  },
] as const;

const CYCLE_DURATION = 2200;
const ROW_HEIGHT = 32;

export default function StructureFocus() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActiveIndex(
        (current) =>
          (current + 1) % ITEMS.length
      );
    }, CYCLE_DURATION);

    return () => {
      window.clearInterval(interval);
    };
  }, [paused]);

  return (
    <aside
      aria-label="DNA structure information"
      className="
        absolute
        z-[25]
        hidden
        w-[245px]
        xl:block
      "
      style={{
        right: "4.5%",
        left: "auto",
        top: "58%",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        {/* ACTIVE FRAME */}
        <div
          aria-hidden="true"
          className="
            structure-focus-frame
            pointer-events-none
            absolute
            left-0
            top-0
            h-8
            w-full
            transition-transform
            duration-500
            ease-out
            will-change-transform
          "
          style={{
            transform: `translate3d(
              0,
              ${activeIndex * ROW_HEIGHT}px,
              0
            )`,
          }}
        >
          <span className="structure-corner structure-corner-tl" />
          <span className="structure-corner structure-corner-tr" />
          <span className="structure-corner structure-corner-bl" />
          <span className="structure-corner structure-corner-br" />
        </div>

        {/* ROWS */}
        {ITEMS.map((item, index) => {
          const isActive =
            index === activeIndex;

          return (
            <button
              key={item.label}
              type="button"
              tabIndex={-1}
              onMouseEnter={() =>
                setActiveIndex(index)
              }
              className={`
  relative
  z-10
  flex
  h-8
  w-full
  items-center
  border-0
  bg-transparent
  px-3
  text-left
  font-mono
  text-[9px]
  uppercase
  tracking-[0.11em]
  transition-all
  duration-300

  ${
    isActive
      ? "opacity-100 blur-0"
      : "opacity-35 blur-[0.7px]"
  }
`}
            >
              <span
                className="
                  w-[88px]
                  shrink-0
                  text-[var(--muted)]
                "
              >
                {item.label}
              </span>

              <span
                className="
                  mr-3
                  text-[rgba(8,8,8,0.2)]
                "
              >
                :
              </span>

              <span
                className="
                  whitespace-nowrap
                  text-[var(--foreground)]
                "
              >
                {item.value}
              </span>

              {"status" in item &&
                item.status && (
                  <span
                    aria-hidden="true"
                    className="
                      ml-2
                      h-1
                      w-1
                      shrink-0
                      rounded-full
                      bg-[var(--accent)]
                    "
                  />
                )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}