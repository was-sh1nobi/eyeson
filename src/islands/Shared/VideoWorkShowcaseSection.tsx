"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { SmartImage } from "@/utils/SmartImage.tsx";
import { httpService } from "@/utils/httpService.ts";
import { VideoShowreelModal } from "./VideoShowreelModal.tsx";

const CATEGORIES = [
  "Brand Trailer",
  "Explainer Videos",
  "Motion Graphics",
  "Ad Creatives",
  "Social Content",
  "Graphic Design",
];

const LIMIT_PER_CATEGORY = 2;
// Mobile: fewer unique cards → less DOM / fewer image decodes.
// Tripled for the -33.33% seamless loop, so keep unique count small.
const MAX_ITEMS_MOBILE = 8;

type ShowcaseItem = {
  id: number;
  src: string;
  videoUrl: string;
  playable: boolean;
  title: string;
};

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    try {
      const mq = window.matchMedia("(pointer: coarse)");
      const update = () => setCoarse(mq.matches);
      update();
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    } catch {
      return;
    }
  }, []);
  return coarse;
}

// همون دکمه پلی که در PostComp استفاده شده
function PlaySvgButton() {
  return (
    <svg
      viewBox="0 0 69 78"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-6 sm:h-10 sm:w-9 lg:h-13.5 lg:w-12"
      aria-hidden
    >
      <path
        d="M66 33.7218C70 36.0312 70 41.8047 66 44.1141L9 77.0231C5 79.3325 0 76.4457 0 71.8269V6.009C0 1.3902 5 -1.49655 9 0.812852L66 33.7218Z"
        fillOpacity="0.8"
      />
    </svg>
  );
}

const CARD_STYLE = {
  width: "calc((100vw - 32px) / 3)",
  height: "calc((100vw - 32px) / 3 * 0.65)",
  maxWidth: "300px",
  maxHeight: "200px",
  minWidth: "110px",
  minHeight: "72px",
} as const;

// Memoized so marquee re-renders / parent state churn don't re-create cards.
const WorkCard = memo(function WorkCard({
  item,
  onPlay,
}: {
  item: ShowcaseItem;
  onPlay: (item: ShowcaseItem) => void;
}) {
  return (
    <article
      className={`group relative shrink-0 overflow-hidden rounded-xl border border-[#188e9f]/70 sm:rounded-2xl ${
        item.playable ? "cursor-pointer" : ""
      }`}
      style={{ ...CARD_STYLE, contentVisibility: "auto", containIntrinsicSize: "300px 200px" } as React.CSSProperties}
      onClick={item.playable ? () => onPlay(item) : undefined}
    >
      <SmartImage
        src={item.src}
        alt={item.title || "Video"}
        decoding="async"
        loading="lazy"
        sizes="(max-width: 640px) 33vw, 300px"
        // Hover zoom is desktop-only (sm:) — no transform churn on touch.
        // No backdrop-blur here: blurring an animating layer forces a full
        // repaint every frame on mobile GPUs.
        className="absolute inset-0 h-full w-full object-cover sm:transition-transform sm:duration-500 sm:group-hover:scale-105"
      />
      {item.playable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 sm:transition-colors sm:duration-500 sm:group-hover:bg-black/30">
          <span className="transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 sm:drop-shadow-[0_0_16px_rgba(72,235,214,0.45)]">
            <PlaySvgButton />
          </span>
        </div>
      )}
    </article>
  );
});

