import type { ReactNode } from "react";
import { SmartImage } from "../../utils/SmartImage.tsx";
import SecondaryButton from "@/components/Shared/SecondaryButton.tsx";
import PrimaryButton from "@/components/Shared/PrimaryButton.tsx";

type Props = {
  BeforeHighlight?: string;
  Highlight?: string;
  AfterHighlight?: string;
  Description?: string;
  topText? : string;
  imageUrl?: string;

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

  isBranding?: boolean;
  rightComponent?: ReactNode;
};

export const VideoHeader = ({
  BeforeHighlight = "Premium",
  Highlight = "2D & 3D Animations",
  AfterHighlight = "",
  Description = "High-impact animated visuals...",
  topText = "VIDEO EDITING · TALKING HEAD EDITING · SHORT FORM CONTENT · YOUTUBE & SOCIAL MEDIA VIDEOS",
  imageUrl = "/animation-section/Edited.webp",

  imageClassName = "object-contain w-full h-auto",
  imageDivClassName = "",
  imageWrapperClassName = "",
  secondaryBtnText = "Get Pricing",
  secondaryBtnUrl = "#pricing",
  primaryBtnUrl = "/portfolio",
  primaryBtnText = "See our work",

  animationType = "slide",

  enableImageHover = false,

  sectionClassName = "",
  textContainerClassName = "",

  headingClassName = "",
  highlightClassName = "",
  beforeHighlightClassName = "",
  afterHighlightClassName = "",
  descriptionClassName = "",

  showBackground = false,
  backgroundClassName = "",

  reverse = false,

  isBranding = false,
  rightComponent = null,
}: Props) => {
  const isSlide = animationType === "slide";
  const animClass = animationType === "none" ? "" : isSlide ? "animate-slide-up" : "animate-fade-in";

  return (
    <section
      className={`relative w-full overflow-hidden px-4 pb-12 pt-24 text-white sm:px-6 md:px-8 lg:px-12 lg:pt-32 lg:pb-24 ${sectionClassName}`}
    >
      {showBackground && (
        <div className={`absolute inset-0 -z-10 ${backgroundClassName}`} />
      )}

      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`relative z-10 flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-16 ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* === سمت چپ: متن و دکمه‌ها === */}
          <div
            className={`order-2 mx-auto flex w-full max-w-xl flex-col items-center text-center lg:order-1 lg:mx-0 lg:w-[48%] lg:items-start lg:text-left ${animClass} ${textContainerClassName}`}
          >
            <h2 className="tracking-[0.2em] text-white/60 text-[10px] md:text-[15px]">
              {topText}
            </h2>
            <h1
              className={`text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold leading-[1.15] tracking-tight ${headingClassName}`}
            >
              {BeforeHighlight && (
                <span className={beforeHighlightClassName}>
                  {BeforeHighlight}{" "}
                </span>
              )}
              <span className={`text-[#39d0c3] ${highlightClassName}`}>
                {Highlight}
              </span>{" "}
              <span className={`text-white ${afterHighlightClassName}`}>
                {AfterHighlight}
              </span>
            </h1>

            <p
              className={`mt-5 max-w-[48ch] text-[15px] sm:text-base leading-[1.7] text-white/70 ${descriptionClassName}`}
            >
              {Description}
            </p>

            <div
              className="mt-8 flex w-full flex-col sm:w-auto sm:flex-row items-center justify-center gap-4 lg:justify-start"
            >
              <PrimaryButton
                text={primaryBtnText}
                href={primaryBtnUrl}
                width="14rem"
                height="50px"
              />

              <SecondaryButton
                text={secondaryBtnText}
                href={secondaryBtnUrl}
                width="14rem"
                height="50px"
              />
            </div>
          </div>

          {/* === سمت راست: عکس === */}
          <div
            className={`order-1 mx-auto flex w-full justify-center lg:order-2 lg:mx-0 lg:w-[52%] lg:justify-end ${animClass} ${imageDivClassName}`}
          >
            {isBranding && rightComponent}

            {!isBranding && imageUrl && (
              <div
                className={`relative w-full max-w-112.5 sm:max-w-137.5 lg:max-w-162.5 xl:max-w-175 transform-gpu will-change-transform transition-transform duration-300 ease-out ${
                  enableImageHover ? "hover:scale-[1.03]" : ""
                } ${imageWrapperClassName}`}
              >
                <SmartImage
                  src={imageUrl}
                  alt="Video Editing Dashboard"
                  width={900}
                  height={700}
                  priority={true}
                  className={`w-full h-auto object-contain ${imageClassName}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
