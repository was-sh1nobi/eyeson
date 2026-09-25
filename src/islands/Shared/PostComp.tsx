"use client";

import { useMemo, useState, useEffect } from "react";
import { VideoShowreelModal } from "./VideoShowreelModal"; // آدرس این کامپوننت رو درست تنظیم کن
import { SmartImage } from "../../utils/SmartImage.tsx";

type PortfolioKey = "Video" | "Animation" | "Industries";

// استراکچر آیتم رو تغییر دادم تا ویدیو اصلی و لیست ویدیوها رو ساپورت کنه
type MediaItem = {
  id: number | string;
  src: string;        // عکس تامنیل گالری
  videoUrl?: string;  // لینک ویدیوی اصلی
  playable?: boolean;
  title?: string;     // برای پلیر کاستوم
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

// همون دکمه پلی که خودت نوشته بودی
function PlaySvgButton() {
  return (
    <svg
      width="54"
      height="60"
      viewBox="0 0 69 78"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer transition-[transform,filter] duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:drop-shadow-[0_0_16px_rgba(72,235,214,0.45)]"
      aria-hidden
    >
      <path
        d="M66 33.7218C70 36.0312 70 41.8047 66 44.1141L9 77.0231C5 79.3325 0 76.4457 0 71.8269V6.009C0 1.3902 5 -1.49655 9 0.812852L66 33.7218Z"
        fillOpacity="0.8"
        className="transition-opacity duration-300 ease-out"
      />
    </svg>
  );
}

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
  
  // برای اینکه مودال بدونه باید با کدوم ویدیو باز بشه و لیست ویدیوهای مرتبط چی هست
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

  // detect mobile
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
    if (externalPage !== undefined) return items; // Backend already paginated
    return items.slice(pageStartIndex, pageStartIndex + effectivePageSize);
  }, [items, pageStartIndex, effectivePageSize, externalPage]);

  const placeholderCount = Math.max(0, effectivePageSize - paginatedItems.length);
  const placeholderText = selectedCategory === "All"
    ? `No ${mediaType.toLowerCase()} posts yet`
    : `No ${selectedCategory.toLowerCase()} posts yet`;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
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

  // وقتی روی دکمه پلی کلیک شد
  const handlePlayClick = (item: MediaItem) => {
    if (item.playable) {
      setSelectedVideo(item);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="relative w-full overflow-x-hidden overflow-y-hidden px-2 sm:px-0">
        {/* Categories */}
        <div className="mx-auto mt-8 flex w-full max-w-7xl flex-wrap items-center justify-center gap-2 px-4">
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`rounded-full border px-4 py-2 text-xs transition sm:text-sm ${
                  isActive
                    ? "border-[#22D5D2] bg-[#0FC7C1] text-white"
                    : "border-white/15 bg-[#082233] text-white/85 hover:border-white/25"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* GRID */}
        <div className="relative z-10 mx-auto mt-6 grid w-full max-w-7xl grid-cols-1 gap-4 px-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
             <div className="col-span-full flex justify-center py-12">
               <div className="w-8 h-8 border-4 border-[#00E6D7] border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : paginatedItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="group relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-cyan-300/20 bg-gradient-to-r from-[#0B1F2A] to-[#003A43] shadow-lg cursor-pointer"
              onClick={() => handlePlayClick(item)} // با کلیک روی کل باکس هم باز بشه
            >
              {/* عکس گالری */}
              <SmartImage
                src={item.src}
                alt={mediaType}
                fill
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              
              {/* دکمه پلی */}
              {item.playable && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 transition-colors duration-500 group-hover:bg-black/30 backdrop-blur-[1px] group-hover:backdrop-blur-[2px]">
                   <PlaySvgButton />
                </div>
              )}
            </div>
          ))}

          {/* Placeholders */}
          {!isLoading && Array.from({ length: placeholderCount }).map((_, idx) => (
            <div
              key={`placeholder-${pageStartIndex + idx}`}
              className="flex aspect-[16/10] w-full items-center justify-center rounded-[24px] border border-dashed border-[#1E5265] bg-[#071B2A]/70 px-4 text-center text-sm text-white/65"
            >
              {placeholderText}
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 pb-8">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="rounded-lg border border-[#1E5265] bg-[#071B2A] px-3 py-2 text-sm text-white/90 disabled:opacity-40 sm:px-4"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const num = idx + 1;
            return (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  page === num
                    ? "border-[#1ED8D1] bg-[#082F42] text-white"
                    : "border-[#1E5265] bg-[#071B2A] text-white/80 hover:bg-[#1E5265]"
                }`}
              >
                {num}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="rounded-lg border border-[#1E5265] bg-[#0BA7C1] px-3 py-2 text-sm text-white disabled:opacity-40 sm:px-4 hover:bg-[#0FC7C1]"
          >
            Next
          </button>
        </div>
      </div>

      {/* 
        מודال اختصاصی شما
        وقتی باز میشه، اطلاعات ویدیو انتخاب شده بهش پاس داده میشه تا بدونه کدوم ویدیو رو لود کنه 
      */}
      {selectedVideo && (
        <VideoShowreelModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          videoList={items.filter(v => v.playable)}
          initialVideo={selectedVideo}
        />
      )}
    </>
  );
};