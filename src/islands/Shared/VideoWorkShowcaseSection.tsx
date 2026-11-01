"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { SmartImage } from "@/utils/SmartImage.tsx";
import { httpService } from "@/utils/httpService.ts";
import { VideoShowreelModal } from "./VideoShowreelModal.tsx";

type ShowcaseItem = {
  id: number | string;
  src: string;
  videoUrl: string;
  previewUrl?: string;
  playable: boolean;
  title: string;
};

const FALLBACK_ITEMS: ShowcaseItem[] = [
  {
    id: 6,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786431829961-Screenshot%202026-08-11%20063656.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786431829450-00%20-%20Predictefy%20-%20Launch%20Trailer.mp4",
    previewUrl: "https://back.eyesonstudio.com/media/raw/portfolio/preview-1791455470498-1786431829450-00%20-%20Predictefy%20-%20Launch%20Trailer.mp4",
    playable: true,
    title: "Brand Trailer",
  },
  {
    id: 7,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786441608144-Screenshot%20From%202026-08-11%2013-14-37.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786441607973-01%20-%20Starbucks%20%E2%80%93%20Brand%20Trailer_compressed.mp4",
    previewUrl: "https://back.eyesonstudio.com/media/raw/portfolio/preview-1791822450052-1786441607973-01%20-%20Starbucks%20%E2%80%93%20Brand%20Trailer_compressed.mp4",
    playable: true,
    title: "Brand Trailer",
  },
  {
    id: 20,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786446536483-Screenshot%20From%202026-08-11%2014-31-35.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786446536127-16%20-%20Vuetify%20%E2%80%93%20SaaS%20Explainer%20Video_compressed.mp4",
    previewUrl: "https://back.eyesonstudio.com/media/raw/portfolio/preview-1791822389591-1786446536127-16%20-%20Vuetify%20%E2%80%93%20SaaS%20Explainer%20Video_compressed.mp4",
    playable: true,
    title: "Explainer Videos",
  },
  {
    id: 25,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786459227358-Screenshot%20From%202026-08-11%2018-09-15.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786459227301-AkiraLink%20%E2%80%94%20Social%20Reel_compressed.mp4",
    previewUrl: "https://back.eyesonstudio.com/media/raw/portfolio/preview-1791822174206-1786459227301-AkiraLink%20%E2%80%94%20Social%20Reel_compressed.mp4",
    playable: true,
    title: "Motion Graphics",
  },
  {
    id: 29,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786459750944-Screenshot%20From%202026-08-11%2018-17-34.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786459750837-CryptoZen%20Solana%20%E2%80%94%20Educational%20Reel_compressed.mp4",
    previewUrl: "https://back.eyesonstudio.com/media/raw/portfolio/preview-1791822274460-1786459750837-CryptoZen%20Solana%20%E2%80%94%20Educational%20Reel_compressed.mp4",
    playable: true,
    title: "Motion Graphics",
  },
  {
    id: 41,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786461805783-Screenshot%20From%202026-08-11%2018-50-43.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786461805166-17%20-%20Coconut%20Care%20%E2%80%93%20Product%20Ad%20_compressed.mp4",
    previewUrl: "https://back.eyesonstudio.com/media/raw/portfolio/preview-1791822507540-1786461805166-17%20-%20Coconut%20Care%20%E2%80%93%20Product%20Ad%20_compressed.mp4",
    playable: true,
    title: "Ad Creatives",
  },
  {
    id: 8,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786442015930-Screenshot%20From%202026-08-11%2013-20-21.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786442015364-02%20-%20Uber%20-%20Brand%20Trailer_compressed.mp4",
    previewUrl: "#",
    playable: true,
    title: "Brand Trailer",
  },
  {
    id: 9,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786442482739-Screenshot%20From%202026-08-11%2013-28-50.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786442482564-04%20-%20Binance%20-%20Crypto%20Brand%20Trailer_compressed.mp4",
    previewUrl: "#",
    playable: true,
    title: "Brand Trailer",
  },
  {
    id: 10,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786442607476-Screenshot%20From%202026-08-11%2013-30-52.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786442607284-05%20-%20Apple%20Health%20-%20Product%20Trailer_compressed.mp4",
    previewUrl: "#",
    playable: true,
    title: "Brand Trailer",
  },
  {
    id: 11,
    src: "https://back.eyesonstudio.com/media/raw/portfolio/1786442807822-Screenshot%20From%202026-08-11%2013-34-01.png",
    videoUrl: "https://back.eyesonstudio.com/media/raw/portfolio/1786442807656-06%20-%20Pandora%20Parlays%20-%20SaaS%20Trailer_compressed.mp4",
    previewUrl: "#",
    playable: true,
    title: "Brand Trailer",
  },
];

