"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { SmartImage } from "../../utils/SmartImage.tsx";

const serviceCards = [
  {
    id: 1,
    title: "SaaS Product Trailers",
    smallText: "Short. Cinematic. High impact.",
    description:
      "Fast-paced product trailers built to make your software feel exciting and premium. Perfect for landing page heroes, launches, paid campaigns, social media, investor presentations, and product announcements.",
    image: "/animation-section/video.webp",
  },
  {
    id: 2,
    title: "Product Explainer Videos",
    smallText: "Make the value instantly clear.",
    description:
      "Structured explainer videos that communicate the problem, solution, features, workflow, and benefits of your product in a clear and visually engaging way.",
    image: "/videoEditing.webp",
  },
  {
    id: 3,
    title: "Product Demo Videos",
    smallText: "Show the product in action.",
    description:
      "UI-focused videos that walk viewers through real product features and workflows while keeping the experience polished, concise, and easy to follow.",
    image: "/animation-section/short-form.webp",
  },
  {
    id: 4,
    title: "Launch Videos",
    smallText: "Make the release feel bigger.",
    description:
      "High-impact launch content designed for new products, major updates, feature releases, rebrands, and announcements that need attention from day one.",
    image: "/animation-section/video.webp",
  },
  {
    id: 5,
    title: "AI Product Videos",
    smallText: "Explain innovation without complexity.",
    description:
      "Product videos designed specifically for AI software, agents, automation platforms, copilots, generative products, and technical tools that need simple and compelling visual communication.",
    image: "/videoEditing.webp",
  },
  {
    id: 6,
    title: "UI Motion Showcases",
    smallText: "Turn interfaces into experiences.",
    description:
      "Beautifully animated interfaces focused on interactions, workflows, features, transitions, dashboards, and product moments that make your software feel smooth and intuitive.",
    image: "/animation-section/short-form.webp",
  },
];

export default function SaasServicesVideoStyle() {
  return (
    <section
      id="services"
      className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-20"
    >
      <div className="absolute inset-0 -z-10 " />

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-xs tracking-[0.2em] text-[#c2d3dc]">
            PRODUCT VIDEOS DESIGNED AROUND YOUR SOFTWARE, AUDIENCE, AND GROWTH STAGE
          </p>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            SaaS Videos Built<br />
            <span className="text-[#17d6d4]">for Every Product Story</span>
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#c6d8e2] md:text-base">
            Different products need different types of video. We create everything from fast cinematic
            trailers to detailed product explainers, demos, launch films, and UI-driven experiences.
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
                    <p className="mt-2 text-sm font-medium text-[#35e4d8]">{card.smallText}</p>
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
                <p className="mt-2 text-sm font-medium text-[#35e4d8]">{card.smallText}</p>
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
