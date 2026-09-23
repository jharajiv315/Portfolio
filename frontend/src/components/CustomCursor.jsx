import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const moveHandler = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveHandler);

    return () => window.removeEventListener("mousemove", moveHandler);
  }, []);

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-[9999]">
      <div
        style={{
          transform: `translate(${position.x - 40}px, ${position.y - 40}px)`,
        }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#B84A1C]/20 to-[#D97706]/15 blur-2xl opacity-75"></div>
      </div>
    </div>
  );
}
