"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ApproachTimelineSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  steps?: number[];
  desktopSrc?: (step: number) => string;
  mobileSrc?: (step: number) => string;
};

const DEFAULT_STEPS = [1, 2, 3, 4, 5, 6];

const DEFAULT_DESCRIPTION =
  "We don’t just design visuals and hope they work. Every ad creative is built through a clear process focused on hooks, message clarity, platform behavior, visual impact, and conversion.";

export default function ApproachTimelineSection({
  eyebrow = "OUR PROCESS",
  title = "Our Approach to High Performing Ad Creatives",
  description = DEFAULT_DESCRIPTION,
  steps = DEFAULT_STEPS,
  desktopSrc = (step) => `/adcreatives/svg/multi-layer/${step}.svg`,
  mobileSrc = (step) => `/adcreatives/approach/R2W (${step}).webp`,
}: ApproachTimelineSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineWrapperRef = useRef<HTMLDivElement>(null);
  const fillLineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lineBounds, setLineBounds] = useState<{ top: number; height: number }>({ top: 0, height: 0 });

  // Measure exact distance from center of circle 1 to center of circle 6
  useEffect(() => {
    const updateLinePosition = () => {
      const container = containerRef.current;
      const lineWrapper = lineWrapperRef.current;
      const firstCircle = circleRefs.current[0];
      const lastCircle = circleRefs.current[steps.length - 1];

      if (!container || !lineWrapper || !firstCircle || !lastCircle) return;

      const containerRect = container.getBoundingClientRect();
      const firstRect = firstCircle.getBoundingClientRect();
      const lastRect = lastCircle.getBoundingClientRect();

      const top = firstRect.top - containerRect.top + firstRect.height / 2;
      const bottom = lastRect.top - containerRect.top + lastRect.height / 2;
      const height = Math.max(0, bottom - top);

      lineWrapper.style.top = `${top}px`;
      lineWrapper.style.height = `${height}px`;
      lineWrapper.style.bottom = "auto";
    };

    updateLinePosition();

    // Use requestAnimationFrame & ResizeObserver to capture loaded image dimensions accurately
    const rafId = requestAnimationFrame(updateLinePosition);
    const ro = typeof ResizeObserver !== "undefined" && containerRef.current
      ? new ResizeObserver(updateLinePosition)
      : null;
    if (ro && containerRef.current) {
      ro.observe(containerRef.current);
    }

    window.addEventListener("resize", updateLinePosition);
    return () => {
      cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateLinePosition);
    };
  }, [steps.length]);

  // GSAP ScrollTrigger for smooth fill on scroll
  useEffect(() => {
    const container = containerRef.current;
    const fillLine = fillLineRef.current;
    if (!container || !fillLine) return;

    const reduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        (window as any).__REDUCED_MOTION__ === true);

    if (reduced) {
      gsap.set(fillLine, { scaleY: 1 });
      return;
    }

    gsap.set(fillLine, { scaleY: 0, transformOrigin: "top center" });

    const ctx = gsap.context(() => {
      gsap.to(fillLine, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "bottom 75%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      // Light up circles as the scroll line reaches each one
      circleRefs.current.forEach((circle) => {
        if (!circle) return;
        gsap.fromTo(
          circle,
          {
            borderColor: "#46B59E",
            boxShadow: "0 0 10px rgba(70, 181, 158, 0.3)",
          },
          {
            borderColor: "#23d8dc",
            boxShadow: "0 0 24px rgba(35, 216, 220, 0.85), inset 0 0 12px rgba(35, 216, 220, 0.4)",
            scrollTrigger: {
              trigger: circle,
              start: "top 75%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, container);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-10 lg:px-20 flex justify-center items-center"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#c2d3dc]">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#c3d4de] md:text-base">
            {description}
          </p>
        </div>

        <div ref={containerRef} className="relative mx-auto mt-10 max-w-5xl">
          {/* Timeline line connecting exactly circle 01 to circle 06 */}
          <div
            ref={lineWrapperRef}
            className="absolute top-6 bottom-6 md:top-7 md:bottom-7 left-5 -translate-x-1/2 md:left-10 hidden md:block w-0.5 z-0 pointer-events-none"
          >
            {/* Background inactive track */}
            <div className="absolute inset-0 w-full bg-[#46B59E]/25 rounded-full" />

            {/* Animated active glowing fill track */}
            <div
              ref={fillLineRef}
              className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-[#46B59E] via-[#23d8dc] to-[#00E6D7] shadow-[0_0_14px_#23d8dc] rounded-full origin-top"
            />
          </div>

          {/* Cards with circles */}
          <div className="space-y-4 md:space-y-6 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="flex items-center gap-6 md:gap-12 transition-transform duration-300 hover:scale-[1.01]"
              >
                {/* Numbered circle on the line (desktop/tablet only) */}
                <div className="relative hidden md:flex w-10 shrink-0 items-center justify-center md:w-20">
                  <div
                    ref={(el) => {
                      circleRefs.current[index] = el;
                    }}
                    className="relative flex h-12 w-12 items-center justify-center md:h-14 md:w-14 rounded-full border border-[#46B59E] bg-[#032635] text-base font-bold text-white shadow-[0_0_14px_rgba(83,226,202,0.45)] md:text-xl transition-colors duration-300"
                  >
                    {`0${step}`}
                  </div>
                </div>

                {/* Card SVG */}
                <div
                  className="min-w-0 flex-1 overflow-hidden opacity-95 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={desktopSrc(step)}
                    alt={`Step ${step}'s svg`}
                    className="hidden h-auto w-full md:block"
                    loading="lazy"
                  />
                  <img
                    src={mobileSrc(step)}
                    alt={`Step ${step}`}
                    className="h-auto w-full md:hidden"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
  