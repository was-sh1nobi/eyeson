import type { ReactNode } from "react";
import PrimaryButton from "../../components/Shared/PrimaryButton";
import SecondaryButton from "../../components/Shared/SecondaryButton";
import { SmartImage } from "../../utils/SmartImage.tsx";

type Props = {
  SmallLabel?: string | null;
  BeforeHighlight?: string;
  Highlight?: string;
  AfterHighlight?: string;
  Description?: string;

  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClassName?: string;
  imageDivClassName?: string;
  imageWrapperClassName?: string;

  primaryBtnText?: string;
  secondaryBtnText?: string;

  primaryBtnUrl?: string;
  secondaryBtnUrl?: string;

  animationType?: "fade" | "slide" | "none";

  enableImageHover?: boolean;

  sectionClassName?: string;
  textContainerClassName?: string;

  headingClassName?: string;
  highlightClassName?: string;
  beforeHighlightClassName?: string;
  afterHighlightClassName?: string;
  descriptionClassName?: string;

  primaryBtnClassName?: string;
  secondaryBtnClassName?: string;

  primaryBtnWrapperClassName?: string;
  secondaryBtnWrapperClassName?: string;

  showBackground?: boolean;
  backgroundClassName?: string;

  reverse?: boolean;

  usePrimarySecondaryButtons?: boolean;

  isBranding?: boolean;
  rightComponent?: ReactNode;
  gridClassName?: string;
};

export const HeroBasic = ({
  SmallLabel,
  BeforeHighlight = "Premium",
  Highlight = "2D & 3D Animations",
  AfterHighlight = "",
  Description = "High-impact animated visuals...",

  imageUrl = "/animation-section/Edited.webp",
  // NOTE: must match the file's real pixel dimensions — the browser reserves
  // the aspect-ratio box from these before the image arrives. Wrong values
  // cause a layout shift when the true aspect replaces them (see /animation).
  imageWidth = 800,
  imageHeight = 640,
  imageClassName = "",
  imageDivClassName = "",
  imageWrapperClassName = "",

  primaryBtnText = "View Our Work",
  secondaryBtnText = "Get Pricing",

  primaryBtnUrl = "#work",
  secondaryBtnUrl = "#pricing",

  animationType = "fade",

  enableImageHover = false,

  sectionClassName = "",
  textContainerClassName = "",

  headingClassName = "",
  highlightClassName = "",
  beforeHighlightClassName = "",
  afterHighlightClassName = "",
  descriptionClassName = "",

  primaryBtnClassName = "",
  secondaryBtnClassName = "",

  primaryBtnWrapperClassName = "",
  secondaryBtnWrapperClassName = "",

  showBackground = false,
  backgroundClassName = "",

  reverse = false,

  usePrimarySecondaryButtons = false,

  isBranding = false,
  rightComponent = null,
  gridClassName = "",
}: Props) => {
  const isSlide = animationType === "slide";
  const animClass = animationType === "none" ? "" : isSlide ? "animate-slide-up" : "animate-fade-in";

  return (
    <section
      className={`relative mt-20 md:mt-36 w-full overflow-hidden px-4 pb-10 pt-4 text-white md:px-8 lg:px-12 ${sectionClassName}`}
    >
      {showBackground && (
        <div className={`absolute inset-0 -z-10 ${backgroundClassName}`} />
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <div
          className={`relative z-10 grid min-h-[50vh] sm:min-h-[500px] items-center gap-6 ${
            reverse ? "lg:grid-cols-[320px_1fr]" : "lg:grid-cols-[1fr_320px]"
          } ${gridClassName}`}
        >
          <div
            className={`mx-auto flex max-w-lg flex-col items-center text-center md:mx-0 md:items-start md:text-left ${animClass} ${textContainerClassName}`}
          >
            {SmallLabel && (
              <p
                className="mb-3 text-xs tracking-[0.2em] text-[#c2d3dc]"
              >
                {SmallLabel}
              </p>
            )}
            <h1
              className={`text-[22px] md:text-[35px] font-bold leading-tight ${headingClassName}`}
            >
              <span className={beforeHighlightClassName}>
                {BeforeHighlight}{" "}
              </span>
              <span
                className={`bg-linear-to-r from-[#45B6A0] to-[#12ACB5] bg-clip-text text-transparent font-bold ${highlightClassName}`}
              >
                {Highlight}
              </span>
              <br />
              <span className={afterHighlightClassName}>{AfterHighlight}</span>
            </h1>

            <p
              className={`mt-4 max-w-md text-xs leading-6 text-white/75 md:text-[18px] md:text-sm ${descriptionClassName}`}
            >
              {Description}
            </p>

            <div
              className="mt-6 flex flex-row flex-wrap justify-center gap-2 md:justify-start"
            >
              {usePrimarySecondaryButtons ? (
                <>
                  <PrimaryButton
                    text={primaryBtnText}
                    href={primaryBtnUrl}
                    className={primaryBtnWrapperClassName}
                  />
                  <SecondaryButton
                    text={secondaryBtnText}
                    href={secondaryBtnUrl}
                    className={secondaryBtnWrapperClassName}
                  />
                </>
              ) : (
                <>
                  <div
                    className={`group relative inline-flex rounded-full p-[2px] transition-transform duration-200 hover:scale-105 active:scale-95 ${primaryBtnWrapperClassName}`}
                  >
                    <div className="absolute -inset-[2px] rounded-full bg-linear-to-r from-[#45B6A0] to-[#12ACB5] shadow-[0_0_18px_#00A9BD]" />
                    <a
                      href={primaryBtnUrl}
                      className={`relative z-10 rounded-full px-4 py-2.5 cursor-pointer bg-linear-to-r from-[#00A9BD] to-[#1D553A] text-sm md:text-lg overflow-hidden ${primaryBtnClassName}`}
                    >
                      <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%] skew-x-[-20deg]" />
                      {primaryBtnText}
                    </a>
                  </div>

                  <div
                    className={`group relative inline-flex rounded-full p-[2px] transition-transform duration-200 hover:scale-105 active:scale-95 ${secondaryBtnWrapperClassName}`}
                  >
                    <div className="absolute -inset-[2px] rounded-full bg-linear-to-r from-[#056E7C] to-[#46B6A0] shadow-[0_0_18px_#00A9BD]" />
                    <a
                      href={secondaryBtnUrl}
                      className={`relative z-10 rounded-full px-4 py-2.5 bg-linear-to-r from-[#00061D] to-[#0B1F2A] cursor-pointer text-sm md:text-lg overflow-hidden ${secondaryBtnClassName}`}
                    >
                      <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%] skew-x-[-20deg]" />
                      {secondaryBtnText}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className={`mx-auto w-full max-w-[480px] md:mx-0 ${animClass} ${imageDivClassName}`}
          >
            {isBranding && rightComponent}

            {!isBranding && imageUrl && (
              <div
                className={`relative transform-gpu will-change-transform transition-transform duration-300 ease-out ${
                  enableImageHover ? "hover:scale-[1.03]" : ""
                } ${imageWrapperClassName}`}
              >
                <SmartImage
                  src={imageUrl}
                  alt="Hero image"
                  width={imageWidth}
                  height={imageHeight}
                  priority={true}
                  className={imageClassName}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
