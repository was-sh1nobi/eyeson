"use client";

import PrimaryButton from "@/components/Shared/PrimaryButton";
import SecondaryButton from "@/components/Shared/SecondaryButton";

// آدرس عکس‌های سمت راست رو اینجا وارد کن
const images = [
  { id: 1, src: "/uiux/screen.webp", alt: "Fluidity UI" },
  { id: 2, src: "/uiux/screen1.webp", alt: "Exploration UI" },
  { id: 3, src: "/uiux/screen2.webp", alt: "Third UI" },
];

export default function UiUxHeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20 lg:py-32">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 sm:gap-16 px-4 sm:px-6 lg:flex-row lg:px-8">
        
        {/* ========================================== */}
        {/* ستون راست (تصاویر): در موبایل می‌آید بالا (order-1) */}
        {/* ========================================== */}
        <div className="order-1 lg:order-2 relative w-full sm:w-[85%] md:w-[75%] lg:w-7/13 flex lg:left-10 xl:left-30 justify-center mt-6 lg:mt-0">
          <img src="/uiux/RightElement/22.webp" alt="" loading="eager" fetchpriority="high" className="scale-[1.2]"/>
        </div>

        {/* ========================================== */}
        {/* ستون چپ (متن‌ها): در موبایل می‌آید پایین (order-2) */}
        {/* ========================================== */}
        <div className="order-2 lg:order-1 flex w-full flex-col items-center text-center lg:items-start lg:text-left lg:w-5/12 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] tracking-tight text-white lg:text-[54px] xl:text-[60px]">
            <span className="text-[#32c9b4]">UI/UX Design</span> for SaaS & Digital Products
            <br className="hidden sm:block lg:hidden xl:block" />

          </h1>

          <p className="mt-4 sm:mt-6 max-w-lg text-[14px] leading-relaxed text-gray-300 sm:text-[16px] lg:text-[18px] font-light">
            Designing websites, landing pages, and product interfaces that users understand and
            teams can scale.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-5">
            <div className="w-full sm:w-auto">
              <PrimaryButton text="Request UI/UX Proposal" width="100%" />
            </div>
            <div className="w-full sm:w-auto">
              <SecondaryButton text="See our work" width="100%" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
