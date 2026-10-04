"use client";

import { useRef, useState } from "react";
import {
  Lightbulb,
  PenLine,
  LayoutPanelTop,
  Scissors,
  Wand2,
  MonitorPlay,
  AudioWaveform,
  Copy,
  PackageCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SmartImage } from "../../utils/SmartImage.tsx";

type IncludedCard = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const includedCards: IncludedCard[] = [
  {
    id: 1,
    title: "Strategy & Concepts",
    description:
      "Content ideas, campaign directions, creative concepts, hooks, references, and visual approaches.",
    icon: Lightbulb,
  },
  {
    id: 2,
    title: "Scriptwriting",
    description:
      "Short-form scripts, product messaging, ad copy, voiceover scripts, and narrative structures.",
    icon: PenLine,
  },
  {
    id: 3,
    title: "Motion Design",
    description:
      "2D motion, interface animation, graphic sequences, visual effects, and branded animation.",
    icon: Wand2,
  },
  {
    id: 4,
    title: "Editing & Finishing",
    description:
      "Professional editing, pacing, transitions, typography, footage integration, and final polish.",
    icon: Scissors,
  },
];

export default function RetainerWhatsIncluded() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const frameRef = useRef<number | null>(null);

  return (
    <section className="px-6 pb-24 pt-8 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#c2d3dc]">
            FROM ONE REQUEST TO AN ENTIRE CONTENT PIPELINE
          </p>
          <h2 className="text-4xl font-extrabold text-white md:text-5xl">
            Everything Your Brand Needs
            <br />
            <span className="text-[#12d4d1]">Under One Roof</span>
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl bg-[#0B1F2A] p-10">
            <h3 className="text-3xl font-bold bg-linear-to-r from-[#46B6A0] to-[#00A9BD] bg-clip-text text-transparent">
              Full Creative Production
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#c4d6df]">
              Your retainer covers every stage of content creation — from initial
              concept and scripting through production, motion design, sound, and
              final delivery.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#c4d6df]/80">
              Instead of coordinating multiple freelancers for different
              specialties, your entire creative pipeline lives under one
              production relationship. We handle editing, motion, UI animation,
              design, storytelling, sound, storyboarding, and creative
              variations — so your team can focus on strategy.
            </p>

            <div className="relative mt-4 h-[360px] overflow-hidden rounded-xl shadow-[0_0_15px_#00A9BDB2]">
              <SmartImage
                src="/retainers/2.webp"
                alt="Creative production pipeline"
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
