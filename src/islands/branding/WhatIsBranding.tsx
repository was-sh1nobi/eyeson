import { SmartImage } from "../../utils/SmartImage.tsx";
import PrimaryButton from "@/components/Shared/PrimaryButton.tsx";

export const WhatIsBranding = () => {
  return (
    <section className="relative w-full overflow-hidden py-[var(--space-lg)] sm:py-[var(--space-xl)]">
      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-[var(--space-gutter)] sm:px-[var(--space-gutter-md)] lg:px-[var(--space-gutter-lg)]">
        <div className="flex flex-col lg:flex-row items-center gap-[var(--space-md)] lg:gap-[var(--space-lg)] xl:gap-[var(--space-xl)]">
          {/* Image Section — keeping animation */}
          <div className="w-full lg:w-[55%] flex justify-center lg:justify-start order-1 lg:order-1 mx-auto">
            <div className="relative w-full group">
              <div
                className="relative z-10 w-full transform-gpu transition-transform duration-[var(--duration-emphasis)] ease-[var(--ease-default)] flex items-center justify-center mx-auto rounded-[var(--radius-xl)] overflow-hidden shadow-2xl shadow-[#5C45FD]/20 border border-white/5 animate-float-slow"
                style={{ aspectRatio: "1300 / 1040" }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#5C45FD] to-[#3B25D4] flex items-center justify-center">
                  <SmartImage
                    src="/Branding/whatisbranding.webp"
                    alt="Nexora Identity"
                    fill
                    className="object-cover drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>
              {/* Glow accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#5C45FD] opacity-20 blur-[100px] -z-10 rounded-full pointer-events-none" />
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-[42%] flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-2">
            <h2 className="text-h2 mb-4 sm:mb-6">
              <span className="block text-white mb-1">What is</span>
              <span className="block bg-gradient-to-r from-[var(--primitive-teal-400)] to-[var(--primitive-teal-700)] bg-clip-text text-transparent">
                Branding & Visual Identity?
              </span>
            </h2>

            <p className="text-lg leading-[1.7] text-white/60 max-w-[48ch] mx-auto lg:mx-0 mb-8 sm:mb-10 font-light">
              Branding and visual identity define how your business looks, feels, and communicates to
              the world. It includes your logo, colors, typography, imagery, and design system working
              together to create a consistent and recognizable brand.
              A strong visual identity helps customers remember your brand, builds trust, and creates a
              professional presence across websites, social media, products, marketing materials, and
              every customer interaction.
            </p>

            <div className="relative group/btn w-full sm:w-auto">
              <div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--primitive-teal-400)] to-[var(--primitive-teal-700)] opacity-0 blur-lg transition-opacity duration-[var(--duration-slow)] group-hover/btn:opacity-30"
                aria-hidden="true"
              />
              <div className="relative transform-gpu transition-transform duration-[var(--duration-normal)] ease-[var(--ease-default)] group-hover/btn:scale-[1.02] group-active/btn:scale-[0.98]">
                <PrimaryButton
                  text="See Our Work"
                  width="14rem"
                  href="/portfolio"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