/* ──────────────────────────────────────────────────────────────
 * Global "live video" slot manager
 *
 * Phones only have a few hardware video decoders. Instead of letting
 * every card run its own <video>, only MAX_LIVE cards in the whole
 * page may hold a mounted <video> at the same time. Everyone else
 * shows the poster image only. When a slot frees up, the next waiting
 * (visible) card gets it.
 * ────────────────────────────────────────────────────────────── */

const activeSlots = new Set<object>();
const waitingSlots = new Map<object, () => void>();

function getMaxLive(): number {
  if (typeof window === "undefined") return 0;

  // No video at all for people who asked for less motion / data.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  const conn = (navigator as any).connection;
  if (conn?.saveData) return 0;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const lowMemory = ((navigator as any).deviceMemory ?? 8) <= 2;

  // Firefox/cpu-lite: video decode is CPU-bound there — cut concurrent
  // decoders to a minimum (marquee still shows posters for the rest).
  if (
    document.documentElement.classList.contains("gpu-off") ||
    (window as any).__GPU_OFF__
  ) {
    return isTouch ? 1 : 2;
  }

  if (isTouch) return lowMemory ? 2 : 3;
  return lowMemory ? 3 : 6;
}

function isTouchDevice(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

/** Try to take a slot. If none is free, register as waiting. */
function requestSlot(token: object, onGranted: () => void): boolean {
  if (activeSlots.has(token)) return true;
  if (activeSlots.size < getMaxLive()) {
    activeSlots.add(token);
    waitingSlots.delete(token);
    return true;
  }
  waitingSlots.set(token, onGranted);
  return false;
}

/** Give a slot back (or stop waiting) and hand it to the next waiter. */
function releaseSlot(token: object) {
  waitingSlots.delete(token);
  const hadSlot = activeSlots.delete(token);
  if (!hadSlot) return;

  for (const [waiter, grant] of waitingSlots) {
    if (activeSlots.size >= getMaxLive()) break;
    waitingSlots.delete(waiter);
    activeSlots.add(waiter);
    grant();
  }
}

// Memoized so marquee re-renders / parent state churn don't re-create cards.
const WorkCard = memo(function WorkCard({
                                          item,
                                          onPlay,
                                          paused,
                                        }: {
  item: ShowcaseItem;
  onPlay: (item: ShowcaseItem) => void;
  paused?: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const token = useRef<object>({}).current;
  const [live, setLive] = useState(false);

  // Some items use the full-size video as their "preview". On touch
  // devices that is far too heavy, so those stay poster-only there.
  const hasLightPreview = useMemo(() => {
    if (!item.previewUrl) return false;
    if (item.previewUrl === item.videoUrl && isTouchDevice()) return false;
    return true;
  }, [item.previewUrl, item.videoUrl]);

  // Take a decoder slot only while the card is actually visible.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !hasLightPreview || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (requestSlot(token, () => setLive(true))) setLive(true);
          } else {
            releaseSlot(token);
            setLive(false);
          }
        },
        { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      releaseSlot(token);
    };
  }, [hasLightPreview, token]);

  // The <video> only exists while the card owns a slot AND nothing paused it.
  // Unmounting it frees the decoder + frame buffers (also while a modal is open).
  const showVideo = live && !paused && hasLightPreview;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.play().catch(() => {});

    return () => {
      v.pause();
      v.removeAttribute("src");
      v.load();
    };
  }, [showVideo]);

  return (
      <article
          ref={cardRef}
          className={`group relative shrink-0 overflow-hidden rounded-xl border border-[#188e9f]/70 sm:rounded-2xl w-[220px] h-[140px] sm:w-[280px] sm:h-[180px] lg:w-[320px] lg:h-[200px] ${
              item.playable ? "cursor-pointer" : ""
          }`}
          onClick={item.playable ? () => onPlay(item) : undefined}
      >
        {/* Poster is always present: cheap, and covers the video while it loads. */}
        <SmartImage
            src={item.src}
            alt={item.title || "Video"}
            decoding="async"
            loading="lazy"
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
            className="absolute inset-0 h-full w-full object-cover sm:transition-transform sm:duration-500 sm:group-hover:scale-105"
        />

        {showVideo && (
            <video
                ref={videoRef}
                src={item.previewUrl}
                poster={item.src}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                disablePictureInPicture
                className="absolute inset-0 h-full w-full object-cover sm:transition-transform sm:duration-500 sm:group-hover:scale-105"
            />
        )}
      </article>
  );
});

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
  const [items, setItems] = useState<ShowcaseItem[]>(FALLBACK_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ShowcaseItem | null>(null);
  const [inView, setInView] = useState(true);
  const [pageHidden, setPageHidden] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchVideos = async () => {
      try {
        const res: any = await httpService.post<any>("/portfolio/list?page=1&limit=60", {});
        if (cancelled) return;

        const rawList = res?.videos || [];
        const mapped: ShowcaseItem[] = [];
        const seenIds = new Set<number | string>();
        const seenVideos = new Set<string>();

        for (const v of rawList) {
          if (!v || seenIds.has(v.id)) continue;
          const videoPath = v.video || "";
          if (videoPath && seenVideos.has(videoPath)) continue;

          seenIds.add(v.id);
          if (videoPath) seenVideos.add(videoPath);

          const previewRaw = v.preview || v.video;
          const previewUrl = previewRaw
              ? (previewRaw.startsWith("http") ? previewRaw : `${import.meta.env.PUBLIC_API_URL}${previewRaw}`)
              : undefined;

          mapped.push({
            id: v.id,
            src: v.cover
                ? (v.cover.startsWith("http") ? v.cover : `${import.meta.env.PUBLIC_API_URL}${v.cover}`)
                : "/video-pieces/person.webp",
            videoUrl: videoPath
                ? (videoPath.startsWith("http") ? videoPath : `${import.meta.env.PUBLIC_API_URL}${videoPath}`)
                : "",
            previewUrl,
            playable: !!videoPath,
            title: v.category || "Video",
          });
        }

        if (mapped.length >= 6) {
          setItems(mapped.slice(0, 10));
        }
      } catch (err) {
        console.error("Failed to fetch showcase videos, using fallback", err);
      }
    };
    fetchVideos();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pause the marquee when the section is offscreen — no compositor work
  // while the user can't see it.
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

  const { row1, row2, playableList } = useMemo(() => {
    const r1: ShowcaseItem[] = [];
    const r2: ShowcaseItem[] = [];

    items.forEach((item, idx) => {
      if (idx % 2 === 0) {
        r1.push(item);
      } else {
        r2.push(item);
      }
    });

    // 3 copies (animation moves -33.333%) so wide screens never see a gap.
    // Cards are cheap now: only a few of them ever mount a <video>.
    return {
      row1: [...r1, ...r1, ...r1],
      row2: [...r2, ...r2, ...r2],
      playableList: items.filter((v) => v.playable),
    };
  }, [items]);

  // Any of these → freeze the CSS animation and unmount all live videos.
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
        }
        @media (min-width: 640px) {
          .track-left, .track-right { gap: 16px; }
        }
        .track-left {
          animation: scroll-left 50s linear infinite;
        }
        .track-right {
          animation: scroll-right 54s linear infinite;
        }
        /* Touch: slower scroll = fewer frames to composite per second. */
        @media (pointer: coarse) {
          .track-left { animation-duration: 62s; }
          .track-right { animation-duration: 66s; }
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
          animation-duration: 75s !important;
        }
        html.gpu-off .track-right {
          animation-duration: 80s !important;
        }
      `}</style>

        {/* ── Rows ── */}
        <div className={`mt-8 space-y-3 sm:mt-10 sm:space-y-4 ${marqueePaused ? "track-paused" : ""}`}>
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
                      paused={marqueePaused}
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
                      paused={marqueePaused}
                  />
              ))}
            </div>
          </div>
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