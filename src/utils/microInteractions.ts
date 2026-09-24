// Reusable micro-interactions for landing pages:
// 1. Scroll reveal — add .reveal-on-scroll to elements, optional [data-reveal-delay="100"]
// 2. Cursor spotlight — add .spotlight-card to a card, it tracks the pointer via --mx/--my
// Usage: import "@/utils/microInteractions.ts";
// Styles live in global.css. Idempotent — safe with astro:page-load re-runs.

function initMicroInteractions() {
  const reduced =
    document.documentElement.classList.contains("reduce-motion") ||
    (window as any).__REDUCED_MOTION__ ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gpuOff = document.documentElement.classList.contains("gpu-off") || (window as any).__GPU_OFF__;

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll<HTMLElement>(".reveal-on-scroll:not(.mi-bound)");
  // Never hide content: reduced motion shows instantly (no transform offset);
  // gpu-off / missing observer support also reveals immediately so sections
  // can't get stuck at opacity:0.
  if (reduced || gpuOff || typeof IntersectionObserver === "undefined") {
    revealEls.forEach((el) => {
      el.classList.add("mi-bound", "is-visible");
      el.style.transitionDelay = "";
    });
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay;
            // Stagger delay applies to the reveal only — clear it afterwards
            // so hover transitions on the same element aren't delayed.
            if (delay) {
              el.style.transitionDelay = `${delay}ms`;
              const ms = Number(delay) + 750;
              setTimeout(() => {
                el.style.transitionDelay = "";
              }, Number.isFinite(ms) ? ms : 750);
            }
            el.classList.add("is-visible");
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 },
    );
    revealEls.forEach((el) => {
      el.classList.add("mi-bound");
      observer.observe(el);
    });
  }

  // ---- Cursor spotlight ----
  if (window.matchMedia("(pointer: coarse)").matches || gpuOff || reduced) return;
  document
    .querySelectorAll<HTMLElement>(".spotlight-card:not(.mi-bound)")
    .forEach((card) => {
      card.classList.add("mi-bound");
      let raf = 0;
      let pending: { x: number; y: number } | null = null;
      card.addEventListener("pointermove", (e) => {
        pending = { x: e.clientX, y: e.clientY };
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (!pending) return;
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${pending.x - rect.left}px`);
          card.style.setProperty("--my", `${pending.y - rect.top}px`);
        });
      }, { passive: true });
    });
}

export function setupMicroInteractions() {
  if (typeof document === "undefined") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMicroInteractions, { once: true });
  } else {
    initMicroInteractions();
  }
  document.addEventListener("astro:page-load", initMicroInteractions);
}

if (typeof document !== "undefined") {
  setupMicroInteractions();
}
