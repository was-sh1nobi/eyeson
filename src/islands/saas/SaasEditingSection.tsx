import { SmartImage } from "../../utils/SmartImage.tsx";
import PrimaryButton from "@/components/Shared/PrimaryButton.tsx";

export default function SaasEditingSection() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center gap-8 px-6 py-12 lg:flex-row lg:items-center lg:gap-16 lg:px-20 lg:py-24 animate-fade-in"
    >
      <p className="text-[11px] sm:text-sm tracking-widest text-white/60 font-semibold uppercase text-center w-full lg:absolute lg:top-8 lg:left-1/2 lg:-translate-x-1/2">
        PRODUCT STORYTELLING MEETS MOTION DESIGN
      </p>
      <div
        className="relative order-2 w-full max-w-[640px] cursor-pointer overflow-hidden rounded-2xl  lg:order-1 lg:w-1/2 transition-transform duration-300 hover:scale-[1.3] scale-[1.2]"
        style={{ aspectRatio: "1250 / 841" }}
      >
        <SmartImage
          src="/saas/2.webp"
          alt="SaaS Creative"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="relative order-1 flex w-full max-w-full flex-col items-center gap-6 pt-0 text-center md:max-w-none md:text-left lg:order-2 lg:w-1/2 lg:pt-8 animate-slide-up">
        <h2 className="text-[42px] font-bold leading-[1.15] text-white md:text-5xl md:leading-tight lg:text-6xl text-center">
          Turn Complex Software
          <span className="text-[#0fe0d2]"> Into a Story People Understand.</span>
        </h2>
        <p className="text-[14px] leading-8 text-gray-200  md:text-lg  text-center">
          Great software can still be difficult to sell when people do not immediately understand
          what it does, why it matters, or how it improves their lives.
          That is where strong product storytelling changes everything. At EyesOn Studio, we combine
          strategy, scriptwriting, UI animation, motion design, sound, and storytelling to turn your
          SaaS product into a clear visual experience.
          Whether you are launching a new platform, explaining a complex workflow, introducing an
          AI product, or upgrading your homepage, we create videos that make your software feel
          simpler, more valuable, and easier to remember.
        </p>

        <PrimaryButton
          text="Explore Our Work"
          href="/portfolio#work"
          width="14rem"
          height="50px"
        />
      </div>
    </section>
  );
}
