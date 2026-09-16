import React, { useEffect, useRef, useState } from "react";
import { SmartImage } from "@/utils/SmartImage.tsx";
import SecondaryButton from "@/components/Shared/SecondaryButton";
import PrimaryButton from "@/components/Shared/PrimaryButton";
import RightSectionHero from "@/islands/Home/RightSectionHero";

const items = [
  { src: "/home/Hero/clients/1.webp" },
  { src: "/home/Hero/clients/2.webp" },
  { src: "/home/Hero/clients/3.webp" },
  { src: "/home/Hero/clients/4.webp" },
];

// شمارش تدریجی عدد وقتی وارد دید میشه
function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || started.current) return;
      started.current = true;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}

function CountUpStat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="flex items-baseline gap-2">
      <span ref={ref} className="text-xl sm:text-2xl font-extrabold text-[#00E6D7] tabular-nums">
        {value}{suffix}
      </span>
      <span className="text-sm sm:text-base text-white/70 font-medium">{label}</span>
    </div>
  );
}

export default function HeroHome() {
  const [activeTab, setActiveTab] = useState("showreel");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleTimeUpdate = () => {
    // Direct handler without causing React re-renders
  };

  return (
    <section className="relative w-full overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28 bg-[radial-gradient(ellipse_1000px_600px_at_50%_-10%,rgba(0,169,189,0.12),transparent_70%),radial-gradient(ellipse_700px_350px_at_90%_25%,rgba(46,182,160,0.08),transparent_60%)]">
      {/* Ambient blobs */}


      <div className="relative mx-auto max-w-[1550px] px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-center gap-10 lg:gap-8 xl:gap-14 lg:flex-row lg:items-center lg:justify-between">

        {/* Right Side / Large Video Player Mockup */}
        <div className="w-full lg:w-[58%] xl:w-[60%] order-1 lg:order-2 flex justify-center">
          <RightSectionHero
            activeTab={activeTab}
            videoRef={videoRef}
            handleTimeUpdate={handleTimeUpdate}
            onCategoryChange={setActiveTab}
          />
        </div>

        {/* Left Side: Content & CTAs */}
        <div className="w-full lg:w-[42%] xl:w-[40%] order-2 lg:order-1 flex flex-col items-center text-center lg:items-start lg:text-left animate-fade-in">
          <p className="tracking-[0.25rem] text-[#00E6D7]/90 text-xs sm:text-sm uppercase font-semibold animate-slide-up">
            Product Launch Videos · Explainers · Social Media Content
          </p>

          <h1 className="mt-4 text-3xl sm:text-5xl lg:text-[3rem] xl:text-[3.5rem] font-extrabold leading-[1.1] text-white animate-slide-up max-w-xl">
            <span className="block bg-gradient-to-r from-[var(--primitive-teal-400)] via-[#38e2d4] to-[#25aeb2] bg-clip-text text-transparent pb-1">
              Premium Motion Design,
            </span>
            <span className="block text-white">Animation & Editing Studio</span>
            <span className="mt-3 block text-white/90 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold drop-shadow-md">
              Make Your Brand Impossible to Ignore.
            </span>
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-[1.15rem] leading-relaxed text-white/80 max-w-xl font-light animate-fade-in">
            EyesOn Studio helps brands turn ideas, products, and messages into premium videos, motion graphics, product launch videos, explainers, social media content, and high quality video editing built to capture attention, explain faster, and make people remember you.
          </p>

          <div className="mt-7 sm:mt-9 flex flex-wrap gap-4 justify-center lg:justify-start w-full sm:w-auto animate-slide-up">
            <PrimaryButton text="Get Started" href="/contact" width="14rem" height="52px" />
            <SecondaryButton text="View Pricing" href="/pricing" width="14rem" height="52px" />
          </div>

          <p className="mt-6 sm:mt-7 text-xs sm:text-sm text-white/50 tracking-wider">
            Trusted by brands, founders, and creative teams across 25+ countries.
          </p>
        </div>
      </div>

      {/* Social proof — stats bar */}
      <div className="mt-14 sm:mt-18 lg:mt-24 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center gap-6 text-white animate-fade-in">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5 isolate">
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{ zIndex: items.length - index }}
                  className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border-2 cursor-pointer shadow-md transition-all duration-200 hover:scale-110 hover:-translate-y-1
                    ${index === 3 ? "border-white/20" : "border-[var(--color-border)]"} bg-zinc-700`}
                >
                  <SmartImage src={item.src} />
                </div>
              ))}
            </div>
            <p className="text-sm sm:text-base font-semibold text-white/95">
              80+ Happy Clients
            </p>
          </div>

          <div className="hidden sm:block h-8 w-px bg-white/10" />

          <CountUpStat target={1200} suffix="+" label="Projects Delivered" />

          <div className="hidden sm:block h-8 w-px bg-white/10" />

          <CountUpStat target={25} suffix="+" label="Countries Served" />
        </div>

        <div className="h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-[var(--color-border-teal)] to-transparent opacity-60" />
      </div>

      <style>{`@keyframes blobFloat{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(18px,-18px) scale(1.04)}}@media(prefers-reduced-motion:reduce){[style*="blobFloat"]{animation:none!important}}`}</style>
    </section>
  );
}
