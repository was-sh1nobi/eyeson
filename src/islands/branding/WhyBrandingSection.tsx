import { SmartImage } from "../../utils/SmartImage.tsx";

export const WhyBrandingSection = () => {
  return (
    <section className="w-full py-12 px-4 sm:py-16 md:px-8 lg:py-20 lg:px-16 font-sans">
      <div
        className="max-w-350 mx-auto flex flex-col lg:flex-row gap-5 animate-fade-in"
      >
        {/* ===== ستون چپ: تیتر + ۲ کارت افقی ===== */}
        <div className="flex flex-col gap-5 lg:w-[42%]">
          {/* تیتر */}
          <div className="mb-1 animate-slide-up">
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl text-center lg:text-left md:text-5xl">
              WHY <span className="text-[#42D1D1]">BRANDING</span> MATTERS
            </h2>
            <p className="text-gray-300 text-base font-light mt-2 sm:text-lg md:text-xl text-center lg:text-left">
              The Business Value of a Strong Brand
            </p>
          </div>

          {/* کارت ۱: عکس چپ، متن راست */}
          <div
            className="flex flex-row rounded-2xl border border-[#13a8b8]/30 bg-[#071c2e]/80 backdrop-blur-md overflow-hidden transition-all duration-200 hover:border-[#42D1D1]/60"
            style={{ minHeight: 160 }}
          >
            <div className="relative shrink-0" style={{ width: "42%" }}>
              <SmartImage
                src="/Branding/leftnum1.webp"
                alt="Builds Instant Trust and Credibility"
                fill
                objectFit="cover"
              />
            </div>
            <div
              className="flex flex-col justify-center p-4 sm:p-5 lg:p-6"
              style={{ width: "58%" }}
            >
              <h3 className="text-base font-bold text-white leading-snug mb-2 sm:text-lg lg:mb-3">
                Builds Trust &<br />
                Credibility
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed sm:text-sm">
                Professional branding creates stronger first impressions and helps customers feel
                confident choosing your business.
              </p>
            </div>
          </div>

          {/* کارت ۲: متن چپ، عکس راست */}
          <div
            className="flex flex-row rounded-2xl border border-[#13a8b8]/30 bg-[#071c2e]/80 backdrop-blur-md overflow-hidden transition-all duration-200 hover:border-[#42D1D1]/60"
            style={{ minHeight: 160 }}
          >
            <div
              className="flex flex-col justify-center p-4 sm:p-5 lg:p-6"
              style={{ width: "58%" }}
            >
              <h3 className="text-base font-bold text-white leading-snug mb-2 sm:text-lg lg:mb-3">
                Increases Brand Recognition
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed sm:text-sm">
                Consistent visual identity makes your brand easier to remember across every platform and
                customer touchpoint.
              </p>
            </div>
            <div className="relative shrink-0" style={{ width: "42%" }}>
              <SmartImage
                src="/Branding/leftnum2.webp"
                alt="Recognizable and Memorable"
                fill
                objectFit="cover"
              />
            </div>
          </div>
        </div>

        {/* ===== ستون وسط: Consistency ===== */}
        <div
          className="flex flex-col rounded-2xl border border-[#13a8b8]/30 bg-[#071c2e]/80 backdrop-blur-md overflow-hidden lg:w-[33%] transition-all duration-200 hover:border-[#42D1D1]/60"
        >
          <div className="p-5 sm:p-6 lg:p-7 shrink-0">
            <h3 className="text-xl font-bold text-white leading-tight mb-3 sm:text-2xl lg:mb-4">
              Creates Consistency Across Every Channel
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed lg:text-[15px]">
              A unified brand system keeps your website, social media, products, and marketing aligned
              under one visual identity.
            </p>
          </div>

          <div className="relative flex-1" style={{ minHeight: 260 }}>
            <SmartImage
              src="/Branding/rightnum1.webp"
              alt="Consistency Across Product and Marketing"
              fill
            />
          </div>
        </div>

        {/* ===== ستون راست: Better Performing ===== */}
        <div
          className="flex flex-col rounded-2xl border border-[#13a8b8]/30 bg-[#071c2e]/80 backdrop-blur-md overflow-hidden lg:w-[25%] transition-all duration-200 hover:border-[#42D1D1]/60"
        >
          <div className="relative flex-1" style={{ minHeight: 240 }}>
            <SmartImage
              src="/Branding/rightnum2.webp"
              alt="Better Performing Content and Ads"
              fill
            />
          </div>

          <div className="p-5 sm:p-6 lg:p-7 shrink-0">
            <h3 className="text-lg font-bold text-white leading-tight mb-2 sm:text-xl lg:mb-3">
              Differentiates You From Competitors
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed lg:text-[15px]">
              Distinctive branding helps your business stand out in crowded markets and communicate
              what makes you unique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
