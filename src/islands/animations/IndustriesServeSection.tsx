"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const items = [
  {
    title: "3D Product Visuals",
    description:
      "High-end 3D renders and animations designed to showcase products with cinematic\n" +
        "lighting, depth, realism, and premium visual presentation.",
    image: "/hero-card/5.webp",
  },
  {
    title: "2D Motion Design",
    description:
      "Modern motion graphics and animated visuals for websites, SaaS products, presentations,\n" +
        "digital campaigns, explainers, and branded storytelling.",
    image: "/hero-card/8.webp",
  },
  {
    title: "Animated Social Media Content",
    description:
      "Short-form animated content built for Instagram, TikTok, Reels, Shorts, YouTube, ads, and\n" +
        "modern social media campaigns focused on engagement and brand growth.",
    image: "/hero-card/6.webp",
  },
];

export default function IndustriesServeSection({
  smallLabel = "ANIMATION SERVICES",
}: {
  smallLabel?: string;
}) {
  return (
    <section className="relative w-full overflow-hidden px-6 pb-24 pt-10 lg:px-16">
      <div className="absolute inset-0 w-full! bg-cover bg-no-repeat pointer-events-none overflow-hidden bg">
        <div className="absolute top-1/12 -left-50 w-150 h-150 bg-foreground/10 rounded-full blur-[120px]" />

        <div className="absolute top-1/24 -right-50 w-150 h-150 bg-foreground/10 rounded-full blur-[120px]" />
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">
            {smallLabel}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            <span className="text-cyan-300">2D &amp; 3D</span> Animation

            <br />

            Built for Modern Digital Content
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/65 md:text-base">
            From cinematic 3D visuals and product animations to motion graphics and animated
            social media content, we create visuals designed to help brands communicate more
            clearly, attract attention faster, and build a stronger digital presence across modern
            platforms.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="relative z-10 md:hidden">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1}
              spaceBetween={14}
              pagination={{ clickable: true }}
              className="w-full pb-8"
            >
              {items.map((item) => (
                <SwiperSlide key={`${item.title}-mobile`} className="!h-auto">
                  <SpotlightCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="relative z-10 grid gap-5 md:grid-cols-3">
            {items.map((item) => (
              <SpotlightCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpotlightCard({
  item,
}: {
  item: { title: string; description: string; image: string };
}) {
  return (
    <article
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      }}
      className="group relative h-full overflow-hidden rounded-3xl border border-cyan-300/25 bg-[#081b2b]/80 p-2 shadow-[0_0_34px_rgba(34,211,238,0.12)] transition-colors duration-300 hover:border-cyan-300/50"
    >
      {/* Mouse spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(34,211,238,0.12), transparent 65%)",
        }}
      />
      <div className="relative h-56 overflow-hidden rounded-2xl">
        <img
          src={item.image}
          alt={item.title}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>
      <div className="p-3 pb-4">
        <h3 className="text-3xl font-bold text-white">{item.title}</h3>
        <p className="mt-2 text-sm leading-7 text-white/65">
          {item.description}
        </p>
      </div>
    </article>
  );
}
