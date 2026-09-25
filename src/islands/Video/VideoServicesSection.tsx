"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { SmartImage } from "../../utils/SmartImage.tsx";

const serviceCards = [
  {
    id: 1,
    title: "Talking Head & Personal Brand Editing",
    description:
      "Professional editing for founders, creators, educators, podcasts, YouTube channels, and personal brands that want cleaner pacing, stronger structure, captions, motion elements, and more engaging content across social media platforms.",
    image: "/animation-section/video.webp",
  },
  {
    id: 2,
    title: "Short-Form Social Media Content",
    description:
      "High retention edits for Reels, Shorts, TikTok, Instagram, YouTube, and X content. Built with stronger hooks, faster pacing, captions, zooms, motion, and visual rhythm designed for modern social feeds.",
    image: "/videoEditing.webp",
  },
  {
    id: 3,
    title: "Podcast & Long-Form Editing",
    description:
      "Smooth long form editing for podcasts, interviews, educational videos, and YouTube content. We improve pacing, remove distractions, clean the structure, and help the content feel easier to watch for longer periods.",
    image: "/animation-section/short-form.webp",
  },
  {
    id: 4,
    title: "Product Explainer Videos",
    description:
      "Clear editing and motion for SaaS products, apps, AI tools, and modern digital brands that need to explain features, workflows, or product value in a simpler and more engaging way.",
    image: "/animation-section/video.webp",
  },
  {
    id: 5,
    title: "Product Demos & Launch Videos",
    description:
      "Polished demo and launch videos designed to showcase products, interfaces, features, updates, and campaigns across websites, landing pages, social media, and product launches.",
    image: "/videoEditing.webp",
  },
  {
    id: 6,
    title: "Promotional & Advertising Content",
    description:
      "Performance focused editing for ads, campaigns, promos, and branded social content designed to help products and brands stand out across modern digital platforms.",
    image: "/animation-section/short-form.webp",
  },
];

export default function VideoServicesSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-20"
    >
      <div className="absolute inset-0 -z-10 " />

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-xs tracking-[0.2em] text-[#c2d3dc]">
            WHAT WE EDIT
          </p>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Editing Services Built for <span className="text-[#17d6d4]">Creators, Brands, and Modern Media</span>
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#c6d8e2] md:text-base">
            Different types of content need different editing styles. A podcast should feel smooth and
            easy to follow. A short-form Reel needs fast pacing and strong hooks. A product explainer
            needs clarity. We shape the editing style around the platform, audience, and purpose of the
            content, so every video feels more natural, engaging, and effective online.
          </p>
        </div>

        <style>{`
          .services-swiper .swiper-wrapper {
            align-items: stretch;
          }
          .services-swiper .swiper-slide {
            height: auto !important;
            display: flex;
          }
          .services-swiper .swiper-pagination-bullet {
            background: rgba(255,255,255,0.2);
            opacity: 1;
          }
          .services-swiper .swiper-pagination-bullet-active {
            background: #23d8dc;
          }
        `}</style>
        <div className="md:hidden">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={14}
            pagination={{ clickable: true }}
            className="services-swiper w-full pb-10"
          >
            {serviceCards.map((card) => (
              <SwiperSlide key={card.id} className="flex">
                <article className="group flex h-full w-full flex-col rounded-3xl border border-[#13a8b8]/60 bg-[linear-gradient(160deg,#071c2e,#0a2433)] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                  <div className="relative h-56 overflow-hidden rounded-2xl">
                    <SmartImage
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081521] via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-3 pb-4">
                    <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[#c0d3df]">
                      {card.description}
                    </p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {serviceCards.map((card) => (
            <article
              key={card.id}
              className="group rounded-3xl border border-[#13a8b8]/60 bg-[linear-gradient(160deg,#071c2e,#0a2433)] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[#23d8dc]"
            >
              <div className="relative h-56 overflow-hidden rounded-2xl">
                <SmartImage
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081521] via-transparent to-transparent" />
              </div>
              <div className="p-3 pb-4">
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#c0d3df]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
