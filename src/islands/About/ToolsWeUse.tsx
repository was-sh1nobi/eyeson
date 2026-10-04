"use client";

import React, { useEffect, useRef, useState } from "react";
import { SmartImage } from "../../utils/SmartImage.tsx";

const tools = [
  { name: "After Effects", icon: "/icons/about/aftereffect.png" },
  { name: "Premiere Pro", icon: "/icons/about/premierpro.png" },
  { name: "Blender", icon: "/icons/about/blender.png" },
  { name: "Figma", icon: "/icons/about/figma.png" },
  { name: "Photoshop", icon: "/icons/about/photoshop.png" },
  { name: "Illustrator", icon: "/icons/about/illustrator.png" },
  { name: "Miro", icon: "/icons/about/miro.png" },
  { name: "Cinema 4D", icon: "/icons/about/cinema4d.png" },
  { name: "DaVinci Resolve", icon: "/icons/about/davinciresolve.png" },
  { name: "Framer", icon: "/icons/about/framer.png" },
  { name: "Lottie", icon: "/icons/about/lottie.png" },
  { name: "ChatGPT", icon: "/icons/about/chatgpt.png" },
  { name: "ElevenLabs", icon: "/icons/about/elevenlabs.png" },
  { name: "HeyGen", icon: "/icons/about/heygen.png" },
  { name: "Higgsfield", icon: "/icons/about/higgsfield.png" },
  { name: "Midjourney", icon: "/icons/about/midjourney.png" },
];

export const ToolsComponent = () => {
  // ظاهر شدن تدریجی بج‌ها وقتی وارد دید میشن
  const gridRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 lg:py-32">
      {/* هاله نوری ملایم در بک‌گراند */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00A9BD]/10 blur-[100px]" />

      <div
        className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center animate-fade-in"
      >
        {/* ========================================== */}
        {/* متون هدر */}
        {/* ========================================== */}
        <div
          className="mb-10 sm:mb-14 flex flex-col gap-3 sm:gap-4 animate-slide-up"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-white">
            Tools <span className="text-[#31B9C4]">We Use</span>
          </h2>
          <p className="text-[14px] sm:text-base md:text-lg font-light text-gray-400">
            Industry-leading technologies and platforms
          </p>
        </div>

        {/* ========================================== */}
        {/* کپسول‌های ابزار (Badges) */}
        {/* ========================================== */}
        <div
          ref={gridRef}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:gap-4 w-full"
        >
          {tools.map((tool, idx) => (
            <div
              key={tool.name}
              style={{
                transitionDelay: shown ? `${(idx % 8) * 60}ms` : "0ms",
              }}
              className={`group relative cursor-default overflow-hidden rounded-full border border-white/10 bg-[#0A1A2A]/40 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 shadow-sm transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-0.5 active:scale-95 hover:border-[#00A9BD]/50 hover:bg-[#00A9BD]/10 hover:shadow-[0_0_20px_rgba(0,169,189,0.2)] ${
                shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="relative z-10 flex items-center gap-2">
                <SmartImage
                  src={tool.icon}
                  alt={tool.name}
                  width={20}
                  height={20}
                  objectFit="contain"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
                <h3 className="text-[13px] sm:text-[14px] md:text-base font-medium tracking-wide text-gray-300 group-hover:text-white transition-colors duration-200">
                  {tool.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
