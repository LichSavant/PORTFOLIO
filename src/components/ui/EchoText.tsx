"use client";

import {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./EchoText.css";

interface EchoTextProps {
  text: string;
  echoes?: number;
  startOffset?: number;
  fade?: number;
  blur?: number;
  tint?: string;
  duration?: number;
  delay?: number;
  fontSize?: string;
  fontWeight?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

const clamp = (
  value: number,
  min: number,
  max: number
) => Math.min(Math.max(value, min), max);

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export default function EchoText({
  text,

  echoes = 5,

  // Negative movement is handled internally.
  // This is just the travel distance.
  startOffset = 650,

  fade = 0.62,

  blur = 1,

  tint = "#2f6fff",

  // Slower than before.
  duration = 1800,

  delay = 0,

  fontSize = "inherit",

  fontWeight = 300,

  color = "#080808",

  className = "",

  style,
}: EchoTextProps) {
  const refs =
    useRef<Array<HTMLSpanElement | null>>([]);

  const frameRef =
    useRef<number | null>(null);

  const [reducedMotion, setReducedMotion] =
    useState(false);

  const echoCount = reducedMotion
    ? 0
    : clamp(Math.round(echoes), 0, 8);

  const indexes = useMemo(
    () =>
      Array.from(
        { length: echoCount },
        (_, index) => index + 1
      ),
    [echoCount]
  );

  /* ============================================================
     REDUCED MOTION
  ============================================================ */

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => {
      setReducedMotion(media.matches);
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
     ONE-TIME ENTRANCE
  ============================================================ */

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const startTime =
      performance.now() + delay;

    function animate(now: number) {
      /*
       * Wait for optional stagger delay.
       */
      if (now < startTime) {
        frameRef.current =
          requestAnimationFrame(animate);

        return;
      }

      const elapsed =
        now - startTime;

      const progress = clamp(
        elapsed / duration,
        0,
        1
      );

      /*
       * Slower, smoother deceleration.
       */
      const eased =
        easeOutQuart(progress);

      /* ========================================================
         FRONT TEXT

         Starts OUTSIDE LEFT:
              -startOffset

         Ends:
               0
      ======================================================== */

      const front =
        refs.current[0];

      if (front) {
        const frontX =
          -startOffset *
          (1 - eased);

        front.style.transform =
          `translate3d(${frontX.toFixed(
            2
          )}px, 0, 0)`;
      }

      /* ========================================================
         ECHOES

         Each echo has progressively more lag, so while the
         main text moves right the copies remain behind it.
      ======================================================== */

      for (
        let index = 1;
        index <= echoCount;
        index++
      ) {
        const element =
          refs.current[index];

        if (!element) {
          continue;
        }

        /*
         * Higher echo index = more delay.
         */
        const lag =
          index * 0.055;

        const localProgress =
          clamp(
            (progress - lag) /
              Math.max(
                1 - lag,
                0.001
              ),
            0,
            1
          );

        const localEase =
          easeOutQuart(
            localProgress
          );

        /*
         * All copies also originate on the LEFT,
         * but farther echoes remain behind longer.
         */
        const extraDistance =
          index * 18;

        const x =
          -(startOffset + extraDistance) *
          (1 - localEase);

        element.style.transform =
          `translate3d(${x.toFixed(
            2
          )}px, 0, 0)`;

        /*
         * Visible while travelling,
         * then disappears as it reaches the destination.
         */
        const remaining =
          1 - localEase;

        const entranceVisibility =
          Math.sin(
            Math.min(
              localProgress,
              1
            ) *
              Math.PI
          );

        element.style.opacity =
          String(
            Math.min(
              0.7,
              Math.pow(
                fade,
                index - 1
              ) *
                entranceVisibility
            )
          );

        const depth =
          index /
          Math.max(
            echoCount,
            1
          );

        const blurAmount =
          blur *
          depth *
          Math.max(
            remaining,
            0.2
          );

        element.style.filter =
          `blur(${blurAmount.toFixed(
            2
          )}px)`;
      }

      /* ========================================================
         CONTINUE / FINISH
      ======================================================== */

      if (progress < 1) {
        frameRef.current =
          requestAnimationFrame(
            animate
          );

        return;
      }

      /*
       * Lock everything into final clean state.
       */

      if (front) {
        front.style.transform =
          "translate3d(0, 0, 0)";
      }

      for (
        let index = 1;
        index <= echoCount;
        index++
      ) {
        const echo =
          refs.current[index];

        if (!echo) {
          continue;
        }

        echo.style.opacity = "0";

        echo.style.transform =
          "translate3d(0, 0, 0)";

        echo.style.filter = "none";
      }

      frameRef.current = null;
    }

    frameRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (
        frameRef.current !== null
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }

      frameRef.current = null;
    };
  }, [
    blur,
    delay,
    duration,
    echoCount,
    fade,
    reducedMotion,
    startOffset,
  ]);

  return (
    <span
      className={`echo-text ${className}`}
      style={{
        fontSize,
        fontWeight,
        color,
        ...style,
      }}
    >
      {/* ECHO COPIES */}

      {indexes
        .slice()
        .reverse()
        .map((index) => (
          <span
            key={index}
            aria-hidden="true"
            ref={(element) => {
              refs.current[index] =
                element;
            }}
            className="echo-text__echo"
            style={{
              color: tint,
              opacity: 0,
            }}
          >
            {text}
          </span>
        ))}

      {/* ACTUAL TEXT */}

      <span
        ref={(element) => {
          refs.current[0] =
            element;
        }}
        className="
          echo-text__echo
          echo-text__echo--front
        "
      >
        {text}
      </span>
    </span>
  );
}