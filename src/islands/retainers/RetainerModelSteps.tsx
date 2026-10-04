"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ModelStep = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const defaultSteps: ModelStep[] = [
  {
    id: 1,
    title: "Prioritize",
    description:
      "Tell us what matters most this month. We define priorities together.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Produce",
    description:
      "Our team handles the creative and production without you chasing freelancers.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Review",
    description:
      "Your team gives feedback through a structured workflow and revision rounds.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Deliver",
    description:
      "Final assets are prepared for the platforms and formats you need.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Repeat",
    description:
      "We move directly into the next priorities without restarting the entire process.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
];

export default function RetainerModelSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const steps = stepsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || !line || steps.length === 0) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (window as any).__REDUCED_MOTION__ === true;

    // ponytail: no GSAP on reduced-motion or small screens — show everything immediately
    if (prefersReduced) {
      line.style.transform = "scaleY(1)";
      steps.forEach((s) => {
        s.style.opacity = "1";
        s.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Progress line grows with scroll
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.8,
          },
        }
      );

      // Stagger each card in
      steps.forEach((step, i) => {
        gsap.fromTo(
          step,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.05, // micro-stagger for overlapping triggers
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--space-2xl)] sm:py-[var(--space-3xl)] overflow-hidden"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-gutter)] sm:px-[var(--space-gutter-md)] lg:px-[var(--space-gutter-lg)]">
        {/* Header */}
        <div className="mb-12 sm:mb-16 max-w-3xl flex flex-col items-center text-center mx-auto">
          <p className="text-caption text-white/50 mb-3 sm:mb-4 tracking-[0.18em]">
            FLEXIBLE BY DESIGN
          </p>
          <h2 className="text-h2 text-white mb-4 sm:mb-6 leading-[1.12]">
            Built Around Your{" "}
            <span className="text-[#00E6D7]/90">Monthly Priorities.</span>
          </h2>
          <p className="text-small text-white/60 sm:text-body leading-relaxed max-w-xl">
            We don't believe every month should look exactly the same.
            One month you may need six social videos. The next, a product video,
            three ads, and several supporting creatives. Your retainer adapts to
            the work that matters most.
          </p>
        </div>

        {/* Steps timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Background track */}
          <div
            className="absolute left-5 sm:left-7 top-0 bottom-0 w-px bg-white/[0.06]"
            aria-hidden="true"
          />
          {/* Animated progress line */}
          <div
            ref={lineRef}
            className="absolute left-5 sm:left-7 top-0 bottom-0 w-px"
            style={{ transform: "scaleY(0)", transformOrigin: "top", background: "linear-gradient(to bottom, #00A9BD, #00E6D7 60%, transparent)" }}
            aria-hidden="true"
          />

          <div className="space-y-6 sm:space-y-8">
            {defaultSteps.map((step, i) => (
              <div
                key={step.id}
                ref={(el) => { stepsRef.current[i] = el; }}
                className="flex items-start gap-4 sm:gap-6 will-change-transform"
                style={{ opacity: 0, transform: "translateY(40px) translateZ(0)" }}
              >
                {/* Step number circle */}
                <div className="relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full border border-[#00A9BD]/40 bg-[#0b1f2a] text-sm sm:text-lg font-bold text-[#00E6D7] shadow-[0_0_20px_rgba(0,169,189,0.3)]">
                  {step.id}
                </div>

                {/* Card */}
                <div className="flex-1 relative p-5 sm:p-6 rounded-[var(--radius-xl)] bg-gradient-to-br from-[#0b1f2a] to-[#020915] border border-white/[0.08] hover:border-[#00A9BD]/40 hover:shadow-[0_0_24px_rgba(0,169,189,0.2)] transition-[border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-default)] group shadow-[var(--elevation-1)]">
                  {/* Icon + title row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-[var(--radius-lg)] border border-[#00A9BD]/30 bg-[#00A9BD]/10 text-[#00E6D7] group-hover:scale-[1.04] transition-transform duration-[var(--duration-normal)] ease-[var(--ease-default)]">
                      {step.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-white/55 text-sm sm:text-base leading-relaxed font-light">
                    {step.description}
                  </p>

                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)] rounded-[var(--radius-xl)] pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
