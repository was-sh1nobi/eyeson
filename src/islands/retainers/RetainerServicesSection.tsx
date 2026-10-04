"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Clapperboard,
  Package,
  Megaphone,
  Palette,
  Rocket,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ServiceCard = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const serviceCards: ServiceCard[] = [
  {
    id: 1,
    title: "Short-Form Videos",
    description:
      "Reels, TikToks, Shorts, LinkedIn videos, X content, and social-first edits.",
    icon: Clapperboard,
  },
  {
    id: 2,
    title: "Product Videos",
    description:
      "Feature showcases, UI animations, mini demos, updates, and product-focused content.",
    icon: Package,
  },
  {
    id: 3,
    title: "Ad Creatives",
    description:
      "New concepts, hooks, variations, cutdowns, and campaign assets designed for testing.",
    icon: Megaphone,
  },
  {
    id: 4,
    title: "Brand Content",
    description:
      "Visual storytelling that strengthens your positioning, identity, and perception.",
    icon: Palette,
  },
  {
    id: 5,
    title: "Launch Content",
    description:
      "Creative assets for product launches, new features, announcements, partnerships, and campaigns.",
    icon: Rocket,
  },
  {
    id: 6,
    title: "Motion Graphics",
    description:
      "Custom animations, typography, visual explainers, branded sequences, and graphic systems.",
    icon: Wand2,
  },
];

export default function RetainerServicesSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-xs tracking-[0.2em] text-[#c2d3dc]">
            ONE RETAINER, DIFFERENT TYPES OF CONTENT
          </p>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Your Content Needs Change.{" "}
            <span className="text-[#17d6d4]">Your Retainer Adapts.</span>
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#c6d8e2] md:text-base">
            Depending on your plan and priorities, your monthly production can
            include any combination of these content types. One month you may
            need six social videos. The next, a product video, three ads, and
            several supporting creatives.
          </p>
        </div>

        <style>{`
          .retainer-services-swiper .swiper-wrapper {
            align-items: stretch;
          }
          .retainer-services-swiper .swiper-slide {
            height: auto !important;
            display: flex;
          }
          .retainer-services-swiper .swiper-pagination-bullet {
            background: rgba(255,255,255,0.2);
            opacity: 1;
          }
          .retainer-services-swiper .swiper-pagination-bullet-active {
            background: #23d8dc;
          }
        `}</style>
        <div className="md:hidden">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={14}
            pagination={{ clickable: true }}
            className="retainer-services-swiper w-full pb-10"
          >
            {serviceCards.map((card) => {
              const Icon = card.icon;
              return (
                <SwiperSlide key={card.id} className="flex">
                  <article className="group flex h-full w-full flex-col rounded-3xl border border-[#13a8b8]/60 bg-[linear-gradient(160deg,#071c2e,#0a2433)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#1ed7d8]/40 bg-[#1ed7d8]/10 text-[#35e4d8]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[#c0d3df]">
                      {card.description}
                    </p>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.id}
                className="group rounded-3xl border border-[#13a8b8]/60 bg-[linear-gradient(160deg,#071c2e,#0a2433)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[#23d8dc]"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#1ed7d8]/40 bg-[#1ed7d8]/10 text-[#35e4d8] transition-colors duration-300 group-hover:border-[#1ed7d8] group-hover:bg-[#1ed7d8] group-hover:text-black">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#c0d3df]">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
