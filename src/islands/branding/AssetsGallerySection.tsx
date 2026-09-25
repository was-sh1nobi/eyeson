import { SmartImage } from "../../utils/SmartImage.tsx";

export const AssetsGallerySection = () => {
  const card =
    "bg-[#0A1A24] border border-[#14313B] rounded-[24px] overflow-hidden shadow-lg transition-colors duration-200 hover:border-[#42D1D1]/40";

  return (
    <section className="w-full py-12 px-4 sm:py-16 md:px-8 lg:py-20 lg:px-16 font-sans">
      {/* ===== هدر ===== */}
      <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12 lg:mb-16 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-2 leading-tight sm:text-3xl md:text-4xl lg:text-[44px]">
          What we can create
        </h2>
        <h2 className="text-2xl font-bold text-[#42D1D1] mb-4 leading-tight sm:text-3xl md:text-4xl lg:text-[44px] lg:mb-6">
          for your Brand?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl mx-auto font-light md:text-base">
          A strong brand is more than a logo. We create the visual assets, systems, and guidelines
          that help your brand stay consistent across every platform and customer touchpoint.
        </p>
      </div>

      {/* ===== گرید ===== */}
      <div
        className="max-w-350 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 animate-slide-up"
      >
        {/* ── 1. Logo Design ── col 1-7, row 1-2 */}
        <div
          className={`${card} md:col-span-2 lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-2 flex flex-col p-5 sm:p-7`}
        >
          <h3 className="text-xl font-bold text-white mb-2 sm:text-2xl">
            Logo design
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed font-light mb-4 sm:text-sm sm:mb-5">
            Distinctive logos designed to be memorable, scalable, and instantly recognizable.
          </p>
          <div className="relative flex-1 min-h-45 sm:min-h-55 rounded-2xl overflow-hidden bg-[#060F18]">
            <SmartImage
              src="/Branding/topleft.webp"
              alt="Logo design examples"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* ── 2. Brand Color System ── col 8-12, row 1 */}
        <div
          className={`${card} lg:col-start-8 lg:col-span-5 lg:row-start-1 flex flex-row items-center gap-3 p-5 sm:gap-4 sm:p-6`}
        >
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white mb-1.5 sm:text-lg sm:mb-2">
              Brand color system
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed font-light">
              Strategic color palettes that strengthen recognition and create visual consistency.
            </p>
          </div>
          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#060F18] sm:w-24 sm:h-24 lg:w-28 lg:h-28">
            <SmartImage
              src="/Branding/topright1.webp"
              alt="Brand color system"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* ── 3. Typography System ── col 8-12, row 2 */}
        <div
          className={`${card} lg:col-start-8 lg:col-span-5 lg:row-start-2 flex flex-row items-center gap-3 p-5 sm:gap-4 sm:p-6`}
        >
          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#060F18] sm:w-24 sm:h-24 lg:w-28 lg:h-28">
            <SmartImage
              src="/Branding/topright2.webp"
              alt="Typography system"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white mb-1.5 sm:text-lg sm:mb-2">
              Typography system
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed font-light">
              Carefully selected type systems that reflect your brand personality and improve readability.
            </p>
          </div>
        </div>

        {/* ── 4. Brand Patterns ── col 1-3, row 3 */}
        <div
          className={`${card} lg:col-start-1 lg:col-span-3 lg:row-start-3 flex flex-col p-4 sm:p-5`}
        >
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#060F18] mb-3 sm:mb-4">
            <SmartImage
              src="/Branding/bottomright1.webp"
              alt="Brand patterns"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 sm:text-base sm:mb-1.5">
            Brand Patterns & Graphic Elements
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed font-light">
            Custom visual assets that add depth, character, and uniqueness to your brand identity.
          </p>
        </div>

        {/* ── 5. Brand Guidelines ── col 4-7, row 3 */}
        <div
          className={`${card} lg:col-start-4 lg:col-span-4 lg:row-start-3 flex flex-col p-4 sm:p-5`}
        >
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#060F18] mb-3 sm:mb-4">
            <SmartImage
              src="/Branding/bottomright2.webp"
              alt="Brand guidelines"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-sm font-bold text-white mb-1 sm:text-base sm:mb-1.5">
            Brand Guidelines
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed font-light">
            Clear documentation that ensures your brand is used consistently across teams and
            channels.
          </p>
        </div>

        {/* ── 6. Branded Intro Slides ── col 8-12, row 3-4 */}
        <div
          className={`${card} md:col-span-2 lg:col-start-8 lg:col-span-5 lg:row-start-3 lg:row-span-2 flex flex-col p-5 sm:p-7`}
        >
          <h3 className="text-lg font-bold text-white mb-2 sm:text-xl">
            Social Media Assets
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed font-light mb-4 sm:text-sm sm:mb-5">
            Branded templates and visual assets designed for consistent content creation.
          </p>
          <div className="relative flex-1 min-h-50 sm:min-h-60 lg:min-h-0 rounded-2xl overflow-hidden bg-[#060F18]">
            <SmartImage
              src="/Branding/bottomright.webp"
              alt="Branded intro slides showcase"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* ── 7. Branded GIFs ── col 1-7, row 4 */}
        <div
          className={`${card} md:col-span-2 lg:col-start-1 lg:col-span-7 lg:row-start-4 flex flex-col md:flex-row items-center gap-4 p-5 sm:gap-6 sm:p-6`}
        >
          <div className="relative w-full md:w-[42%] aspect-video rounded-xl overflow-hidden bg-[#060F18] shrink-0">
            <SmartImage
              src="/Branding/bottom.webp"
              alt="Branded GIFs showcase"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2 sm:text-xl">
              Presentation & Pitch Deck Design
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed font-light sm:text-sm">
              Professional presentations that communicate ideas clearly and strengthen brand
              perception.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
