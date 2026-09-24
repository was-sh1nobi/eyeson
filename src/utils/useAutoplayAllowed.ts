"use client";

import { useEffect, useState } from "react";

/** False when autoplay would cause jank or violate motion preferences. */
export function useAutoplayAllowed(): boolean {
  const [allowed, setAllowed] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => {
      setAllowed(
        !mq.matches &&
          !document.documentElement.classList.contains("gpu-off") &&
          !document.documentElement.classList.contains("reduce-motion") &&
          (window as any).__GPU_OFF__ !== true &&
          (window as any).__REDUCED_MOTION__ !== true,
      );
    };
    check();
    mq.addEventListener?.("change", check);
    return () => mq.removeEventListener?.("change", check);
  }, []);
  return allowed;
}
