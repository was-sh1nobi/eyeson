import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

type VolumePricing = {
  threshold: string;
  discount: string;
};

type Pack = {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  includes: string[];
  bestFor: string;
  volumePricing: VolumePricing[] | string;
  cta: string;
  featured?: boolean;
  highlight?: string;
};

const packs: Pack[] = [
  {
    id: 1,
    name: "Explainer & Feature Demos",
    subtitle: "Clear visual storytelling for core features",
    price: "Starting from $3,500",
    includes: [
      "Product UI animation",
      "Scriptwriting & storyboard",
      "Professional voiceover",
      "Sound design & pacing",
      "Platform-ready exports",
      "Brand-aligned visuals",
    ],
    bestFor: "Core product explainers · Feature walk-throughs · Onboarding videos",
    volumePricing: [
      { threshold: "3+ videos", discount: "15% OFF" },
      { threshold: "5+ videos", discount: "25% OFF" },
    ],
    cta: "Book a Call",
  },
  {
    id: 2,
    name: "Launch Campaigns",
    subtitle: "High-impact creative for product launches",
    price: "Starting from $6,000",
    includes: [
      "Launch trailer / Promo video",
      "Social media cutdowns",
      "Ad creative variations",
      "Landing page assets",
      "Advanced motion graphics",
      "Music & sound effects",
    ],
    bestFor: "Major feature releases · New product launches · Marketing campaigns",
    volumePricing: [
      { threshold: "Multiple campaigns", discount: "Custom pricing" },
    ],
    cta: "Book a Call",
    featured: true,
    highlight: "Most Popular",
  },
  {
    id: 3,
    name: "Ongoing Creative Pipeline",
    subtitle: "For continuous product and marketing support",
    price: "Starting from $4,500/mo",
    includes: [
      "Dedicated creative partner",
      "Monthly asset deliverables",
      "Iterative ad creatives",
      "Consistent brand voice",
      "Fast turnaround times",
      "Flexible priorities",
    ],
    bestFor: "Growing SaaS teams · Performance marketing · Continuous feature releases",
    volumePricing: "Custom retainer sizes available",
    cta: "Book a Call",
  },
];

// Design copied from /pricing MoneyCards (PlanCard) — same visual
// language, fed with the SaaS packages' own content.

const nameSpans: Record<number, { pre?: string; accent: string; post?: string }> = {
  1: { pre: "Explainer & ", accent: "Feature Demos" },
  2: { accent: "Launch", post: " Campaigns" },
  3: { pre: "Ongoing Creative ", accent: "Pipeline" },
};

// "Starting from $3,500" → { label: "Starting from", price: "$3,500" }
function splitPrice(price: string) {
  const m = price.match(/^Starting\s+from\s+(.+)$/i);
  return m ? { label: "Starting from", price: m[1] } : { label: "", price };
}

