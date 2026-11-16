"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="no-print fixed inset-x-0 top-[4.25rem] z-40 h-[3px] bg-transparent">
      <div
        className="h-full rounded-e-full bg-gradient-to-l from-brand via-[#8b5cf6] to-[#f5a623]"
        style={{ width: `${progress}%`, transition: "width 120ms linear" }}
      />
    </div>
  );
}
