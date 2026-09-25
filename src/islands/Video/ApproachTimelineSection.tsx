type ApproachTimelineSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  steps?: number[];
  desktopSrc?: (step: number) => string;
  mobileSrc?: (step: number) => string;
};

const DEFAULT_STEPS = [1, 2, 3, 4, 5, 6];

const DEFAULT_DESCRIPTION =
  "We don’t just design visuals and hope they work. Every ad creative is built through a clear process focused on hooks, message clarity, platform behavior, visual impact, and conversion.";

export default function ApproachTimelineSection({
  eyebrow = "OUR PROCESS",
  title = "Our Approach to High Performing Ad Creatives",
  description = DEFAULT_DESCRIPTION,
  steps = DEFAULT_STEPS,
  desktopSrc = (step) => `/adcreatives/svg/multi-layer/${step}.svg`,
  mobileSrc = (step) => `/adcreatives/approach/R2W (${step}).webp`,
}: ApproachTimelineSectionProps) {
  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-10 lg:px-20 flex justify-center items-center"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#c2d3dc]">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#c3d4de] md:text-base">
            {description}
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl">
          {/* Lines behind everything */}
          <div className="absolute bottom-0 left-5 top-0 -translate-x-1/2 md:left-10 hidden md:block">
            <div className="h-full w-[2px] bg-[#46B59E]/30" />
            <div
              className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#46B59E] via-[#00A9BD] to-[#46B59E]/20 shadow-[0_0_12px_#46B59E]"
            />
          </div>

          {/* Cards with circles */}
          <div className="space-y-4 md:space-y-6">
            {steps.map((step) => (
              <div key={step} className="flex items-center gap-6 md:gap-12 transition-transform duration-300 hover:scale-[1.01]">
                {/* Numbered circle on the line (desktop/tablet only) */}
                <div className="relative hidden md:flex w-10 shrink-0 items-start justify-center pt-1 md:w-20 md:pt-2">
                  <div className="relative flex h-12 w-12 items-center justify-center md:h-14 md:w-14">
                    <div className="absolute inset-0 flex items-center justify-center rounded-full border-[0.5px] border-[#46B59E] bg-[#032635] text-base font-bold text-white shadow-[0_0_14px_rgba(83,226,202,0.45)] md:text-xl">
                      {`0${step}`}
                    </div>
                  </div>
                </div>

                {/* Card SVG */}
                <div
                  className="min-w-0 flex-1 overflow-hidden rounded-2xl opacity-95 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={desktopSrc(step)}
                    alt={`Step ${step}'s svg`}
                    className="hidden h-auto w-full md:block"
                    loading="lazy"
                  />
                  <img
                    src={mobileSrc(step)}
                    alt={`Step ${step}`}
                    className="h-auto w-full md:hidden"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
