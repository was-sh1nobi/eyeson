import React, { useState, useEffect, type FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { SmartImage } from "@/utils/SmartImage.tsx";

// --- Types ---
interface Card {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
}

const cardData: Card[] = [
  {
    id: 1,
    title: "Social Media & Reels",
    subtitle: "Turn simple ideas into content people actually watch.",
    description:
      "Motion graphics make social content feel sharper, faster, and more engaging. From reels\n" +
        "and shorts to stories, posts, and branded content, motion helps your message stand out in\n" +
        "feeds where static visuals are easy to ignore.",
    tags: [
      "Instagram Reels",
      "TikTok",
      "YouTube Shorts",
      "X content",
      "Stories",
    ],
    image: "/motion-graphics/WhyUs/1.webp",
  },
  {
    id: 2,
    title: "Paid Ads & Campaigns",
    subtitle: "Make the first seconds do more work.",
    description:
      "In paid campaigns, attention is expensive. Motion graphics help create stronger hooks,\n" +
        "clearer messages, and more memorable visuals, giving your ads a better chance to stop\n" +
        "the scroll, explain the offer, and drive action.",
    tags: ["Meta ads", "YouTube ads", "LinkedIn campaigns" , "Product promos" , "Launch ads"],
    image: "/motion-graphics/WhyUs/2.webp",
  },
  {
    id: 3,
    title: "SaaS & Product Onboarding",
    subtitle: "Guide users before confusion slows them down.",
    description:
      "Animated UI flows, product screens, and explainer motion help users understand how your\n" +
        "product works faster. Motion reduces friction, highlights key actions, and makes the first\n" +
        "experience feel smoother, clearer, and more premium.",
    tags: ["SaaS platforms", "Web apps", "Dashboards" , "Feature education" , "App onboarding"],
    image: "/motion-graphics/WhyUs/3.webp",
  },
  {
    id: 4,
    title: "Launches & Hero Sections",
    subtitle: "Make your product feel clear, premium, and ready to explore.",
    description:
      "From product launches and feature releases to website hero sections, motion graphics\n" +
        "help turn key benefits into clear visual moments that create curiosity, explain value, and\n" +
        "make your brand feel more modern from the first impression.",
    tags: ["New releases", "Feature announcements", "Product demos" , "Landing pages" , "Hero sections"],
    image: "/motion-graphics/WhyUs/4.webp",
  },
];

// --- Custom Hook ---
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};

// --- Sub-component ---
const CardContent: FC<{ card: Card }> = ({ card }) => (
  <div className="flex h-full flex-col rounded-[2rem] border border-slate-700/50 bg-linear-to-br from-[#0B1F2A] to-[#094350] p-6 sm:p-8 transition-colors duration-300 hover:border-cyan-500/30 group">
    <div className="flex flex-1 flex-col">
      <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
        {card.title}
      </h3>
      <p className="mt-2 text-base font-medium text-[#00A9BD]">
        {card.subtitle}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">
        {card.description}
      </p>

      <div className="mt-auto pt-8">
        <span className="text-[10px] uppercase tracking-wider font-bold text-white">
          Best for:
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full border border-[#46B6A0]  bg-[#0B1F2A] px-4 py-1 text-[11px] text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Image Container - Fixed Height for visual balance */}
    <div className="mt-8 overflow-hidden rounded-2xl bg-slate-900/80 h-48 sm:h-60 flex items-center justify-center shadow-[0_0_20px_#00A9BD66]">
      <SmartImage
        src={card.image}
        alt={card.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  </div>
);

export const MotionGraphicsSection: FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section className="relative w-full py-24 text-white">
      {/* Custom Dot Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .swiper-pagination-bullet {
                    background: #334155 !important;
                    opacity: 1 !important;
                    width: 8px !important;
                    height: 8px !important;
                    transition: all 0.3s ease-in-out !important;
                }
                .swiper-pagination-bullet-active {
                    background: #00E5FF !important;
                    width: 24px !important;
                    border-radius: 4px !important;
                }
                .swiper-horizontal > .swiper-pagination-bullets {
                    bottom: 0px !important;
                }
            `,
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="mx-auto max-w-3xl text-center mb-16 animate-fade-in"
        >
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Where <span className="text-[#00E5FF]">Motion Graphics</span>
            <br /> Create the Most Impact
          </h2>
          <p className="mt-6 text-sm text-slate-400 sm:text-base">
            Motion graphics work best when your content needs to earn attention fast, explain value
            clearly, and make your brand feel more alive across social media, ads, product
            experiences, and websites.
            <br className="hidden sm:block" /> Here's where they create the most
            impact.
          </p>
        </div>

        <div className="relative">
          {isMobile ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1.1}
              centeredSlides={false}
              pagination={{ clickable: true }}
              className="pb-12 !overflow-visible"
              autoHeight={false}
            >
              {cardData.map((card) => (
                <SwiperSlide key={card.id} className="!h-auto flex">
                  <CardContent card={card} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-slide-up"
            >
              {cardData.map((card) => (
                <div
                  key={card.id}
                  className="flex"
                >
                  <CardContent card={card} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
