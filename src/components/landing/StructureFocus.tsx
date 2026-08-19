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

const CYCLE_DURATION = 1950;

export default function StructureFocus() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = window.setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % ITEMS.length
      );
    }, CYCLE_DURATION);

    return () => {
      window.clearInterval(interval);
    };
  }, [isHovered]);

  return (
    <aside
      aria-label="DNA structure information"
      className="
        hero-structure-card
        absolute
        z-[25]
        hidden
        xl:block
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="structure-focus-container relative">
        {/* MOVING FOCUS FRAME */}
        <div
          aria-hidden="true"
          className="structure-focus-frame"
          style={{
            transform: `translate3d(0, ${activeIndex * 32}px, 0)`,
          }}
        >
          <span className="structure-corner structure-corner-tl" />
          <span className="structure-corner structure-corner-tr" />
          <span className="structure-corner structure-corner-bl" />
          <span className="structure-corner structure-corner-br" />
        </div>

        {/* ROWS */}
        {ITEMS.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.label}
              type="button"
              tabIndex={-1}
              className={`
                structure-focus-row
                relative
                z-10
                flex
                h-8
                w-full
                items-center
                border-0
                bg-transparent
                px-5
                text-left
                font-mono
                text-[8px]
                uppercase
                tracking-[0.14em]

                ${
                  isActive
                    ? "structure-focus-row-active"
                    : ""
                }
              `}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span
                className="
                  w-[78px]
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

              {"status" in item && item.status && (
                <span
                  aria-hidden="true"
                  className="
                    structure-active-dot
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