import { SmartImage } from "../../utils/SmartImage.tsx";
import PrimaryButton from "@/components/Shared/PrimaryButton.tsx";

export default function VideoEditingSection() {
  return (
    <section className="relative w-full overflow-hidden py-[var(--space-lg)] sm:py-[var(--space-xl)]">
      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-[var(--space-gutter)] sm:px-[var(--space-gutter-md)] lg:px-[var(--space-gutter-lg)]">
        <div className="flex flex-col lg:flex-row items-center gap-[var(--space-md)] lg:gap-[var(--space-lg)] xl:gap-[var(--space-xl)]">
          {/* Image Section */}
          <div className="w-full lg:w-[55%] flex justify-center lg:justify-start order-1 lg:order-1 mx-auto">
            <div className="relative w-full group">
              <div
                className="relative z-10 w-full transform-gpu transition-transform duration-[var(--duration-emphasis)] ease-[var(--ease-default)] flex items-center justify-center mx-auto rounded-[var(--radius-xl)] overflow-hidden"
                style={{ aspectRatio: "1300 / 1040" }}
              >
                <SmartImage
                  src="/video-pieces/under-hero.svg"
                  alt="Video Editing"
                  fill={true}
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-[var(--duration-emphasis)] ease-[var(--ease-default)]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-[42%] flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-2">
            <span className="tracking-[0.25rem] text-[#00E6D7]/90 text-xs sm:text-sm uppercase font-semibold mb-3 block">
              WHY VIDEO EDITING MATTERS
            </span>

            <h2 className="text-h2 mb-4 sm:mb-6">
              <span className="block text-white mb-1">Raw Footage Alone</span>
              <span className="block bg-gradient-to-r from-[var(--primitive-teal-400)] to-[var(--primitive-teal-700)] bg-clip-text text-transparent">
                Is Not Enough.
              </span>
            </h2>

            <p className="text-lg leading-[1.7] text-white/60 max-w-[48ch] mx-auto lg:mx-0 mb-8 sm:mb-10 font-light">
              Good video editing shapes how people experience your content. It controls pacing,
              structure, clarity, emotion, and attention, turning raw clips into something smoother, more
              professional, and easier to follow.
              From talking head videos and podcasts to product launches, YouTube content, and shortform social media videos, editing helps your message land faster and keeps viewers
              engaged without overwhelming them.
              The difference between content people skip and content people remember is often the
              editing behind it.
            </p>

            <div className="relative group/btn w-full sm:w-auto">
              <div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--primitive-teal-400)] to-[var(--primitive-teal-700)] opacity-0 blur-lg transition-opacity duration-[var(--duration-slow)] group-hover/btn:opacity-30"
                aria-hidden="true"
              />
              <div className="relative transform-gpu transition-transform duration-[var(--duration-normal)] ease-[var(--ease-default)] group-hover/btn:scale-[1.02] group-active/btn:scale-[0.98]">
                <PrimaryButton
                  text="See Our Work"
                  href="/portfolio"
                  width="14rem"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
