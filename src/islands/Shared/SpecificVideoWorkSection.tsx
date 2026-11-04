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

const activeSlots = new Set<object>();
const waitingSlots = new Map<object, () => void>();

function getMaxLive(): number {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  const conn = (navigator as any).connection;
  if (conn?.saveData) return 0;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const lowMemory = ((navigator as any).deviceMemory ?? 8) <= 2;

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

  const hasLightPreview = useMemo(() => {
    if (!item.previewUrl) return false;
    if (isTouchDevice()) return false;
    return true;
  }, [item.previewUrl]);

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

const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border border-[#188e9f]/40 bg-white/[0.04] animate-pulse w-[220px] h-[140px] sm:w-[280px] sm:h-[180px] lg:w-[320px] lg:h-[200px]" />
  );
});

type SpecificVideoWorkSectionProps = {
  category?: string;
  fadeColor?: string;
  sectionClassName?: string;
  title?: string;
  eyebrow?: string | null;
  highlight?: string | null;
  description?: string;
};

export default function SpecificVideoWorkSection({
  category,
  fadeColor = "#030d18",
  sectionClassName = "",
  title,
  eyebrow,
  highlight,
  description,
}: SpecificVideoWorkSectionProps) {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ShowcaseItem | null>(null);
  const [inView, setInView] = useState(true);
  const [pageHidden, setPageHidden] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const payload: any = {};
        if (category && category !== "All") {
          payload.category = category;
        }

        const res: any = await httpService.post<any>("/portfolio/list?page=1&limit=60", payload);
        if (cancelled) return;

        let rawList = res?.videos || [];

        // If backend returned nothing with strict category, try fetching all and filtering client-side
        if (rawList.length === 0 && category && category !== "All") {
          try {
            const allRes: any = await httpService.post<any>("/portfolio/list?page=1&limit=60", {});
            if (!cancelled && allRes?.videos?.length) {
              const catLower = category.toLowerCase().trim();
              const matched = allRes.videos.filter((v: any) =>
                (v.category || "").toLowerCase().includes(catLower)
              );
              if (matched.length > 0) {
                rawList = matched;
              }
            }
          } catch {
            // keep empty
          }
        }

        const mapped: ShowcaseItem[] = [];
        const seenIds = new Set<number | string>();
        const seenVideos = new Set<string>();

        for (const v of rawList) {
          if (!v || seenIds.has(v.id)) continue;
          const videoPath = v.video || "";
          if (videoPath && seenVideos.has(videoPath)) continue;

          seenIds.add(v.id);
          if (videoPath) seenVideos.add(videoPath);

          const previewRaw = v.preview;
          // Previews must not be their own main video URL
          const previewUrl =
            previewRaw && previewRaw !== v.video
              ? previewRaw.startsWith("http")
                ? previewRaw
                : `${import.meta.env.PUBLIC_API_URL}${previewRaw}`
              : undefined;

          mapped.push({
            id: v.id,
            src: v.cover
              ? v.cover.startsWith("http")
                ? v.cover
                : `${import.meta.env.PUBLIC_API_URL}${v.cover}`
              : "/video-pieces/person.webp",
            videoUrl: videoPath
              ? videoPath.startsWith("http")
                ? videoPath
                : `${import.meta.env.PUBLIC_API_URL}${videoPath}`
              : "",
            previewUrl,
            playable: !!videoPath,
            title: v.category || "Video",
          });
        }

        setItems(mapped);
      } catch (err) {
        console.error("Failed to fetch specific showcase videos", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchVideos();
    return () => {
      cancelled = true;
    };
  }, [category]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const handlePlay = (item: ShowcaseItem) => {
    setSelectedVideo(item);
    setIsModalOpen(true);
  };

  const { row, playableList } = useMemo(() => {
    if (!items || items.length === 0) {
      return { row: [], playableList: [] };
    }

    let base = items;
    while (base.length < 5) {
      base = [...base, ...items];
    }

    return {
      row: [...base, ...base, ...base],
      playableList: items.filter((v) => v.playable),
    };
  }, [items]);

  const marqueePaused = !inView || pageHidden || isModalOpen;

  // If loading finished and no items were found, hide section
  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-20 lg:py-10 ${sectionClassName}`}
    >
      {title ? (
        <div className="mx-auto max-w-7xl mb-6 sm:mb-8">
          <div className="mx-auto max-w-3xl text-center">
            {eyebrow ? (
              <p className="text-[10px] tracking-[0.18em] text-[#c6d6de] sm:text-xs">{eyebrow}</p>
            ) : null}
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
              {highlight ? (
                <>
                  <br />
                  <span className="text-[#35d2cc]">{highlight}</span>
                </>
              ) : null}
            </h2>
            {description ? (
              <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-[#c5d7e0] sm:mt-5 sm:text-sm sm:leading-7">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ── CSS Keyframes ── */}
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        .track-left {
          display: flex;
          width: max-content;
          gap: 12px;
          will-change: transform;
          transform: translateZ(0);
          animation: scroll-left 50s linear infinite;
        }
        @media (min-width: 640px) {
          .track-left { gap: 16px; }
        }
        @media (pointer: coarse) {
          .track-left { animation-duration: 62s; }
        }
        @media (hover: hover) and (pointer: fine) {
          .track-left:hover {
            animation-play-state: paused;
          }
        }
        .track-paused .track-left {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .track-left { animation: none; }
        }
        html.reduce-motion .track-left {
          animation: none !important;
        }
        html.gpu-off .track-left {
          animation-duration: 75s !important;
        }
      `}</style>

      {/* ── Single Row ── */}
      <div className={`relative w-full overflow-hidden ${marqueePaused ? "track-paused" : ""}`}>
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

        {loading ? (
          <div className="flex gap-3 sm:gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`sk-${i}`} />
            ))}
          </div>
        ) : (
          <div className="track-left">
            {row.map((item, idx) => (
              <WorkCard
                key={`row-${item.id}-${idx}`}
                item={item}
                onPlay={handlePlay}
                paused={marqueePaused}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Player */}
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

export { SpecificVideoWorkSection };
