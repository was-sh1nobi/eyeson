"use client";

import { useState } from "react";
import { SmartImage } from "../../utils/SmartImage.tsx";
import { VideoShowreelModal } from "../Shared/VideoShowreelModal.tsx";
// آدرس ایمپورت رو با فایلی که تو پیام قبلی دادم هماهنگ کن

type PlayableMediaFrameProps = {
  vidLink?: string | null;
  imgUrl: string;
  playable: boolean;
  alt?: string;
  className?: string;
};

function PlaySvgButton() {
  return (
    <svg
      width="69"
      height="78"
      viewBox="0 0 69 78"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer transition-[transform,filter] duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:drop-shadow-[0_0_24px_rgba(0,169,189,0.8)]"
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

export function PlayableMediaFrame({
  vidLink = null,
  imgUrl,
  playable,
  alt = "Media preview",
  className = "",
}: PlayableMediaFrameProps) {
  // مدیریت استیت (وضعیت) باز و بسته شدن مودال
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className={`group relative h-[320px] overflow-hidden rounded-[24px] border border-white/10 shadow-2xl md:h-[460px] ${className}`.trim()}
      >
        <SmartImage
          src={imgUrl}
          alt={alt}
          fill
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* مودال پخش ویدیو (فایلی که تو پیام قبلی برات ساختم) */}
      <VideoShowreelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
