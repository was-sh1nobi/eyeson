"use client";

import { useMemo, useState, useEffect, useRef, memo } from "react";
import { VideoShowreelModal } from "./VideoShowreelModal";
import { SmartImage } from "../../utils/SmartImage.tsx";

type PortfolioKey = "Video" | "Animation" | "Industries";

type MediaItem = {
  id: number | string;
  src: string;
  videoUrl?: string;
  previewUrl?: string;
  playable?: boolean;
  title?: string;
  category?: string;
};

type MediaGridProps = {
  mediaType: PortfolioKey;
  items: MediaItem[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  pageSize?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
};

function PlaySvgButton() {
  return (
    <svg
      width="54"
      height="60"
      viewBox="0 0 69 78"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer transition-[transform,filter] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(72,235,214,0.6)]"
      aria-hidden
    >
      <path
        d="M66 33.7218C70 36.0312 70 41.8047 66 44.1141L9 77.0231C5 79.3325 0 76.4457 0 71.8269V6.009C0 1.3902 5 -1.49655 9 0.812852L66 33.7218Z"
        fillOpacity="0.85"
        className="transition-opacity duration-300 ease-out"
      />
    </svg>
  );
}

const MediaGridSkeleton = memo(function MediaGridSkeleton() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-cyan-300/10 bg-[#071B2A]/90 shadow-lg">
      {/* Shimmer sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />

      {/* Category Pill Skeleton */}
      <div className="absolute top-3.5 left-3.5 h-6 w-24 rounded-full bg-white/[0.06] border border-white/5 animate-pulse" />

      {/* Center Play Button Skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-13 h-13 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center shadow-inner">
          <div className="w-0 h-0 ml-1 border-t-[8px] border-t-transparent border-l-[13px] border-l-white/20 border-b-[8px] border-b-transparent" />
        </div>
      </div>

      {/* Bottom Title Skeleton */}
      <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-black/60 to-transparent flex flex-col gap-2">
        <div className="h-4 w-3/5 rounded-full bg-white/10 animate-pulse" />
      </div>
    </div>
  );
});

const MediaGridCard = memo(function MediaGridCard({
  item,
  mediaType,
  onPlay,
}: {
  item: MediaItem;
  mediaType: PortfolioKey;
  onPlay: (item: MediaItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (!item.previewUrl) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={item.title || `${mediaType} item`}
      className="group relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-cyan-300/20 bg-gradient-to-r from-[#0B1F2A] to-[#003A43] shadow-lg cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan-400/60 hover:shadow-[0_18px_42px_-10px_rgba(0,230,215,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      onClick={() => onPlay(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPlay(item);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SmartImage
        src={item.src}
        alt={item.title || mediaType}
        fill
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
          isHovered && item.previewUrl ? "opacity-0 scale-100" : "opacity-100 group-hover:scale-105"
        }`}
      />

      {item.previewUrl && isHovered && (
        <video
          ref={videoRef}
          src={item.previewUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover z-5"
          onCanPlay={(e) => {
            const p = (e.currentTarget as HTMLVideoElement).play();
            if (p) p.catch(() => {});
          }}
        />
      )}

      {/* Category / Type badge */}
      {item.category && (
        <div className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-cyan-300 tracking-wider uppercase transition-transform duration-300 group-hover:scale-105 shadow-sm">
          {item.category}
        </div>
      )}

      {/* Play button overlay */}
      {item.playable && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 ${
            isHovered && item.previewUrl
              ? "opacity-0 pointer-events-none"
              : "bg-black/20 group-hover:bg-black/35 backdrop-blur-[1px] group-hover:backdrop-blur-[2px]"
          }`}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-cyan-400/0 blur-xl transition-all duration-300 group-hover:bg-cyan-400/25 group-hover:scale-150" />
            <PlaySvgButton />
          </div>
        </div>
      )}

      {/* Bottom Title overlay */}
      {item.title && (
        <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 flex items-end justify-between transition-opacity duration-300">
          <p className="text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-cyan-200 transition-colors">
            {item.title}
          </p>
        </div>
      )}
    </div>
  );
});

