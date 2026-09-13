

import { PlayableMediaFrame } from "./PlayableMediaFrame";
import { HeroBasic } from "../Shared/HeroBasic.tsx";

// یادت نره این دو تا رو اون بالا ایمپورت کنی (اگر ایمپورت نشدن):
import PrimaryButton from "@/components/Shared/PrimaryButton";
import SecondaryButton from "@/components/Shared/SecondaryButton";



export const AnimationsHero = () => {
  return (
    <>
      <HeroBasic
        BeforeHighlight="Premium"
        Highlight="2D & 3D Animations"
        AfterHighlight="Built for Modern Brands"
        Description="High-impact animation and motion design for SaaS companies, AI products, startups, ads,
launch campaigns, and modern brands that want stronger visual identity, clearer
storytelling, and a more memorable online presence."
        imageUrl="/animation-section/Edited.webp"
        imageWidth={529}
        imageHeight={696}
        animationType="slide"
        SmallLabel="2D ANIMATION · 3D ANIMATION · MOTION DESIGN · VISUAL STORYTELLING"
        enableImageHover={true}
        usePrimarySecondaryButtons={true}
        primaryBtnClassName="text-white"
        primaryBtnText="View Our Work"

        secondaryBtnText="Get Pricing"
        primaryBtnUrl="/portfolio"
        imageWrapperClassName="w-[calc(100vw - 300px)] md:w-110"
        secondaryBtnUrl="/pricing"
      />
    </>
  );
};

export const MediaFrameHero = () => {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-10 lg:px-16 py-16 md:py-24 text-white overflow-hidden">
      <p className="mb-8 text-center text-xs tracking-[0.2em] text-[#c2d3dc]">
        WHY ANIMATION MATTERS
      </p>
      <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-14 lg:gap-20">
        
        {/* ========================================== */}
        {/* بخش مدیا: در موبایل بالا (order-1)، دسکتاپ سمت چپ (order-1) */}
        {/* ========================================== */}
        <div className="order-1 flex w-full justify-center lg:w-1/2">
          <div className="w-full max-w-lg md:max-w-2xl lg:max-w-full transform-gpu transition-transform duration-500 hover:scale-[1.02]">
            <PlayableMediaFrame
              imgUrl="/animation-section/Animated_boy.webp"
              alt="2D animation portal scene"
              playable
              vidLink={null}
            />
          </div>
        </div>

        {/* ========================================== */}
        {/* بخش متنی: در موبایل پایین (order-2)، دسکتاپ سمت راست (order-2) */}
        {/* ========================================== */}
        <div className="order-2 flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold leading-[1.15] tracking-tight">
            Animation Helps Brands {" "}
            <span className="bg-linear-to-r from-[#22d3ee] to-[#22B0B0] bg-clip-text text-transparent">
              Look More Premium, Modern, and Memorable
            </span>{" "}
            <br className="hidden lg:block" />

          </h2>

          <div className="mt-6 flex flex-col gap-4 max-w-xl text-[14px] sm:text-base md:text-lg leading-[1.7] text-white/60 font-light">
            <p>
              Strong animation does more than make content look visually impressive. It helps brands
              communicate ideas faster, simplify complex products, create stronger first impressions,
              and build a more recognizable digital presence.
              From product launches and ads to social media content, UI visuals, brand campaigns, and
              storytelling, animation helps businesses stand out in crowded digital environments and
              makes the overall brand experience feel more polished and intentional.

            </p>
            <p>
              2D animation brings clarity, style, and visual communication.
              3D animation adds depth, motion, realism, and cinematic presence.
              Together, they help brands create content that feels more engaging, professional, and
              difficult to ignore online.
            </p>
          </div>

          {/* ========================================== */}
          {/* دکمه‌ها */}
          {/* ========================================== */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4 lg:gap-5">
            <div className="w-full sm:w-[15rem] lg:w-auto">
              <PrimaryButton text="View Our Work" width="100%" href="/portfolio" />
            </div>
            <div className="w-full sm:w-[15rem] lg:w-auto">
              <SecondaryButton text="Get Pricing" width="100%" href="/pricing" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
