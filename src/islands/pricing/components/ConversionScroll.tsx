import { useEffect, useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const SVG_LAYERS = [
  { left: "/pricing/svg/process/5.svg", right: "/pricing/svg/process/1.svg" },
  { left: "/pricing/svg/process/6.svg", right: "/pricing/svg/process/2.svg" },
  { left: "/pricing/svg/process/7.svg", right: "/pricing/svg/process/3.svg" },
  { left: "/pricing/svg/process/8.svg", right: "/pricing/svg/process/4.svg" },
];

export const ConversionScroll = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let rafId = 0;
    let isVisible = false;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const isLowPower =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains("gpu-off") ||
        (window as any).__GPU_OFF__);

    const updateProgress = () => {
      if (!el || !isVisible) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.15;
      const total = rect.height - vh * 0.35;
      const nextProgress = clamp((start - rect.top) / total, 0, 1);
      setProgress((prev) => (Math.abs(prev - nextProgress) > 0.005 ? nextProgress : prev));
    };

    const onScroll = () => {
      if (!isVisible || rafId) return;
      rafId = requestAnimationFrame(() => {
        updateProgress();
        rafId = 0;
      });
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
          if (isVisible) {
            updateProgress();
          }
        },
        { rootMargin: "150px" }
      );
      observer.observe(el);
    } else {
      isVisible = true;
      updateProgress();
    }

    if (!isLowPower) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    } else {
      setProgress(0.5);
    }
    window.addEventListener("resize", checkMobile);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const yOffset = (progress - 0.5) * 16;

  const CARD_AREA_TOP = 16.42;
  const CARD_AREA_HEIGHT = 71.64;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 mx-auto w-full overflow-hidden px-4 pb-24 pt-5"
    >
      <h2 className="text-center text-white text-2xl md:text-3xl font-bold mb-12">
        Why <span className="text-[#1FC5C8]">Product Videos</span> increase
        conversion
      </h2>

      <div className="relative mx-auto w-full max-w-[2600px]">
        <div
          className="relative w-full overflow-visible"
          style={{
            aspectRatio: isMobile ? "1289.28 / 3696.72" : "1289.28 / 924.18",
            transform: `translateY(${yOffset}px)`,
          }}
        >
          <div
            className="pointer-events-none absolute left-[5%] z-20 md:left-1/2 md:-translate-x-1/2"
            style={{
              top: `${CARD_AREA_TOP}%`,
              height: `${CARD_AREA_HEIGHT}%`,
            }}
          >
            <div className="relative h-full w-[3px] md:w-1 rounded-full bg-[#0D3444]">
              <div
                className="absolute left-0 top-0 w-full rounded-full bg-linear-to-b from-[#0E6578] to-[#08DCF0]"
                style={{ height: `${progress * 100}%` }}
              />
              <div
                className="absolute left-1/2 h-3 w-3 md:h-4 md:w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#65E6E3] shadow-[0_0_20px_rgba(8,220,240,0.8)]"
                style={{
                  top: `${progress * 100}%`,
                  background: "radial-gradient(circle, #08DCF0, #0E6578)",
                }}
              />
            </div>
          </div>
          {SVG_LAYERS.map((svg, i) => {
            const segment = 1 / SVG_LAYERS.length;
            const stepProgress = clamp((progress - i * segment + 0.2) / segment, 0, 1);
            const opacity = 0.05 + stepProgress * 0.95;

            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{ opacity }}
              >
                <img
                  src={svg.left}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover max-md:hidden"
                />
                <img
                  src={svg.right}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: isMobile ? "69% 16.42%" : undefined }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
