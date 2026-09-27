import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Only run custom cursor on devices with fine pointer (mouse), disable on touch/mobile
    const hasFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!hasFinePointer) return;

    let rafId;
    const moveHandler = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${e.clientX - 48}px, ${e.clientY - 48}px, 0)`;
        }
      });
    };

    window.addEventListener("mousemove", moveHandler, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform hidden md:block"
      style={{
        transform: "translate3d(-200px, -200px, 0)",
      }}
      aria-hidden="true"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#B84A1C]/20 to-[#D97706]/15 blur-2xl opacity-75" />
    </div>
  );
}

