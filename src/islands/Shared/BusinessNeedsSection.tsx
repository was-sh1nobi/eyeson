"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import PrimaryButton from "@/components/Shared/PrimaryButton";
import SecondaryButton from "@/components/Shared/SecondaryButton";

type InfoCard = {
  id: number;
  title: string;
  description: string;
  image: string;
  media?: ReactNode;
};

type BusinessNeedsSectionProps = {
  label?: string;
  beforeHighlight?: string;
  highlight?: string;
  afterHighlight?: string;
  body?: string;
  mainTitle?: string;
  mainBody?: string;
  primaryBtnText?: string;
  secondaryBtnText?: string;
  panelOverlayClassName?: string;
  rightSection?: ReactNode;
  cards?: InfoCard[];
};

const defaultInfoCards: InfoCard[] = [
  {
    id: 1,
    title: "Promote brand individuality",
    description:
      "Professional editing shapes your content into a style that feels uniquely yours. From pacing to color and transitions, consistent editing builds a recognizable identity.",
    image: "/Shared/Features/left.webp",
  },
  {
    id: 2,
    title: "Stand out from competitors",
    description:
      "Clean, well-structured edits naturally separate you from noise. Strong storytelling and polished visuals make your videos feel more professional and memorable.",
    image: "/Shared/Features/middle.webp",
  },
  {
    id: 3,
    title: "Create shareable & reusable assets",
    description:
      "Great edits can be repurposed across social platforms and campaigns. This gives your team more content options without starting from scratch each time.",
    image: "/Shared/Features/right.webp",
  },
];

export default function BusinessNeedsSection({
  label = "WHY VIDEO EDITING MATTERS",
  beforeHighlight = "Why your business needs",
  highlight = "video editing?",
  afterHighlight = "",
  body = "Professional video editing transforms raw footage into content that communicates with clarity and impact. It improves how audiences consume your message and helps every second work harder.",
  mainTitle = "Boost sales & interactivity",
  mainBody = "High-quality editing helps your audience understand your product faster, trust your message sooner, and take action with less friction.",
  primaryBtnText = "Get a free sample",
  secondaryBtnText = "See our work",
  panelOverlayClassName = "bg-[linear-gradient(140deg,rgba(5,33,54,0.82)_10%,rgba(2,21,35,0.85)_70%)]",
  rightSection,
  cards = defaultInfoCards,
}: BusinessNeedsSectionProps) {
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const track = mobileTrackRef.current;
    if (!track) return;

    const cardsEls = Array.from(
      track.querySelectorAll<HTMLElement>("[data-business-card]"),
    );
    if (cardsEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.getAttribute("data-card-index"));
          if (!Number.isNaN(idx)) setActiveSlide(idx);
        });
      },
      { root: track, threshold: 0.6 },
    );

    cardsEls.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [cards.length]);

  const goToCard = (index: number) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(
      `[data-card-index="${index}"]`,
    );
    if (!card) return;
    card.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  return (
    <section className="relative w-full overflow-hidden px-4 pb-20 pt-8 sm:px-6 lg:px-24 lg:pb-28 ">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto  max-w-3xl text-center ">
          <p className="text-[11px] sm:text-sm tracking-widest text-white/60 font-semibold uppercase">
            {label}
          </p>
          <h2 className="text-3xl font-extrabold text-white md:text-5xl">
            {beforeHighlight}
            <br />
            <span className="text-[#12d4d1]">{highlight}</span>
            {afterHighlight && <>{afterHighlight}</>}
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#c4d5df] md:text-base">
            {body}
          </p>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-[34px] border border-[#12c9d5]/55 bg-[radial-gradient(circle_at_80%_100%,rgba(17,180,185,0.2),rgba(3,19,31,0.92)_58%)] p-5 shadow-[0_0_40px_rgba(0,168,182,0.24)] md:mt-10 md:rounded-3xl md:border-[#0f7f98]/60 md:bg-transparent md:p-8 md:shadow-[0_0_60px_rgba(0,168,182,0.2)]">
          <img
            src="/blogs/Story-Back.webp"
            alt=""
            className="object-cover absolute bottom-2 left-0"
            sizes="(max-width: 1024px) 100vw, 1200px"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
          <div
            className={`absolute inset-0 ${panelOverlayClassName}`}
            aria-hidden
          />

          <div className="relative z-10 grid items-center gap-7 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl leading-[1.05] font-bold text-white md:text-3xl">
                {mainTitle}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#d2e1e8] md:text-sm md:leading-7">
                {mainBody}
              </p>

              <div className="mt-7 flex flex-nowrap gap-3 md:flex-wrap md:gap-4">
                <PrimaryButton text={primaryBtnText} />
                <SecondaryButton text={secondaryBtnText} />
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:pl-10 flex items-center justify-center">
              {rightSection ?? (
                  <img src="/Shared/sharing/main-right.webp" alt="Right Section SVG" className="scale-100 md:scale-110 lg:scale-140"/>
              )}
            </div>
          </div>
        </div>

        <div
          ref={mobileTrackRef}
          className="mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card, index) => {
            return (
              <article
                key={card.id}
                data-business-card
                data-card-index={index}
                className="group relative min-w-full snap-center perspective-[1000px] md:min-w-0"
                tabIndex={0}
              >
                <div
                  className="absolute inset-0 rounded-3xl opacity-25 transition-opacity duration-500 ease-out md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 md:backdrop-blur-[12px]"
                  style={{
                    transform: "rotate(-5deg) scale(0.95)",
                    zIndex: 0,
                    background:
                      "linear-gradient(145deg, rgba(16, 145, 151, 0.15) 35%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.85) 100%)",
                    border: "1px solid rgba(16, 145, 151, 0.35)",
                    boxShadow:
                      "inset 0 0 20px rgba(16, 145, 151, 0.18), 0 10px 30px rgba(0,0,0,0.5)",
                  }}
                />

                <div
                  className="relative z-10 h-full overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#0B1F2A] to-[#064B57] p-3 transition-all duration-500 ease-out md:group-hover:border-[#1cdfe2]/60 md:group-focus-visible:border-[#1cdfe2]/60 md:group-hover:-translate-y-1 md:group-hover:translate-x-1 md:group-hover:rotate-[3deg] md:group-focus-visible:-translate-y-1 md:group-focus-visible:translate-x-1 md:group-focus-visible:rotate-[3deg] md:group-hover:shadow-[0_18px_40px_rgba(18,213,220,0.35)] md:group-focus-visible:shadow-[0_18px_40px_rgba(18,213,220,0.35)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative h-40 overflow-hidden rounded-2xl bg-[#061321]">
                    {card.media ? (
                      card.media
                    ) : (
                      <>
                        <img
                          src={card.image}
                          alt={card.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full  scale-[0.9] w-full object-cover transition-transform duration-500 group-hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] to-transparent opacity-70" />
                      </>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-3xl font-bold text-white transition-colors md:group-hover:text-[#dffeff] md:group-focus-visible:text-[#dffeff]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#c6d9e3]">
                      {card.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              onClick={() => goToCard(index)}
              aria-label={`Go to card ${index + 1}`}
              aria-pressed={activeSlide === index}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                activeSlide === index ? "bg-[#2ecfc9]" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
