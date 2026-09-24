"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Autoplay,
  EffectCreative,
  Pagination,
} from "swiper/modules";
import { dashboardService } from "@/services/dashboardService.ts";
import { useAutoplayAllowed } from "@/utils/useAutoplayAllowed";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import {SmartImage} from "@/utils/SmartImage.tsx";
import {Loader2} from "lucide-react";

type ProjectItem = {
  cover: string;
  title: string;
  slug: string;
};

const STATIC_CONTENT = {
  challenge:
    "The product had powerful features, but users struggled to understand its value within the first few seconds. High bounce rate and low onboarding completion were limiting growth.",
  solution:
    "We designed a concise explainer video with animated UI flows, clear visual hierarchy, and focused storytelling to guide users through the product's core benefits.",
  stats: [
    { label: "+42% viewer retention" },
    { label: "+31% onboarding completion" },
  ],
  resultText: "Faster user understanding and reduced support requests",
};

export default function CaseStudiesSection() {
  const [projects, setProjects] = useState<ProjectItem[] | null>(null);
  const [mounted, setMounted] = useState(false);
  const autoplayAllowed = useAutoplayAllowed();

  const data = async () => {
    try {
      const data = await dashboardService.getAllProjects();
      setProjects(data.projects);
    } catch (err) {
      console.error("[CaseStudiesSection] Failed to load projects", err);
      setProjects([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    data();
  }, []);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* هدر بخش */}
        <div className="mb-10 md:mb-14 text-center">
          <p className="mb-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-cyan-400/80">
            Customer Stories
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight text-white">
            <span className="block bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent pb-1">
              CASE STUDIES
            </span>
            <span className="block mt-1">From Idea to Impact</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] sm:text-base leading-relaxed text-white/60 font-light">
            Real projects. Real challenges. Measurable results.
            <span className="block mt-1">
              Here&apos;s how motion graphics helped brands communicate better
              and perform stronger.
            </span>
          </p>
        </div>

        {/* بدنه اصلی اسلایدر */}
        <div className="relative">
          {!projects ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[24px] md:rounded-[32px] border border-[#1a5660]/50 bg-[#071922]/80 backdrop-blur-2xl overflow-hidden min-h-[400px] sm:min-h-[500px]">
              <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center p-5 sm:p-8 md:p-10 lg:p-12 border-t lg:border-t-0 lg:border-r border-white/10">
                <div className="h-7 w-3/4 rounded-lg bg-white/5 animate-pulse mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="rounded-[18px] bg-white/5 p-4 md:p-5">
                    <div className="h-4 w-24 rounded bg-white/10 animate-pulse mb-3" />
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
                      <div className="h-3 w-5/6 rounded bg-white/5 animate-pulse" />
                      <div className="h-3 w-4/6 rounded bg-white/5 animate-pulse" />
                    </div>
                  </div>
                  <div className="rounded-[18px] bg-white/5 p-4 md:p-5">
                    <div className="h-4 w-28 rounded bg-white/10 animate-pulse mb-3" />
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
                      <div className="h-3 w-5/6 rounded bg-white/5 animate-pulse" />
                      <div className="h-3 w-3/6 rounded bg-white/5 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="h-4 w-20 rounded bg-white/10 animate-pulse mb-3" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 w-28 rounded-full bg-white/5 animate-pulse" />
                    <div className="h-6 w-32 rounded-full bg-white/5 animate-pulse" />
                  </div>
                  <div className="h-8 w-52 rounded-full bg-white/5 animate-pulse mb-4" />
                  <div className="h-11 w-48 rounded-full bg-white/5 animate-pulse" />
                </div>
              </div>
              <div className="order-1 lg:order-2 lg:col-span-5 relative h-[250px] sm:h-[320px] md:h-[400px] lg:h-full w-full overflow-hidden bg-white/[0.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01] animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071922] via-[#071922]/20 to-transparent" />
              </div>
            </div>
          ) : mounted ? (
          <Swiper
            modules={[Navigation, Autoplay, EffectCreative, Pagination]}
            effect="creative"
            speed={800} // سرعت نرم‌تر شدن ترنزیشن
            creativeEffect={{
              // تنظیمات انیمیشن خفن اسلاید: قبلی میره عقب و تاریک میشه، بعدی از راست میاد
              prev: {
                shadow: true,
                translate: ["-20%", 0, -200],
                opacity: 0,
              },
              next: {
                translate: ["100%", 0, 0],
              },
            }}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-case",
              prevEl: ".swiper-button-prev-case",
            }}
            pagination={{
              el: ".custom-swiper-pagination",
              clickable: true,
              bulletClass: "swiper-custom-bullet",
              bulletActiveClass: "swiper-custom-bullet-active",
            }}
            autoplay={autoplayAllowed ? { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            className="rounded-[24px] md:rounded-[32px] border border-[#1a5660]/50 bg-[#071922]/80 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          >
            {projects.map((project) => {
              const coverSrc = project.cover?.startsWith("http")
                ? project.cover
                : `${import.meta.env.PUBLIC_API_URL}${project.cover}`;

              return (
              <SwiperSlide key={project.slug}>
                <div className="grid h-full grid-cols-1 lg:grid-cols-12">
                  {/* بخش محتوا (متن‌ها) */}
                  <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center p-5 sm:p-8 md:p-10 lg:p-12 border-t lg:border-t-0 lg:border-r border-white/10 min-h-0">
                    <h3 className="mb-6 text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white leading-tight tracking-tight">
                      {project.title}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="rounded-[18px] border border-cyan-400/20 bg-cyan-500/5 p-4 md:p-5 transition-colors hover:bg-cyan-500/10">
                        <h4 className="mb-2 text-sm font-bold text-cyan-300">
                          The Challenge
                        </h4>
                        <p className="text-xs sm:text-sm leading-[1.7] text-white/65">
                          {STATIC_CONTENT.challenge}
                        </p>
                      </div>

                      <div className="rounded-[18px] border border-teal-400/20 bg-teal-500/5 p-4 md:p-5 transition-colors hover:bg-teal-500/10">
                        <h4 className="mb-2 text-sm font-bold text-teal-300">
                          Our Motion Solution
                        </h4>
                        <p className="text-xs sm:text-sm leading-[1.7] text-white/65">
                          {STATIC_CONTENT.solution}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3 text-sm md:text-base font-bold text-white">
                        The Result
                      </h4>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {STATIC_CONTENT.stats.map((stat, idx) => (
                          <span
                            key={idx}
                            className="rounded-full border border-cyan-400/20 bg-[#0a262e] px-4 py-1.5 text-[12px] font-medium text-cyan-100/90 shadow-inner"
                          >
                            {stat.label}
                          </span>
                        ))}
                      </div>

                      <div className="mb-6 inline-flex w-full sm:w-auto rounded-xl sm:rounded-full border border-cyan-400/15 bg-[#081e24] px-4 py-2.5 text-center text-[12px] sm:text-[13px] text-white/80">
                        ✨ {STATIC_CONTENT.resultText}
                      </div>

                      <div className="mt-2">
                        <a
                          href={`/case/${project.slug}`}
                          className="group relative inline-flex w-full sm:w-auto overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-[0.98]"
                        >
                          <span className="relative z-10">
                            See Full Case Study
                          </span>
                          <div className="absolute inset-0 z-0 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* بخش تصویر */}
                  <div className="order-1 lg:order-2 lg:col-span-5 relative h-[250px] sm:h-[320px] md:h-[400px] lg:h-full w-full overflow-hidden border-b lg:border-b-0 border-white/10">
                    <SmartImage
                      src={coverSrc}
                      alt={project.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transform-gpu transition-transform duration-[10s] hover:scale-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071922] via-[#071922]/20 to-transparent opacity-80 lg:opacity-60" />
                  </div>
                </div>
              </SwiperSlide>
              );
            })}
          </Swiper>
          ) : (
            <div className="rounded-[24px] md:rounded-[32px] border border-[#1a5660]/50 bg-[#071922]/80 backdrop-blur-2xl overflow-hidden min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          )}

          {mounted && (<>
          {/* دکمه‌های اسلایدر */}
          <button className="swiper-button-prev-case group absolute -left-5 top-1/2 z-20 hidden lg:flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#071922]/90 text-white shadow-lg backdrop-blur-md transition-all hover:border-cyan-400/50 hover:bg-[#0a262e] hover:text-cyan-400 active:scale-95">
            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="swiper-button-next-case group absolute -right-5 top-1/2 z-20 hidden lg:flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#071922]/90 text-white shadow-lg backdrop-blur-md transition-all hover:border-cyan-400/50 hover:bg-[#0a262e] hover:text-cyan-400 active:scale-95">
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* پگینیشن واقعی */}
          <div className="custom-swiper-pagination mt-6 flex justify-center gap-2.5"></div>
          </>)}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .swiper-custom-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          display: block;
        }
        .swiper-custom-bullet-active {
          width: 24px;
          border-radius: 4px;
          background-color: #22d3ee; 
          box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
        }
      `,
        }}
      />
    </section>
  );
}
