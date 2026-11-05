"use client";

import { Lightbulb, PenTool, Rocket, type LucideIcon } from "lucide-react";

const steps: {
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Concept & Creative Direction",
    description:
      "We start by understanding your brand, audience, goals, and message to define the visual \n" +
        "style, animation direction, mood, storytelling approach, and overall creative vision behind\n" +
        "the project.",
    image: "/hero-card/11.webp",
    icon: Lightbulb,
  },
  {
    title: "Visual Development & Refinement",
    description:
      "Storyboards, motion previews, scene concepts, and visual explorations are developed\n" +
        "early to refine pacing, composition, transitions, and overall creative execution before full\n" +
        "production begins.",
    image: "/hero-card/10.webp",
    icon: PenTool,
  },
  {
    title: "Animation Production & Delivery",
    description:
      "From animation and motion design to rendering, sound integration, compositing, and final\n" +
        "exports, every stage is optimized to deliver polished visuals built for websites, ads, social\n" +
        "media, SaaS products, and modern digital campaigns.",
    image: "/hero-card/8.webp",
    icon: Rocket,
  },
];

export default function AnimationProcessSection() {
  return (
    <section className="relative w-full overflow-hidden px-6 pb-24 pt-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs text-white/60">OUR APPROACH</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            How We Bring
            <br />
            <span className="text-cyan-300">2D &amp; 3D Ideas</span>  to Life
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/65 md:text-base">
            Every animation project follows a carefully structured creative workflow focused on strong
            storytelling, polished visuals, and smooth collaboration. From early concepts to final
            renders, each stage is designed to keep production organized, visually aligned, and built for
            modern digital platforms.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="group rounded-3xl border border-white/10 bg-linear-to-br from-[#0b1f2a]/80 to-[#020915]/80 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-300 hover:border-[#00A9BD]/50"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1ed7d8]/60 bg-linear-to-br from-[#000E17] to-[#143C3E] text-[#1ed7d8] shadow-[0_0_10px_#00A9BD80]">
                <step.icon className="h-5 w-5" />
              </div>

              <h3 className="text-3xl font-bold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {step.description}
              </p>

              <div className="relative mt-5 h-42 overflow-hidden rounded-2xl border border-cyan-300/20">
                <img
                  src={step.image}
                  alt={step.title}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041320]/60 to-transparent" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
