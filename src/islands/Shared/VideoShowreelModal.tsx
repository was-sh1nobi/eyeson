"use client";

import React, { useEffect, useRef, useState } from "react";

type VideoCategory = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  views?: string;
  price?: string;
};

const formatTime = (time: number) => {
  if (isNaN(time)) return "00:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  videoList?: any[];
  initialVideo?: any;
  hideControls?: boolean;
  defaultOpenPlaylist?: boolean;
};

export const VideoShowreelModal = ({ isOpen, onClose, videoList = [], initialVideo, hideControls: hideControlsProp = false, defaultOpenPlaylist = false }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeVideo, setActiveVideo] = useState<any>(initialVideo || videoList[0] || {});
  
  useEffect(() => {
    if (initialVideo) {
      setActiveVideo(initialVideo);
    }
  }, [initialVideo]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(defaultOpenPlaylist);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    if (isOpen && defaultOpenPlaylist) setShowPlaylist(true);
  }, [isOpen, defaultOpenPlaylist]);

  // قفل اسکرول صفحه
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // ریست کردن ویدیو با تغییر آهنگ
  useEffect(() => {
    if (videoRef.current && isOpen) {
      videoRef.current.play().catch(() => console.log("Autoplay prevented"));
      setIsPlaying(true);
      setProgress(0);
    }
  }, [activeVideo, isOpen]);

  // محو شدن خودکار کنترل‌ها
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showPlaylist) setControlsVisible(false);
    }, 3000);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleClose = () => {
    if (videoRef.current) videoRef.current.pause();
    setIsPlaying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8 font-sans animate-fade-in"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setControlsVisible(false)}
    >
      {/* Backdrop (پس‌زمینه کل مودال) */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-[#020610]/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div
        className="relative flex h-auto max-h-[90vh] w-full max-w-[1200px] aspect-[16/9] flex-col overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#050505] shadow-[0_0_100px_rgba(0,169,189,0.2)] ring-1 ring-white/10 animate-scale-up"
      >
        {/* دکمه بستن (ریس‌پانسیو شده) */}
        {controlsVisible && (
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 sm:right-6 sm:top-6 z-50 rounded-full bg-black/30 p-2 sm:p-3 text-white/70 backdrop-blur-xl border border-white/10 transition-all hover:bg-white/20 hover:text-white hover:scale-110 shadow-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Video Player */}
        <video
          ref={videoRef}
          src={activeVideo.videoUrl}
          className="absolute inset-0 h-full w-full object-contain cursor-pointer"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          playsInline
        />

        {/* لایه تاریک‌کننده روی ویدیو (فقط وقتی پلی‌لیست بازه) */}
        {showPlaylist && (
          <div
            onClick={() => setShowPlaylist(false)}
            className="absolute inset-0 z-20 cursor-pointer bg-black/60 backdrop-blur-[3px] transition-opacity duration-300"
          />
        )}

        {/* نشانگر Play وسط صفحه */}
        {!isPlaying && !showPlaylist && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center z-10 animate-fade-in"
          >
            <div className="flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white pl-1.5 sm:pl-2">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
            </div>
          </div>
        )}

        {/* Playlist Overlay */}
        {showPlaylist && (
          <div
            className="absolute bottom-16 sm:bottom-24 left-0 w-full px-2 sm:px-6 z-40 animate-slide-up"
          >
            <div className="w-full rounded-[24px] bg-[#0A101D]/80 backdrop-blur-3xl border border-white/15 p-3 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between mb-1 sm:mb-2 px-2">
                <h3 className="text-white text-sm sm:text-base font-bold tracking-wide">More Videos</h3>
                <button onClick={() => setShowPlaylist(false)} className="text-white/50 hover:text-[#00A9BD] text-xs sm:text-sm transition-colors uppercase tracking-wider font-semibold">
                  Close
                </button>
              </div>
              
              <div className="flex w-full gap-3 sm:gap-4 overflow-x-auto py-4 px-2 -mx-2 scrollbar-hide snap-x items-center">
                {videoList.map((video) => {
                  const isActive = activeVideo.id === video.id;
                  return (
                    <button
                      key={video.id}
                      onClick={() => { setActiveVideo(video); setShowPlaylist(false); }}
                      className={`group relative h-[70px] w-[120px] sm:h-[100px] sm:w-[170px] md:h-[120px] md:w-[210px] shrink-0 snap-center overflow-hidden rounded-[16px] transition-all duration-300 ease-out ${
                        isActive
                          ? "ring-2 ring-[#00A9BD] ring-offset-2 ring-offset-[#0A101D] scale-105 opacity-100 shadow-[0_0_25px_rgba(0,169,189,0.5)] z-10"
                          : "scale-95 opacity-60 hover:opacity-100 hover:scale-100 ring-1 ring-white/10 hover:ring-white/30 z-0"
                      }`}
                    >
                        <img src={video.thumbnail || video.src} alt={video.title || "Video"} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        
                        {isActive && (
                          <div className="absolute top-2 left-2 bg-[#00A9BD] text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded animate-pulse shadow-md">
                            PLAYING
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2.5">
                          <span className={`inline-block rounded-md px-2 py-1 text-[10px] sm:text-xs font-semibold backdrop-blur-md transition-colors ${
                            isActive ? "bg-transparent text-white" : "bg-white/20 text-white/90 group-hover:bg-[#00A9BD]/80 group-hover:text-white"
                          }`}>
                            {video.title}
                          </span>
                        </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Custom Controls Bar — hidden when hideControls */}
        {controlsVisible && !hideControlsProp && (
          <div
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent px-3 py-3 sm:px-6 sm:py-6 z-30 flex flex-col gap-3 sm:gap-4 transition-opacity duration-200"
          >
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              className="group relative h-1 sm:h-1.5 w-full cursor-pointer rounded-full bg-white/20 overflow-visible transition-all hover:h-2 sm:hover:h-2.5"
              onClick={handleSeek}
            >
              <div 
                className="absolute left-0 top-0 h-full rounded-full bg-[#00A9BD] shadow-[0_0_15px_#00A9BD] transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 translate-x-1/2 scale-0 rounded-full bg-white transition-transform group-hover:scale-100 shadow-[0_0_10px_white]" />
              </div>
            </div>

            {/* Buttons & Time */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3 sm:gap-6">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="text-white hover:text-[#00A9BD] transition-all hover:scale-110">
                  {isPlaying ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="2" /><rect x="14" y="4" width="4" height="16" rx="2" /></svg>
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                  )}
                </button>

                {/* Mute/Unmute */}
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }} 
                  className="text-white/80 hover:text-white transition-all hover:scale-110"
                >
                  {isMuted ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                  )}
                </button>

                {/* Time Display */}
                <div className="text-[10px] sm:text-xs font-mono text-white/60">
                  <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Title & Playlist Toggle */}
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="hidden sm:inline-block text-xs text-white/70 font-medium max-w-[200px] truncate">
                  {activeVideo.title}
                </span>

                {videoList.length > 1 && (
                  <button 
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
                      showPlaylist ? "bg-[#00A9BD] text-white" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    <span>Playlist</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
