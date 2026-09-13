"use client";
import type { JSX } from "astro/jsx-runtime";
import { useState } from "react";

type WorkflowItem = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

// آیکون‌های مشابه با تصویر (به صورت SVG)
const icons = {
  concept: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
      />
    </svg>
  ),
  design: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  animation: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
      />
    </svg>
  ),
  lighting: (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
};

const workflowItems: WorkflowItem[] = [
  {
    id: 1,
    title: "Concept & Creative Planning",
    description:
      "We begin by understanding your brand, goals, audience, and message to define the visual\n" +
        "direction, storytelling approach, animation style, and overall creative vision behind the\n" +
        "project.",
    icon: icons.concept,
  },
  {
    id: 2,
    title: "Design, Modeling & Visual Systems",
    description:
      "Scenes, assets, environments, motion systems, and visual elements are developed with a\n" +
        "consistent design language to create a more premium and unified final result.",
    icon: icons.design,
  },
  {
    id: 3,
    title: "Animation & Motion Development",
    description:
      "Motion, transitions, camera movement, timing, and scene interactions are carefully\n" +
        "animated to create smoother storytelling, stronger pacing, and more engaging visual flow.",
    icon: icons.animation,
  },
  {
    id: 4,
    title: "Lighting, Polish & Final Compositing",
    description:
      "Lighting, textures, sound integration, visual polish, color work, and compositing are refined\n" +
        "in the final stage to deliver cinematic-quality animations optimized for websites, ads,\n" +
        "social media, SaaS products, and modern campaigns.",
    icon: icons.lighting,
  },
];

export default function AnimationWorkflowSection() {
  const [openId, setOpenId] = useState<number>(1);

  return (
    // حذف بک‌گراند کلی از سکشن، فقط استایل پدینگ و فونت
    <section className="relative w-full overflow-hidden px-4 pt-4 pb-16 sm:px-8 md:pt-8 md:pb-24 lg:px-16 font-sans">
      {/* گرید دو ستونه */}
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-start">
        {/* === ستون چپ: متن و عکس === */}
        <div className="flex flex-col text-left lg:sticky lg:top-24 max-sm:text-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#00aabf] mb-4">
            OUR WORKFLOW
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold leading-[1.15] text-white mb-6 ">
            A Structured <br />
            <span className="text-[#55D2B9]">2D & 3D Animation</span>
            <br />
            Production Workflow
          </h2>
          <p className="text-[13px] sm:text-sm leading-[1.8] text-white/60">
            Strong animation requires more than visuals alone. Behind every polished scene is a
            production system built around planning, creative direction, motion design, and attention
            to detail. Our workflow is designed to keep projects efficient, visually consistent, and
            aligned with modern digital platforms from concept to final delivery.
          </p>

          {/* عکس دسکتاپ (بدون بک‌گراند باکس، مستقیما عکس) */}
          <div className="mt-8 md:mt-12 w-full max-w-100 mx-auto sm:mx-0">
            <img
              src="/preview.webp" // همون عکس 3D که توی دیزاینت هست رو اینجا لود کن
              alt="Workflow 3D visual"
              width={609}
              height={410}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* === ستون راست: باکس اصلی حاوی لیست آکاردئون === */}
        <div className="relative w-full rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-[#00aabf]/20 to-[#0A1A1F]/90 backdrop-blur-xl border border-[#244b4b]/50 shadow-[0_0_50px_rgba(27,54,54,0.3)] overflow-hidden">
          {/* خط دکوری فیروزه‌ای سمت چپ کانتینر */}
          <div className="absolute left-0 top-16 bottom-16 w-[3px] bg-[#00aabf]/80 rounded-r-md hidden sm:block shadow-[0_0_15px_#00aabf]" />

          <div className="flex flex-col">
            {workflowItems.map((item, index) => {
              const isOpen = openId === item.id;
              // خط جداکننده بین آیتم‌ها (بجز آخری)
              const isLast = index === workflowItems.length - 1;

              return (
                <article
                  key={item.id}
                  className={`w-full transition-all duration-300 ${
                    !isLast ? "border-b border-white/5" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? 0 : item.id)}
                    className="flex w-full cursor-pointer items-center gap-5 px-6 py-6 text-left transition-colors duration-300 hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00aabf] group sm:px-10 sm:py-7"
                  >
                    {/* باکس آیکون */}
                    <div className="relative shrink-0">
                      {/* افکت نوری دور آیکون */}
                      <div className="absolute inset-0 bg-[#00aabf] blur-md opacity-20 rounded-xl" />
                      <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#122b2e] to-[#0d1f23] border border-[#1e4444] text-[#00aabf] shadow-[inset_0_1px_12px_rgba(77,226,196,0.1)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#00aabf]/60 group-hover:text-[#55d2b9] group-hover:shadow-[inset_0_1px_12px_rgba(77,226,196,0.1),0_0_24px_rgba(0,170,191,0.25)]">
                        {item.icon}
                      </div>
                    </div>

                    {/* تایتل */}
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-[#55d2b9]">
                      {item.title}
                    </h3>
                  </button>

                  {/* محتوای توضیحات آکاردئون */}
                  <div
                    className={`grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 pb-8"
                        : "grid-rows-[0fr] opacity-0 pb-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 sm:px-10 text-[14px] sm:text-[15px] leading-relaxed text-white/70 max-w-[90%]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
