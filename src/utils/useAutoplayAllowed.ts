"use client";

import { useEffect, useState } from "react";

/** False only when the OS requests reduced motion. Weak-GPU / mobile
 * devices keep autoplay (lite-degraded elsewhere), per keep-animations policy. */
export function useAutoplayAllowed(): boolean {
  const [allowed, setAllowed] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => {
      setAllowed(
        !mq.matches &&
          !document.documentElement.classList.contains("reduce-motion") &&
          (window as any).__REDUCED_MOTION__ !== true,
      );
    };
    check();
    mq.addEventListener?.("change", check);
    return () => mq.removeEventListener?.("change", check);
  }, []);
  return allowed;
}
