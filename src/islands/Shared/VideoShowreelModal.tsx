"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";

const formatTime = (time: number) => {
  if (!Number.isFinite(time) || time < 0) return "00:00";
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

const PlaylistThumb = memo(function PlaylistThumb({
  video,
  isActive,
  onSelect,
}: {
  video: any;
  isActive: boolean;
  onSelect: (v: any) => void;
}) {
  return (
    <button
      onClick={() => onSelect(video)}
      className={`group relative h-[70px] w-[120px] shrink-0 snap-center overflow-hidden rounded-[16px] transition-transform duration-300 ease-out sm:h-[100px] sm:w-[170px] md:h-[120px] md:w-[210px] ${
        isActive
          ? "z-10 scale-105 opacity-100 ring-2 ring-[#00A9BD] ring-offset-2 ring-offset-[#0A101D]"
          : "z-0 scale-95 opacity-60 ring-1 ring-white/10 hover:scale-100 hover:opacity-100 hover:ring-white/30"
      }`}
    >
      <img
        src={video.thumbnail || video.src}
        alt={video.title || "Video"}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {isActive && (
        <div className="absolute left-2 top-2 rounded bg-[#00A9BD] px-2 py-0.5 text-[8px] font-bold text-white shadow-md sm:text-[10px]">
          PLAYING
        </div>
      )}

      <div className="absolute bottom-2 left-2.5">
        <span
          className={`inline-block rounded-md px-2 py-1 text-[10px] font-semibold sm:text-xs ${
            isActive ? "bg-transparent text-white" : "bg-white/20 text-white/90 backdrop-blur-md group-hover:bg-[#00A9BD]/80 group-hover:text-white"
          }`}
        >
          {video.title}
        </span>
      </div>
    </button>
  );
});

export const VideoShowreelModal = ({ isOpen, onClose, videoList = [], initialVideo, hideControls: hideControlsProp = false, defaultOpenPlaylist = false }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mouseMoveRafRef = useRef(0);
  const lastTimeTextRef = useRef<HTMLSpanElement>(null);
  const isCoarse = useCoarsePointer();

  const [activeVideo, setActiveVideo] = useState<any>(initialVideo || videoList[0] || {});

  useEffect(() => {
    if (initialVideo) {
      setActiveVideo(initialVideo);
    }
  }, [initialVideo]);

  const [isPlaying, setIsPlaying] = useState(false);
  // Time text updates at most once per second (not per timeupdate).
  const [timeLabel, setTimeLabel] = useState("00:00");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(defaultOpenPlaylist);
  // On touch devices controls stay visible — no mouse to re-show them and
  // hiding/showing forces expensive repaints over the video layer.
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    if (isOpen && defaultOpenPlaylist) setShowPlaylist(true);
  }, [isOpen, defaultOpenPlaylist]);

  // قفل اسکرول صفحه
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev || "unset"; };
  }, [isOpen]);

  // Escape closes.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const stateRef = useRef({ isPlaying: false, showPlaylist: defaultOpenPlaylist });
  stateRef.current.isPlaying = isPlaying;
  stateRef.current.showPlaylist = showPlaylist;

  // Play the new source when it changes. `key` on <video> already forces a
  // fresh element per URL, so here we only handle the autoplay promise
  // honestly instead of optimistically setting isPlaying = true (which
  // desyncs the big center icon on mobile where autoplay-with-sound is
  // blocked).
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    setTimeLabel("00:00");
    setDuration(0);
    if (progressBarRef.current) progressBarRef.current.style.width = "0%";
    const v = videoRef.current;
    const p = v.play();
    if (p && typeof (p as Promise<void>).then === "function") {
      (p as Promise<void>)
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
    }
  }, [activeVideo, isOpen]);

  // Cleanup pending timers/rAF on unmount.
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
      if (mouseMoveRafRef.current) cancelAnimationFrame(mouseMoveRafRef.current);
    };
  }, []);

  // محو شدن خودکار کنترل‌ها — rAF-throttled, desktop pointer only.
  // Hiding is handled by the effect below so this never closes over stale state.
  const handleMouseMove = useCallback(() => {
    if (isCoarse) return;
    if (mouseMoveRafRef.current) return;
    mouseMoveRafRef.current = requestAnimationFrame(() => {
      mouseMoveRafRef.current = 0;
      setControlsVisible(true);
      // Reset the auto-hide timer on every (throttled) move.
      if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
      hideControlsTimeoutRef.current = setTimeout(() => {
        const s = stateRef.current;
        if (s.isPlaying && !s.showPlaylist) setControlsVisible(false);
      }, 3000);
    });
  }, [isCoarse]);

  // Separate effect applies the actual auto-hide so we can read isPlaying
  // without stale closures.
  useEffect(() => {
    if (!controlsVisible || !isPlaying || showPlaylist || isCoarse) return;
    hideControlsTimeoutRef.current = setTimeout(() => setControlsVisible(false), 3000);
    return () => {
      if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
    };
  }, [controlsVisible, isPlaying, showPlaylist, isCoarse]);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  // Hot path: runs ~4×/s. Updates the bar via direct DOM mutation (zero
  // React re-renders) and the time label at most once per second.
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const pct = (v.currentTime / v.duration) * 100;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${pct}%`;
    }
    const label = formatTime(v.currentTime);
    // Avoid setState unless the displayed second actually changed.
    if (lastTimeTextRef.current?.textContent !== label) {
      setTimeLabel(label);
    }
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current && progressRef.current && Number.isFinite(videoRef.current.duration)) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  }, []);

  const handleClose = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    setIsPlaying(false);
    onCloseRef.current();
  }, []);

  const handleSelectVideo = useCallback((video: any) => {
    setActiveVideo(video);
    setShowPlaylist(false);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  if (!isOpen) return null;

  const videoKey = activeVideo?.videoUrl || activeVideo?.id || "empty";
  // Touch: strip every backdrop-blur + giant glow shadow. Blurring behind/
  // above a playing <video> forces the mobile GPU to re-blur each frame.
  const backdropClass = isCoarse ? "bg-[#020610]/90" : "bg-[#020610]/85 backdrop-blur-md";
  const containerShadow = isCoarse
    ? "shadow-2xl"
    : "shadow-[0_0_100px_rgba(0,169,189,0.2)]";
  const playlistCardClass = isCoarse
    ? "bg-[#0A101D]/95 border border-white/15"
    : "bg-[#0A101D]/80 backdrop-blur-3xl border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 font-sans sm:p-4 md:p-8"
      onMouseMove={isCoarse ? undefined : handleMouseMove}
      onMouseLeave={isCoarse ? undefined : () => setControlsVisible(false)}
      onTouchStart={isCoarse ? () => setControlsVisible(true) : undefined}
    >
      {/* Backdrop (پس‌زمینه کل مودال) */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 transition-opacity duration-300 ${backdropClass}`}
      />

      {/* Modal Container */}
      <div
        className={`relative flex aspect-[16/9] h-auto max-h-[90vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[20px] bg-[#050505] ring-1 ring-white/10 sm:rounded-[24px] ${containerShadow}`}
      >
        {/* دکمه بستن (ریس‌پانسیو شده) */}
        {controlsVisible && (
          <button
            onClick={handleClose}
            aria-label="Close video"
            className="absolute right-3 top-3 z-50 rounded-full border border-white/10 bg-black/50 p-2 text-white/70 shadow-lg transition-transform hover:scale-110 hover:bg-white/20 hover:text-white sm:right-6 sm:top-6 sm:p-3"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Video Player — key forces a clean element per source so the old
            stream is dropped immediately instead of morphing mid-decode. */}
        <video
          key={videoKey}
          ref={videoRef}
          src={activeVideo.videoUrl}
          className="absolute inset-0 h-full w-full cursor-pointer object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          playsInline
          preload="metadata"
          disablePictureInPicture={false}
        />

        {/* لایه تاریک‌کننده روی ویدیو (فقط وقتی پلی‌لیست بازه) — plain bg,
            no blur: blur over video is the #1 mobile frame-drop cause. */}
        {showPlaylist && (
          <div
            onClick={() => setShowPlaylist(false)}
            className="absolute inset-0 z-20 cursor-pointer bg-black/60"
          />
        )}

        {/* نشانگر Play وسط صفحه */}
        {!isPlaying && !showPlaylist && (
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 pl-1.5 text-white shadow-2xl sm:h-24 sm:w-24 sm:pl-2">
              <svg className="h-8 w-8 sm:h-10 sm:w-10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
            </div>
          </div>
        )}

        {/* Playlist Overlay */}
        {showPlaylist && (
          <div
            className="absolute bottom-16 left-0 z-40 w-full px-2 sm:bottom-24 sm:px-6"
          >
            <div className={`w-full rounded-[24px] p-3 sm:p-5 ${playlistCardClass}`}>
              <div className="mb-1 flex items-center justify-between px-2 sm:mb-2">
                <h3 className="text-sm font-bold tracking-wide text-white sm:text-base">More Videos</h3>
                <button onClick={() => setShowPlaylist(false)} className="text-xs font-semibold uppercase tracking-wider text-white/50 transition-colors hover:text-[#00A9BD] sm:text-sm">
                  Close
                </button>
              </div>

              <div className="scrollbar-hide -mx-2 flex w-full snap-x items-center gap-3 overflow-x-auto px-2 py-4 sm:gap-4">
                {videoList.map((video) => (
                  <PlaylistThumb
                    key={video.id}
                    video={video}
                    isActive={activeVideo.id === video.id}
                    onSelect={handleSelectVideo}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom Controls Bar — hidden when hideControls */}
        {controlsVisible && !hideControlsProp && (
          <div
            className="absolute bottom-0 left-0 z-30 flex w-full flex-col gap-3 bg-gradient-to-t from-black via-black/80 to-transparent px-3 py-3 transition-opacity duration-200 sm:gap-4 sm:px-6 sm:py-6"
          >
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="group relative h-1 w-full cursor-pointer rounded-full bg-white/20 transition-[height] hover:h-2 sm:h-1.5 sm:hover:h-2.5"
              onClick={handleSeek}
            >
              <div
                ref={progressBarRef}
                className="absolute left-0 top-0 h-full rounded-full bg-[#00A9BD]"
                style={{ width: "0%" }}
              >
                <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 scale-0 rounded-full bg-white shadow-[0_0_10px_white] transition-transform group-hover:scale-100 sm:h-4 sm:w-4" />
              </div>
            </div>

            {/* Buttons & Time */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3 sm:gap-6">
                {/* Play/Pause */}
                <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="text-white transition-transform hover:scale-110 hover:text-[#00A9BD]">
                  {isPlaying ? (
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="2" /><rect x="14" y="4" width="4" height="16" rx="2" /></svg>
                  ) : (
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                  )}
                </button>

                {/* Mute/Unmute */}
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="text-white/80 transition-transform hover:scale-110 hover:text-white"
                >
                  {isMuted ? (
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                  ) : (
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                  )}
                </button>

                {/* Time Display — updated ≤1×/s */}
                <div className="font-mono text-[10px] text-white/60 sm:text-xs">
                  <span ref={lastTimeTextRef}>{timeLabel}</span> / <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Title & Playlist Toggle */}
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="hidden max-w-[200px] truncate text-xs font-medium text-white/70 sm:inline-block">
                  {activeVideo.title}
                </span>

                {videoList.length > 1 && (
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      showPlaylist ? "bg-[#00A9BD] text-white" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