export const MediaGrid = ({
  mediaType,
  items,
  categories,
  selectedCategory,
  onSelectCategory,
  pageSize = 9,
  page: externalPage,
  totalPages: externalTotalPages,
  onPageChange,
  isLoading = false,
}: MediaGridProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const effectivePageSize = isMobile ? 5 : pageSize;
  const [internalPage, setInternalPage] = useState<number>(1);

  const page = externalPage ?? internalPage;
  const totalPages = externalTotalPages ?? Math.max(1, Math.ceil(items.length / effectivePageSize));
  const pageStartIndex = (page - 1) * effectivePageSize;

  const paginatedItems = useMemo(() => {
    if (externalPage !== undefined) return items;
    return items.slice(pageStartIndex, pageStartIndex + effectivePageSize);
  }, [items, pageStartIndex, effectivePageSize, externalPage]);

  const placeholderText = selectedCategory === "All"
    ? `No ${mediaType.toLowerCase()} posts yet`
    : `No ${selectedCategory.toLowerCase()} posts yet`;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || isLoading) return;
    if (onPageChange) {
      onPageChange(p);
    } else {
      setInternalPage(p);
    }
  };

  useEffect(() => {
    if (externalPage === undefined) setInternalPage(1);
  }, [items, mediaType, effectivePageSize, externalPage]);

  useEffect(() => {
    if (externalPage === undefined && internalPage > totalPages) setInternalPage(totalPages);
  }, [internalPage, totalPages, externalPage]);

  const handlePlayClick = (item: MediaItem) => {
    if (item.playable) {
      setSelectedVideo(item);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="relative w-full overflow-hidden px-2 sm:px-0">
        {/* Categories with hover and active states */}
        <div className="mx-auto mt-8 flex w-full max-w-7xl flex-wrap items-center justify-center gap-2 px-4 sm:gap-3">
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                disabled={isLoading}
                className={`relative rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020915] active:scale-95 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-[#22D5D2] bg-gradient-to-r from-[#00A9BD] to-[#0FC7C1] text-white shadow-[0_0_20px_rgba(34,213,210,0.4)] scale-[1.03]"
                    : "border-white/10 bg-[#082233]/70 text-white/75 hover:border-cyan-400/40 hover:bg-[#0c2f45] hover:text-white hover:scale-[1.03] hover:shadow-[0_4px_16px_rgba(0,169,189,0.15)]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* GRID: Skeletons when loading, cards when loaded */}
        <div className="relative z-10 mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-5 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: effectivePageSize }).map((_, idx) => (
              <MediaGridSkeleton key={`skeleton-${idx}`} />
            ))
          ) : paginatedItems.length > 0 ? (
            paginatedItems.map((item, idx) => (
              <MediaGridCard
                key={`${item.id}-${idx}`}
                item={item}
                mediaType={mediaType}
                onPlay={handlePlayClick}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center px-4 rounded-[24px] border border-dashed border-[#1E5265]/60 bg-[#071B2A]/40 my-4">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-3 text-cyan-400 shadow-[0_0_20px_rgba(0,230,215,0.15)]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-base font-semibold text-white/90">{placeholderText}</p>
              <p className="text-xs text-white/50 mt-1">Try selecting another category or check back later.</p>
            </div>
          )}
        </div>

        {/* PAGINATION with hover micro-interactions */}
        {totalPages > 1 && (
          <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 pb-8">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1 || isLoading}
              className="rounded-xl border border-white/10 bg-[#071B2A] px-4 py-2 text-sm font-medium text-white/80 transition-all duration-200 cursor-pointer hover:border-cyan-400/40 hover:bg-[#0c2f45] hover:text-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-white/10 disabled:hover:bg-[#071B2A] disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const num = idx + 1;
              const isCurrent = page === num;
              return (
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  disabled={isLoading}
                  className={`min-w-[40px] rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                    isCurrent
                      ? "border-[#1ED8D1] bg-[#0E3E52] text-white shadow-[0_0_15px_rgba(30,216,209,0.35)] scale-105"
                      : "border-white/10 bg-[#071B2A] text-white/70 hover:border-cyan-400/40 hover:bg-[#0c2f45] hover:text-white hover:scale-105"
                  }`}
                >
                  {num}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages || isLoading}
              className="rounded-xl border border-transparent bg-gradient-to-r from-[#00A9BD] to-[#0FC7C1] px-4 py-2 text-sm font-medium text-white transition-all duration-200 cursor-pointer hover:shadow-[0_0_20px_rgba(0,230,215,0.35)] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoShowreelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoList={items.filter((v) => v.playable)}
          initialVideo={selectedVideo}
        />
      )}
    </>
  );
};
