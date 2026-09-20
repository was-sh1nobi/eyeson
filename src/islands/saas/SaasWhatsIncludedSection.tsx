"use client";

import { useRef, useState } from "react";
import { ClosedCaption, Palette, AudioWaveformIcon } from "lucide-react";
import { Scissors, MousePointerClick, Flag } from "lucide-react";
import { SmartImage } from "../../utils/SmartImage.tsx";

const includedCards = [
  {
    id: 1,
    title: "The Right Hook",
    description:
      "We open with the problem, outcome, insight, or product moment most likely to make your target audience pay attention.",
    icon: ClosedCaption,
  },
  {
    id: 2,
    title: "Clear Positioning",
    description:
      "The viewer should understand what your product is, who it is for, and why it is different without needing to decode complicated messaging.",
    icon: Palette,
  },
  {
    id: 3,
    title: "Product in Action",
    description:
      "Instead of relying only on abstract graphics, we show the real interface, workflows, interactions, and features that make your software valuable.",
    icon: Scissors,
  },
  {
    id: 4,
    title: "Strong Visual Hierarchy",
    description:
      "Typography, UI, motion, graphics, and messaging are carefully structured so viewers always know where to look and what matters.",
    icon: AudioWaveformIcon,
  },
  {
    id: 5,
    title: "Purposeful Motion",
    description:
      "Animation is not added just to make things move. Every transition, zoom, interaction, and visual effect helps explain the product or maintain attention.",
    icon: MousePointerClick,
  },
  {
    id: 6,
    title: "Memorable Ending",
    description:
      "We close with a clear product takeaway and CTA that reinforces the value of the software and gives the viewer a natural next step.",
    icon: Flag,
  },
];

export default function SaasWhatsIncludedSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const frameRef = useRef<number | null>(null);

  return (
    <section className="px-6 pb-24 pt-8 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#c2d3dc]">
            WHAT MAKES A GREAT SAAS VIDEO
          </p>
          <h2 className="text-4xl font-extrabold text-white md:text-5xl">
            Designed Around What
            <br />
            Makes Software Sell
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl bg-[#0B1F2A] p-4">
            <h3 className="text-3xl font-bold bg-linear-to-r from-[#46B6A0] to-[#00A9BD] bg-clip-text text-transparent">
              The Strongest SaaS Videos Balance Product Clarity With Visual Excitement.
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#c4d6df]">
              The strongest SaaS videos balance product clarity with visual excitement. Every part of the production is designed around that goal.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#c4d6df]/80">
              A clear story helps people understand the product. Purposeful motion keeps them watching. Together, they make the value memorable and the next step obvious.
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
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto lg:grid lg:overflow-visible lg:snap-none lg:gap-5 lg:grid-cols-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  <h3 className="text-3xl font-bold text-white">
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
