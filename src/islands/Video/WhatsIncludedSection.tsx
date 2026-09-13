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

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl bg-[#0B1F2A] p-10">
            <h3 className="text-3xl font-bold bg-linear-to-r from-[#46B6A0] to-[#00A9BD] bg-clip-text text-transparent">
              Hook & Attention Optimization
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#c4d6df]">
              The first seconds matter the most. We improve hooks, pacing, cuts,
              structure, and visual timing to make content feel more immediate,
              engaging, and harder to scroll past.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#c4d6df]/80">
              Modern editing is more than cutting clips together. The pacing,
              hook, captions, motion, sound, visual rhythm, and structure all
              shape how professional, engaging, and memorable the content feels
              online. The difference between content people skip and content
              people stay for usually comes down to these details.
            </p>

            <div className="relative mt-4 h-[360px] overflow-hidden rounded-xl shadow-[0_0_15px_#00A9BDB2]">
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
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto lg:grid lg:overflow-visible lg:snap-none lg:gap-5 lg:grid-cols-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {includedCards.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.id}
                  className="w-full min-w-full snap-center rounded-2xl bg-linear-to-br from-[#0B1F2A] to-[#093C49] p-5 lg:min-w-0"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center bg-linear-to-br from-[#000E17] shadow-[0_0_10px_#00A9BD80] to-[#143C3E] justify-center rounded-xl border border-[#1ed7d8]/60 text-[#1ed7d8]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#c4d6df]">
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
