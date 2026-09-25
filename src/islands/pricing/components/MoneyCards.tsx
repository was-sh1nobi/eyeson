
import { useState } from "react";
import { Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

interface Plan {
  name: string;
  subtitle: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    subtitle: "Most popular for growing businesses",
    price: "$997",
    features: [
      "5 videos per month",
      "Weekly delivery",
      "Hook-based scripting",
      "Motion overlays",
      "Platform optimization",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    subtitle: "Most popular for growing businesses",
    price: "$1,797",
    features: [
      "10 videos per month",
      "Everything in Starter",
      "Trend-driven ideas",
      "Advanced motion graphics",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    subtitle: "Most popular for growing businesses",
    price: "$2,497",
    features: [
      "15 videos per month",
      "Everything in Growth",
      "Dedicated creative director",
      "Custom animations",
      "Monthly strategy calls",
    ],
    highlighted: false,
  },
];

export const MoneyCards = () => {
  const popularIndex = plans.findIndex((p) => p.highlighted);
  const orderedPlans =
    popularIndex === -1
      ? plans
      : [plans[(popularIndex + 1) % 3], plans[popularIndex], plans[(popularIndex + 2) % 3]];

  const [, setActiveIndex] = useState(0);

  // No need to force active index on mount; Swiper will initialize to the first slide.


  return (
    <section className="relative z-10 w-full px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* دسکتاپ: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {orderedPlans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* موبایل: Swiper */}
        <div className="md:hidden ">
          <Swiper
            modules={[Pagination, A11y]}
            slidesPerView={1}
            spaceBetween={16}
            centeredSlides
            centeredSlidesBounds
            initialSlide={0}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="money-swiper h-auto pb-10 mt-8 overflow-visible"
            pagination={{
              dynamicBullets: true,
              dynamicMainBullets: 2,
              clickable: true,

            }}

          >
            {orderedPlans.map((plan) => (
              <SwiperSlide key={plan.name} className="flex justify-center items-center" >
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
      className={`relative rounded-2xl sm:rounded-3xl border p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${
        plan.highlighted
          ? "border-[#44B39F] bg-linear-to-b from-[#09232E] via-[#083440] to-[#073E4A] scale-[1.02]"
          : "border-[#1A4648] bg-[#0B1F2A]"
      } ${mobile ? "w-[95%] mx-auto" : ""}`}
    >
      {/* بج Most Popular */}
      {plan.highlighted ? (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-[#00A9BD] to-[#21675A] px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wide text-white shadow-lg">
          MOST POPULAR
        </span>
      ) : null}

      {/* نام پلن */}
      <h3 className="text-[28px] sm:text-[34px] font-bold leading-none text-white">{plan.name}</h3>
      
      {/* زیرعنوان */}
      <p className="mt-2 text-xs sm:text-sm text-white/60 font-medium">{plan.subtitle}</p>

      {/* خط جداکننده */}
      <div className="my-4 sm:my-5 border-t border-dashed border-white/15" />

      {/* قیمت */}
      <div className="flex items-end gap-2 mb-6 sm:mb-8">
        <span className="text-[36px] sm:text-[42px] font-bold leading-none text-[#39C2B6]">
          {plan.price}
        </span>
        <span className="pb-1 text-sm sm:text-xl text-white/55 font-medium">Starting at</span>
      </div>

      {/* ویژگی‌ها */}
      <ul className="space-y-2.5 sm:space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-lg sm:text-xl text-white leading-tight">
            <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-[#1CB8B5] text-sm sm:text-base text-[#1CB8B5] font-bold">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* دکمه */}
      <button
        type="button"
        className={`w-full cursor-pointer rounded-xl sm:rounded-[20px] border py-3 sm:py-2.5 text-base sm:text-lg font-bold text-white transition-[transform,border-color,box-shadow] duration-300 hover:scale-[1.02] ${
          plan.highlighted
            ? "border-none bg-linear-to-r from-[#46B6A0] to-[#056E7C] shadow-[0_0_25px_rgba(70,182,160,0.4)] hover:shadow-[0_0_35px_rgba(70,182,160,0.6)]"
            : "border-2 border-[#07505E] bg-linear-to-r from-[#0B1F2A] to-[#093B48] hover:border-[#1CB8B5]"
        }`}
      >
        Get Started
      </button>
    </article>
  );
}