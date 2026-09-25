"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProcessScrollSection.css";

const PROCESS_STEPS = [
  {
    id: 1,
    step: "Step 1",
    icon: (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
    title: "Discover & Define",
    description:
      "We learn about your brand, goals, audience, references, and the message you want to\n" +
        "communicate. Then we turn everything into a clear creative direction before production\n" +
        "starts.",
    tags: ["Discovery", "References", "Creative Direction"],
  },
  {
    id: 2,
    step: "Step 2",
    icon: (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Design & Produce",
    description:
      "Our team creates the visuals, motion, animation, or edits based on the approved direction,\n" +
        "with a focus on style, pacing, clarity, and strong execution.",
    tags: ["Design", "Animation", "Editing"],
  },
  {
    id: 3,
    step: "Step 3",
    icon: (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: "Refine & Deliver",
    description:
      "You review the work, share feedback, and we polish the final version until it feels ready.\n" +
        "Then we deliver the final files prepared for launch, ads, social media, or your website.",
    tags: ["Feedback", "Final Polish", "Delivery"],
  },
];

export default function ProcessScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Track lg breakpoint so the pinned visual is never mounted / fetched on mobile.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        (window as any).__REDUCED_MOTION__ === true);

    const el = sectionRef.current;
    const steps = el ? el.querySelectorAll(".process-step") : document.querySelectorAll(".process-step");

    let observer: IntersectionObserver | null = null;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      steps.forEach((step) => step.classList.add("in-view"));
    } else {
      const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer?.unobserve(entry.target);
          }
        });
      }, observerOptions);

      steps.forEach((step) => observer?.observe(step));
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (prefersReduced) return;
      if (gridContainerRef.current && pinRef.current) {
        ScrollTrigger.create({
          trigger: gridContainerRef.current,
          start: "top top+=128",
          end: () =>
            `+=${Math.max(
              0,
              (gridContainerRef.current?.offsetHeight || 0) -
                (pinRef.current?.offsetHeight || 0)
            )}`,
          pin: pinRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        });
        ScrollTrigger.refresh();
      }
    });

    return () => {
      observer?.disconnect();
      mm.revert();
    };
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--space-2xl)] sm:py-[var(--space-3xl)] lg:py-[var(--space-3xl)] overflow-hidden"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--space-gutter)] sm:px-[var(--space-gutter-md)] lg:px-[var(--space-gutter-lg)]">
        
        <div className="mb-12 sm:mb-16 lg:mb-16 max-w-3xl flex flex-col items-center text-center lg:items-start lg:text-left mx-auto lg:mx-0">
          <p className="text-caption text-white/50 mb-3 sm:mb-4 tracking-[0.18em]">
            Our Creative Process
          </p>
          <h2 className="text-h2 text-white mb-4 sm:mb-6 leading-[1.12]">
            <span className="text-[#00E6D7]/90">From Idea to Results</span>,
            How We Bring Your Project to Life
          </h2>
          <p className="text-small text-white/60 lg:text-body leading-relaxed max-w-xl">
            Every strong project needs a clear path. We guide your idea through strategy, creative
            direction, production, feedback, and final delivery, so the process feels smooth and the
            final result is ready to perform.
          </p>
        </div>

        <div
          ref={gridContainerRef}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 relative items-start"
        >
          <div className="space-y-10 sm:space-y-12 lg:space-y-20 lg:pb-24 min-w-0">
            {PROCESS_STEPS.map((step) => (
              <div key={step.id} className="process-step will-change-transform">
                <div className="relative p-6 sm:p-8 rounded-[var(--radius-xl)] sm:rounded-[var(--radius-xl)] bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-md hover:border-[var(--card-border-hover)] hover:shadow-[var(--card-shadow-hover)] transition-[border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-default)] group shadow-[var(--elevation-1)]">
                  
                  <div className="absolute step-bg top-5 right-5 sm:top-8 sm:right-8 text-[10px] sm:text-xs font-bold px-3 py-1 sm:py-1.5 rounded-full border border-[var(--color-border)] bg-white/[0.04] text-white/70">
                    {step.step}
                  </div>

                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[var(--radius-lg)] di-bg flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-[1.04] transition-transform duration-[var(--duration-normal)] ease-[var(--ease-default)] border border-white/[0.06] bg-white/[0.04]">
                    {step.icon}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 font-light">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {step.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--color-surface)] text-white/70 text-[11px] sm:text-sm border border-[var(--color-border)] hover:border-[var(--color-border-teal)] hover:text-white transition-colors duration-[var(--duration-normal)] cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)] rounded-[var(--radius-xl)] pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* ===== Pinned Parallax (Desktop Only — not mounted on mobile, so no blank space / no image fetch) ===== */}
          {isDesktop && (
            <div className="hidden lg:block relative self-start">
              <div
                ref={pinRef}
                className="w-full h-[750px] flex items-center justify-center will-change-transform"
              >
                <div className="relative w-full h-full">
                  <img
                    src="/svg-parts/home/single-webp/full.webp"
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}