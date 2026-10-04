"use client";

import { useRef, useState } from "react";
import { ClosedCaption, Palette, AudioWaveformIcon } from "lucide-react";
import { Scissors } from "lucide-react";
import { SmartImage } from "../../utils/SmartImage.tsx";

const includedCards = [
  {
    id: 1,
    title: "Captions Built for Social Platforms",
    description:
      "Most people watch social content without sound first. We design captions for readability, mobile viewing, retention, and smoother content consumption across modern platforms.",
    icon: ClosedCaption,
  },
  {
    id: 2,
    title: "Visual Polish & Color Finishing",
    description:
      "Color, lighting, contrast, and visual cleanup help content feel sharper, cleaner, and more professional without making it feel over-edited or distracting.",
    icon: Palette,
  },
  {
    id: 3,
    title: "Motion, B-Roll & Visual Rhythm",
    description:
      "Strategic motion, b-roll, zooms, overlays, and scene pacing help the content feel more dynamic, easier to follow, and visually engaging from start to finish.",
    icon: Scissors,
  },
  {
    id: 4,
    title: "Audio & Viewing Experience",
    description:
      "Bad audio instantly weakens content. We clean distractions, balance sound, and shape the audio experience to make videos feel smoother, clearer, and easier to watch.",
    icon: AudioWaveformIcon,
  },
];

export default function WhatsIncludedSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const frameRef = useRef<number | null>(null);

  return (
    <section className="px-6 pb-24 pt-8 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#c2d3dc]">
            THE DIFFERENCE IS IN THE DETAILS
          </p>
          <h2 className="text-4xl font-extrabold text-white md:text-5xl">
            Why Some Videos Feel
            <br />
            Better Than Others
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <article className="flex flex-col justify-between rounded-2xl bg-[#0B1F2A] border border-white/5 p-6 sm:p-8 shadow-xl">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#46B6A0] to-[#00A9BD] bg-clip-text text-transparent leading-snug">
                Hook & Attention Optimization
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c4d6df]">
                The first seconds matter the most. We improve hooks, pacing, cuts,
                structure, and visual timing to make content feel more immediate,
                engaging, and harder to scroll past.
              </p>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#c4d6df]/80">
                Pacing, captions, motion, sound, and visual rhythm all shape how professional and memorable content feels online.
              </p>
            </div>

            <div className="relative mt-5 w-full flex-1 min-h-55 overflow-hidden rounded-xl border border-white/10 shadow-[0_0_15px_#00A9BDB2]">
              <SmartImage
                src="/animation-section/video.webp"
                alt="Hook optimization sample"
                fill
                className="object-cover"
              />
            </div>
          </article>

          <div
            ref={sliderRef}
            onScroll={() => {
              if (!sliderRef.current) return;
              if (frameRef.current) return;
              frameRef.current = requestAnimationFrame(() => {
                frameRef.current = null;
                if (!sliderRef.current) return;
                const { scrollLeft, clientWidth } = sliderRef.current;
                const idx = Math.max(
                  0,
                  Math.min(
                    includedCards.length - 1,
                    Math.round(scrollLeft / clientWidth),
                  ),
                );
                setActiveIndex((prev) => (prev === idx ? prev : idx));
              });
            }}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto lg:grid lg:overflow-visible lg:snap-none lg:gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:auto-rows-fr [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {includedCards.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.id}
                  className="w-full min-w-full sm:min-w-0 snap-center rounded-2xl bg-linear-to-br from-[#0B1F2A] to-[#093C49] p-5 border border-white/5 flex flex-col justify-between h-full transition-all duration-300 hover:border-[#1ed7d8]/40 hover:scale-[1.02]"
                >
                  <div>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#000E17] to-[#143C3E] border border-[#1ed7d8]/60 text-[#1ed7d8] shadow-[0_0_10px_#00A9BD80]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#c4d6df]/85 line-clamp-4">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
            {includedCards.map((item, index) => (
              <span
                key={item.id}
                className={`h-2.5 w-2.5 rounded-full ${
                  index === activeIndex ? "bg-[#23d8dc]" : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