// کارت محو/گرافیتی برای حالت خطا — حس اینکه قبلاً چیزی اونجا بوده
function GhostCard() {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl border border-[#188e9f]/25 bg-linear-to-br from-[#0B2534] to-[#071824] sm:rounded-2xl"
      style={{ ...CARD_STYLE }}
    >
      <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#9de9e5]/30 bg-[#08263a]/50 sm:left-4 sm:top-4 sm:h-9 sm:w-9">
        <svg
          className="h-3 w-3 text-[#b9ffff]/40 sm:h-3.5 sm:w-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

type VideoWorkShowcaseSectionProps = {
  eyebrow?: string | null;
  title?: string;
  highlight?: string | null;
  description?: string;
  sectionClassName?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  highlightClassName?: string;
  descriptionClassName?: string;
  fadeColor?: string;
};

export default function VideoWorkShowcaseSection({
  eyebrow = "OUR WORK",
  title = "Videos That Make People",
  highlight = "Stop Scrolling.",
  description = "Explore motion graphics, launch videos, explainers, social content, animations, and edits\n" +
      "crafted to capture attention fast, keep viewers engaged, and turn your message into\n" +
      "something people actually want to watch.",
  sectionClassName = "",
  eyebrowClassName = "text-[10px] tracking-[0.18em] text-[#c6d6de] sm:text-xs",
  titleClassName = "mt-3 text-3xl font-bold leading-tight text-white sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl",
  highlightClassName = "text-[#35d2cc]",
  descriptionClassName = "mx-auto mt-4 max-w-2xl text-xs leading-6 text-[#c5d7e0] sm:mt-5 sm:text-sm sm:leading-7",
  fadeColor = "#030d18",
}: VideoWorkShowcaseSectionProps) {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ShowcaseItem | null>(null);
  const [inView, setInView] = useState(true);
  const [pageHidden, setPageHidden] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isCoarse = useCoarsePointer();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const fetchVideos = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const results = await Promise.allSettled(
          CATEGORIES.map((category) =>
            httpService.post<any>(`/portfolio/list?page=1&limit=${LIMIT_PER_CATEGORY}`, { category })
          )
        );
        if (cancelled) return;

        const mapped: ShowcaseItem[] = [];
        const seen = new Set<number>();
        for (const result of results) {
          if (result.status !== "fulfilled") continue;
          const res: any = result.value;
          for (const v of res.videos || []) {
            if (seen.has(v.id)) continue;
            seen.add(v.id);
            mapped.push({
              id: v.id,
              src: v.cover ? (v.cover.startsWith('http') ? v.cover : `${import.meta.env.PUBLIC_API_URL}${v.cover}`) : '/video-pieces/person.webp',
              videoUrl: v.video ? (v.video.startsWith('http') ? v.video : `${import.meta.env.PUBLIC_API_URL}${v.video}`) : '',
              playable: !!v.video,
              title: v.category,
            });
          }
        }

        if (mapped.length === 0) {
          setFailed(true);
        } else {
          setItems(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch videos", err);
          setFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchVideos();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  // Pause the marquee when the section is offscreen — the single biggest
  // mobile win: no compositor work while the user can't see it.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // …and when the tab is backgrounded.
  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const handlePlay = (item: ShowcaseItem) => {
    setSelectedVideo(item);
    setIsModalOpen(true);
  };

  // Cap unique cards on touch devices: tripled loop × 12 items = 36 <img>
  // decodes. 8 unique → 24 nodes is plenty for a phone viewport.
  const visibleItems = useMemo(
    () => (isCoarse && items.length > MAX_ITEMS_MOBILE ? items.slice(0, MAX_ITEMS_MOBILE) : items),
    [items, isCoarse]
  );

  const { row1, row2, playableList } = useMemo(() => {
    const r1 = visibleItems.filter((_, idx) => idx % 2 === 0);
    const r2 = visibleItems.filter((_, idx) => idx % 2 === 1);
    return {
      row1: [...r1, ...r1, ...r1],
      row2: [...r2, ...r2, ...r2],
      playableList: visibleItems.filter((v) => v.playable),
    };
  }, [visibleItems]);

  // Any of these → freeze the CSS animation (GPU does zero work).
  const marqueePaused = !inView || pageHidden || isModalOpen;

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-20 lg:pb-24 ${sectionClassName}`}
    >
      {/* ── Header ── */}
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? <p className={eyebrowClassName}>{eyebrow}</p> : null}
          <h2 className={titleClassName}>
            {title}
            {highlight ? (
              <>
                <br />
                <span className={highlightClassName}>{highlight}</span>
              </>
            ) : null}
          </h2>
          <p className={descriptionClassName}>{description}</p>
        </div>
      </div>

      {/* ── CSS Keyframes ── */}
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes scroll-right {
          0%   { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .track-left, .track-right {
          display: flex;
          width: max-content;
          gap: 12px;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        @media (min-width: 640px) {
          .track-left, .track-right { gap: 16px; }
        }
        .track-left {
          animation: scroll-left 35s linear infinite;
        }
        .track-right {
          animation: scroll-right 38s linear infinite;
        }
        /* Touch: slower scroll = fewer frames to composite per second. */
        @media (pointer: coarse) {
          .track-left { animation-duration: 55s; }
          .track-right { animation-duration: 60s; }
        }
        /* Hover-pause is pointer-exact only — touch scroll otherwise
           fights the animation and janks. */
        @media (hover: hover) and (pointer: fine) {
          .track-left:hover,
          .track-right:hover {
            animation-play-state: paused;
          }
        }
        .track-paused .track-left,
        .track-paused .track-right {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .track-left, .track-right { animation: none; }
        }
        html.reduce-motion .track-left,
        html.reduce-motion .track-right {
          animation: none !important;
        }
        /* gpu-off lite = slower scroll (decrease, never disable) */
        html.gpu-off .track-left {
          animation-duration: 70s !important;
        }
        html.gpu-off .track-right {
          animation-duration: 76s !important;
        }
      `}</style>

      {/* ── Rows ── */}
      <div className={`mt-8 space-y-3 sm:mt-10 sm:space-y-4 ${marqueePaused ? "track-paused" : ""}`}>
        {loading ? null : failed ? (
          <div className="relative">
            {/* ردیف‌های محو — حس اینکه ویدیوها قبلاً اونجا بوده‌ان */}
            <div className="space-y-3 opacity-40 sm:space-y-4" aria-hidden>
              <div className="flex gap-4 overflow-hidden" style={{ transform: "translateX(-24px)" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <GhostCard key={`g1-${i}`} />
                ))}
              </div>
              <div className="flex gap-4 overflow-hidden" style={{ transform: "translateX(-90px)" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <GhostCard key={`g2-${i}`} />
                ))}
              </div>
            </div>

            {/* پیام خطا روی ردیف‌های محو */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <div
                className="pointer-events-none absolute inset-x-0 inset-y-0"
                style={{
                  background: `radial-gradient(ellipse at center, ${fadeColor} 30%, transparent 75%)`,
                }}
              />
              <p className="bg-linear-to-r from-[#46B6A0] to-[#2EBACA] bg-clip-text text-lg font-bold text-transparent sm:text-xl">
                Failed to fetch videos
              </p>
              <p className="text-xs text-[#c5d7e0]/70 sm:text-sm">
                Please try again later.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ردیف اول: به سمت چپ */}
            <div className="relative w-full overflow-hidden">
              {/* fade mask چپ و راست */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20"
                style={{
                  background: `linear-gradient(to right, ${fadeColor}, transparent)`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20"
                style={{
                  background: `linear-gradient(to left, ${fadeColor}, transparent)`,
                }}
              />

              <div className="track-left">
                {row1.map((item, idx) => (
                  <WorkCard
                    key={`r1-${item.id}-${idx}`}
                    item={item}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            </div>

            {/* ردیف دوم: به سمت راست */}
            <div className="relative w-full overflow-hidden">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20"
                style={{
                  background: `linear-gradient(to right, ${fadeColor}, transparent)`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20"
                style={{
                  background: `linear-gradient(to left, ${fadeColor}, transparent)`,
                }}
              />

              <div className="track-right">
                {row2.map((item, idx) => (
                  <WorkCard
                    key={`r2-${item.id}-${idx}`}
                    item={item}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* مودال پلیر — همون پلیر صفحه پورتفولیو */}
      {selectedVideo && (
        <VideoShowreelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoList={playableList}
          initialVideo={selectedVideo}
        />
      )}
    </section>
  );
}
