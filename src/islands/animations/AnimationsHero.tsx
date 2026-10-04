

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
    <section className="relative w-full overflow-hidden py-[var(--space-lg)] sm:py-[var(--space-xl)]">
      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-[var(--space-gutter)] sm:px-[var(--space-gutter-md)] lg:px-[var(--space-gutter-lg)]">
        <div className="flex flex-col lg:flex-row items-center gap-[var(--space-md)] lg:gap-[var(--space-lg)] xl:gap-[var(--space-xl)]">
          {/* Media Section */}
          <div className="w-full lg:w-[55%] flex justify-center lg:justify-start order-1 lg:order-1 mx-auto">
            <div className="relative w-full group">
              <div className="relative z-10 w-full transform-gpu transition-transform duration-[var(--duration-emphasis)] ease-[var(--ease-default)] flex items-center justify-center mx-auto rounded-[var(--radius-xl)] overflow-hidden">
                <PlayableMediaFrame
                  imgUrl="/animation-section/Animated_boy.webp"
                  alt="2D animation portal scene"
                  playable
                  vidLink={null}
                />
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-[42%] flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-2">
            <span className="tracking-[0.25rem] text-[#00E6D7]/90 text-xs sm:text-sm uppercase font-semibold mb-3 block">
              WHY ANIMATION MATTERS
            </span>

            <h2 className="text-h2 mb-4 sm:mb-6">
              <span className="block text-white mb-1">Animation Helps Brands</span>
              <span className="block bg-gradient-to-r from-[var(--primitive-teal-400)] to-[var(--primitive-teal-700)] bg-clip-text text-transparent">
                Look More Premium, Modern, and Memorable
              </span>
            </h2>

            <div className="space-y-4 max-w-[48ch] mx-auto lg:mx-0 mb-8 sm:mb-10 text-lg leading-[1.7] text-white/60 font-light">
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-4">
              <div className="relative group/btn w-full sm:w-auto">
                <div
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--primitive-teal-400)] to-[var(--primitive-teal-700)] opacity-0 blur-lg transition-opacity duration-[var(--duration-slow)] group-hover/btn:opacity-30"
                  aria-hidden="true"
                />
                <div className="relative transform-gpu transition-transform duration-[var(--duration-normal)] ease-[var(--ease-default)] group-hover/btn:scale-[1.02] group-active/btn:scale-[0.98]">
                  <PrimaryButton text="View Our Work" width="14rem" href="/portfolio" />
                </div>
              </div>
              <SecondaryButton text="Get Pricing" width="14rem" href="/pricing" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
