import { useState } from "react";
import { Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

interface FeatureRow {
  title: string;
  subtitle: string;
  count: string;
  unit: string;
  subUnit?: string;
}

interface Plan {
  id: string;
  badge: string;
  popularBadge?: string;
  name: string;
  subtitle: string;
  price: string;
  period: string;
  highlighted: boolean;
  reels: FeatureRow;
  stories: FeatureRow;
  carousels: FeatureRow;
  platforms: {
    title: string;
    subtitle: string;
  };
  included: string[];
}

const plans: Plan[] = [
  {
    id: "starter",
    badge: "STARTER",
    name: "Starter",
    subtitle: "Perfect for brands building their presence.",
    price: "$1,450",
    period: "/ month",
    highlighted: false,
    reels: {
      title: "Motion Graphic Reels",
      subtitle: "Short, engaging videos for social media",
      count: "8",
      unit: "per month",
    },
    stories: {
      title: "Stories",
      subtitle: "Animated or edited stories",
      count: "12",
      unit: "per month",
      subUnit: "(or 10 reels)",
    },
    carousels: {
      title: "Carousel Posts",
      subtitle: "Static or animated carousels",
      count: "—",
      unit: "(Optional)",
    },
    platforms: {
      title: "Platforms",
      subtitle: "Instagram & TikTok Ready",
    },
    included: [
      "Consistent visual branding",
      "Social media optimization",
      "Script & creative direction",
      "Optimized export formats",
    ],
  },
  {
    id: "pro",
    badge: "PRO",
    popularBadge: "MOST POPULAR",
    name: "Pro",
    subtitle: "For growing brands ready to scale their content.",
    price: "$3,100",
    period: "/ month",
    highlighted: true,
    reels: {
      title: "Motion Graphic Reels",
      subtitle: "Short, engaging videos for social media",
      count: "12",
      unit: "per month",
    },
    stories: {
      title: "Stories",
      subtitle: "Animated or edited stories",
      count: "20",
      unit: "per month",
    },
    carousels: {
      title: "Carousel Posts",
      subtitle: "Static or animated carousels",
      count: "8",
      unit: "per month",
    },
    platforms: {
      title: "Platforms",
      subtitle: "Multi-Platform Optimization",
    },
    included: [
      "Script & creative consultation",
      "Multi-platform optimization",
      "Consistent visual branding",
      "Dedicated production support",
    ],
  },
  {
    id: "elite",
    badge: "ELITE",
    name: "Elite",
    subtitle: "Complete content production for ambitious brands.",
    price: "$5,400",
    period: "/ month",
    highlighted: false,
    reels: {
      title: "Motion Graphic Reels",
      subtitle: "Short, engaging videos for social media",
      count: "28",
      unit: "per month",
    },
    stories: {
      title: "Stories",
      subtitle: "Animated or edited stories",
      count: "30",
      unit: "per month",
    },
    carousels: {
      title: "Carousel Posts",
      subtitle: "Static or animated carousels",
      count: "12",
      unit: "per month",
    },
    platforms: {
      title: "Platforms",
      subtitle: "All Major Social Platforms",
    },
    included: [
      "Dedicated creative direction",
      "Monthly strategy & review",
      "Multi-platform optimization",
      "Priority turnaround & revisions",
    ],
  },
];

export const MoneyCards = () => {
  const [, setActiveIndex] = useState(1);

  return (
    <section className="relative z-10 w-full px-4 py-16 sm:px-6 lg:px-8">
      <style>{`
        .money-swiper .swiper-pagination-bullet {
          background: #00E5FF;
          opacity: 0.35;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .money-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 9999px;
          background: #00E5FF;
          box-shadow: 0 0 12px rgba(0, 229, 255, 0.6);
        }
      `}</style>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00E5FF] mb-3">
          Pricing Plans
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Monthly Content Packages
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#8fa0a8] max-w-2xl mx-auto leading-relaxed">
          Consistent, high-quality content designed to keep your brand looking its best.
        </p>
      </div>

      <div className="mx-auto w-full max-w-7xl">
        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Mobile & Tablet: Swiper */}
        <div className="lg:hidden">
          <Swiper
            modules={[Pagination, A11y]}
            slidesPerView={1}
            spaceBetween={16}
            centeredSlides
            initialSlide={1}
            breakpoints={{
              640: {
                slidesPerView: 1.35,
                spaceBetween: 20,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
                centeredSlides: false,
              },
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="money-swiper pb-12 overflow-visible"
            pagination={{
              clickable: true,
            }}
          >
            {plans.map((plan) => (
              <SwiperSlide key={plan.id} className="flex justify-center items-stretch h-auto">
                <PlanCard plan={plan} mobile />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

function PlanCard({ plan, mobile = false }: { plan: Plan; mobile?: boolean }) {
  return (
    <article
      className={`relative flex flex-col justify-between rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 backdrop-blur-md transition-all duration-300 w-full ${
        plan.highlighted
          ? "border-2 border-[#00E5FF] bg-gradient-to-b from-[#09222a] via-[#05171e] to-[#030d10] shadow-[0_0_50px_rgba(0,229,255,0.25)] md:-translate-y-2 z-10"
          : "border border-[#00E5FF]/25 bg-gradient-to-b from-[#071d24]/90 via-[#041217]/90 to-[#020b0e]/95 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-[#00E5FF]/50 hover:shadow-[0_0_35px_rgba(0,229,255,0.18)]"
      } ${mobile ? "w-[94%] max-w-[390px] mx-auto" : ""}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-full border border-[#00E5FF]/35 bg-[#00E5FF]/10 px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase text-[#00E5FF]">
                {plan.badge}
              </span>
              {plan.popularBadge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] px-3 py-1 text-[10px] font-black tracking-wider uppercase text-[#03151c] shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <span>★</span>
                  <span>{plan.popularBadge}</span>
                </span>
              )}
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              {plan.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa0a8] mt-1.5 leading-relaxed max-w-[220px]">
              {plan.subtitle}
            </p>
          </div>

          {/* Price Box */}
          <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#05181f]/90 px-4 py-3 sm:px-5 sm:py-3.5 text-center min-w-[115px] sm:min-w-[125px] shrink-0 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="text-2xl sm:text-3xl font-black text-[#00E5FF] tracking-tight leading-none">
              {plan.price}
            </div>
            <div className="text-xs text-[#7c959f] font-medium mt-1">
              {plan.period}
            </div>
          </div>
        </div>

        {/* Feature Rows */}
        <div className="space-y-3.5 my-6">
          {/* Row 1: Motion Graphic Reels */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-[#00E5FF]/30 bg-[#07242c]/80 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <svg className="w-5 h-5 fill-[#00E5FF] text-[#00E5FF] ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-bold text-white leading-tight truncate">
                  {plan.reels.title}
                </div>
                <div className="text-xs text-[#7c959f] mt-0.5 truncate">
                  {plan.reels.subtitle}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl sm:text-2xl font-black text-[#00E5FF] leading-none">
                {plan.reels.count}
              </div>
              <div className="text-[10px] sm:text-xs text-[#7c959f] mt-0.5">
                {plan.reels.unit}
              </div>
            </div>
          </div>

          {/* Row 2: Stories */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-[#00E5FF]/30 bg-[#07242c]/80 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <svg
                  className="w-5 h-5 text-[#00E5FF]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <path d="M12 18h.01" strokeWidth="2.5" />
                  <circle cx="15.5" cy="8.5" r="3" fill="#07242c" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M15.5 7v3M14 8.5h3" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-bold text-white leading-tight truncate">
                  {plan.stories.title}
                </div>
                <div className="text-xs text-[#7c959f] mt-0.5 truncate">
                  {plan.stories.subtitle}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl sm:text-2xl font-black text-[#00E5FF] leading-none">
                {plan.stories.count}
              </div>
              <div className="text-[10px] sm:text-xs text-[#7c959f] mt-0.5">
                {plan.stories.unit}
              </div>
              {plan.stories.subUnit && (
                <div className="text-[9px] text-[#5e7782] leading-tight">
                  {plan.stories.subUnit}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Carousel Posts */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-[#00E5FF]/30 bg-[#07242c]/80 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <svg
                  className="w-5 h-5 text-[#00E5FF]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="14" height="14" rx="2" />
                  <path d="M7 3h12a2 2 0 0 1 2 2v12" />
                  <circle cx="8" cy="10" r="1.5" fill="currentColor" />
                  <path d="m5 17 4-4 3 3 2-2 3 3" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-bold text-white leading-tight truncate">
                  {plan.carousels.title}
                </div>
                <div className="text-xs text-[#7c959f] mt-0.5 truncate">
                  {plan.carousels.subtitle}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div
                className={`text-xl sm:text-2xl font-black leading-none ${
                  plan.carousels.count === "—" ? "text-[#7c959f]" : "text-[#00E5FF]"
                }`}
              >
                {plan.carousels.count}
              </div>
              <div className="text-[10px] sm:text-xs text-[#7c959f] mt-0.5">
                {plan.carousels.unit}
              </div>
            </div>
          </div>

          {/* Row 4: Platforms */}
          <div className="flex items-center gap-3">
            <div className="h-11 sm:h-12 px-2.5 rounded-xl sm:rounded-2xl border border-[#00E5FF]/30 bg-[#07242c]/80 flex items-center gap-2 shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.1)] text-[#00E5FF]">
              {/* Instagram */}
              <svg
                className="w-4 h-4 text-[#00E5FF]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="#00E5FF" />
              </svg>
              {/* TikTok */}
              <svg
                className="w-4 h-4 text-[#00E5FF]"
                viewBox="0 0 24 24"
                fill="#00E5FF"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
              </svg>
              {/* YouTube */}
              <svg
                className="w-4 h-4 text-[#00E5FF]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="4" />
                <polygon points="10 8 16 12 10 16" fill="#00E5FF" stroke="none" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-bold text-white leading-tight">
                {plan.platforms.title}
              </div>
              <div className="text-xs text-[#7c959f] mt-0.5 truncate">
                {plan.platforms.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Included Box */}
        <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#061e27]/60 p-4 mb-6">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-6 h-6 rounded-md bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Included
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
            {plan.included.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5 text-[#00E5FF] shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs text-[#c0d4dc] font-medium leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button */}
      <a
        href="/contact"
        className={`w-full py-3.5 sm:py-4 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 mt-auto ${
          plan.highlighted
            ? "bg-gradient-to-r from-[#00E5FF] via-[#00DFD8] to-[#00B4D8] text-[#03151c] shadow-[0_0_30px_rgba(0,229,255,0.45)] hover:shadow-[0_0_45px_rgba(0,229,255,0.7)] hover:scale-[1.02] active:scale-[0.99]"
            : "bg-gradient-to-r from-[#00E5FF] via-[#00DFD8] to-[#00B4D8] text-[#03151c] shadow-[0_0_25px_rgba(0,229,255,0.35)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] hover:scale-[1.02] active:scale-[0.99]"
        }`}
      >
        <span>Get Started</span>
        <svg
          className="w-4 h-4 stroke-[2.5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </article>
  );
}