export default function SaasPackagesSection() {
  const [, setActiveIndex] = useState(1);

  return (
    <section className="overflow-x-hidden px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-24">
      <style>{`
        .saas-money-swiper .swiper-pagination-bullet {
          background: #00E5FF;
          opacity: 0.35;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .saas-money-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 9999px;
          background: #00E5FF;
          box-shadow: 0 0 12px rgba(0, 229, 255, 0.6);
        }
      `}</style>

      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#c2d3dc]">
            FLEXIBLE PRICING
          </p>
          <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            SaaS Creative Packages Built Around Your Product Needs
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#c3d4de] md:text-base">
            Different growth stages require different creative investments. From one-off feature explainers to ongoing performance marketing assets, our pricing is designed to scale with your product roadmap and marketing goals.
          </p>
          <p className="mt-3 text-sm leading-7 text-[#c3d4de] md:text-base">
            We offer project-based pricing for specific launches, or monthly retainer models for teams that need a steady pipeline of fresh creative assets.
          </p>
        </div>

        {/* Desktop: Grid (MoneyCards design) */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {packs.map((pack) => (
            <PlanCard key={pack.id} pack={pack} />
          ))}
        </div>

        {/* Mobile & Tablet: Swiper (MoneyCards design) */}
        <div className="mt-12 lg:hidden">
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
            className="saas-money-swiper pb-12 overflow-visible"
            pagination={{
              clickable: true,
            }}
          >
            {packs.map((pack) => (
              <SwiperSlide key={`mobile-${pack.id}`} className="flex justify-center items-stretch h-auto">
                <PlanCard pack={pack} mobile />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-sm leading-7 text-[#c3d4de] md:text-base">
            Need ongoing creative support or high-volume ad production? We act as a seamless extension of your SaaS marketing team, handling everything from product updates to performance creative.
          </p>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ pack, mobile = false }: { pack: Pack; mobile?: boolean }) {
  const { label, price } = splitPrice(pack.price);
  const span = nameSpans[pack.id] ?? {};

  return (
    <article
      className={`relative flex h-full flex-col rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 backdrop-blur-md transition-all duration-300 w-full ${
        pack.featured
          ? `border-2 border-[#00E5FF] bg-gradient-to-b from-[#09222a] via-[#05171e] to-[#030d10] shadow-[0_0_50px_rgba(0,229,255,0.25)] ${mobile ? "" : "lg:-translate-y-2 z-10"}`
          : "border border-[#00E5FF]/25 bg-gradient-to-b from-[#071d24]/90 via-[#041217]/90 to-[#020b0e]/95 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-[#00E5FF]/50 hover:shadow-[0_0_35px_rgba(0,229,255,0.18)]"
      } ${mobile ? "max-w-[420px] mx-auto" : ""}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap min-h-[26px]">
              {pack.featured && pack.highlight ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] px-3 py-1 text-[10px] font-black tracking-wider uppercase text-[#03151c] shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <span>★</span>
                  <span>{pack.highlight}</span>
                </span>
              ) : null}
            </div>
            <h3 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight mt-3 leading-tight">
              {span.pre}
              {span.accent && <span className="text-[#00E5FF]">{span.accent}</span>}
              {span.post}
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa0a8] mt-1.5 leading-relaxed">
              {pack.subtitle}
            </p>
          </div>

          {/* Price Box */}
          <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#05181f]/90 px-4 py-3 sm:px-5 sm:py-3.5 text-center min-w-[115px] sm:min-w-[135px] shrink-0 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {label ? (
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#7c959f] tracking-wide mb-1">
                {label}
              </div>
            ) : null}
            <div className="text-lg sm:text-2xl font-black text-[#00E5FF] tracking-tight leading-none">
              {price}
            </div>
          </div>
        </div>

        {/* Best For row (MoneyCards "platforms" row style) */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-[#00E5FF]/30 bg-[#07242c]/80 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.1)] text-[#00E5FF]">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="12" cy="12" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-bold text-white leading-tight">
                Best For
              </div>
              <div className="text-xs text-[#7c959f] mt-0.5 leading-relaxed">
                {pack.bestFor}
              </div>
            </div>
          </div>

          {/* Volume Pricing */}
          <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#061e27]/60 p-4">
            <div className="flex items-center gap-2.5 mb-2">
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
                  <polyline points="3 17 9 11 13 15 21 7" />
                  <polyline points="15 7 21 7 21 13" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Volume Pricing
              </span>
            </div>
            {Array.isArray(pack.volumePricing) ? (
              <div className="space-y-1.5">
                {pack.volumePricing.map((vp) => (
                  <div
                    key={vp.threshold}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-[#8fa0a8]">{vp.threshold}</span>
                    <span className="text-base font-black text-[#00E5FF] leading-none">
                      {vp.discount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8fa0a8]">{pack.volumePricing}</p>
            )}
          </div>

          {/* Included Box */}
          <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#061e27]/60 p-4">
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
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Included
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-3 gap-y-2">
              {pack.includes.map((item, idx) => (
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
      </div>

      {/* Button */}
      <a
        href="/contact"
        className="w-full py-3.5 sm:py-4 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 mt-auto bg-gradient-to-r from-[#00E5FF] via-[#00DFD8] to-[#00B4D8] text-[#03151c] shadow-[0_0_25px_rgba(0,229,255,0.35)] hover:shadow-[0_0_45px_rgba(0,229,255,0.7)] hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
      >
        <span>{pack.cta}</span>
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
