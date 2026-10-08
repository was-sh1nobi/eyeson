import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Play, Pause, RotateCcw, Scissors, Clock, Volume2, VolumeX, Eye } from "lucide-react";

interface VideoTrimmerBarProps {
  videoSource: File | string | null;
  pstart: number;
  pend: number;
  onChange: (start: number, end: number) => void;
  maxCut?: number;
  label?: string;
}

export default function VideoTrimmerBar({
  videoSource,
  pstart,
  pend,
  onChange,
  maxCut = 10,
  label = "Preview Video Clip (Max 10s)",
}: VideoTrimmerBarProps) {
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoopingPreview, setIsLoopingPreview] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isGeneratingFilmstrip, setIsGeneratingFilmstrip] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const filmstripCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Drag state
  const dragRef = useRef<{
    type: "start" | "end" | "window" | "playhead" | null;
    startX: number;
    initialStart: number;
    initialEnd: number;
  }>({
    type: null,
    startX: 0,
    initialStart: 0,
    initialEnd: 0,
  });

  // Resolve video URL
  const videoUrl = useMemo(() => {
    if (!videoSource) return "";
    if (typeof videoSource === "string") return videoSource;
    try {
      return URL.createObjectURL(videoSource);
    } catch {
      return "";
    }
  }, [videoSource]);

  // Clean up Object URL
  useEffect(() => {
    return () => {
      if (videoSource instanceof File && videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoSource, videoUrl]);

  // Sync video duration & initial cut
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (Number.isFinite(dur) && dur > 0) {
      setDuration(dur);
      // Initialize cut if not set
      if (pend <= 0 || pend <= pstart) {
        const initialEnd = Math.min(dur, Math.max(1, maxCut));
        onChange(0, initialEnd);
      } else if (pend - pstart > maxCut) {
        onChange(pstart, Math.min(dur, pstart + maxCut));
      }
    }
  }, [pend, pstart, maxCut, onChange]);

  // Seek video to specific timestamp
  const seekVideo = useCallback((time: number) => {
    if (!videoRef.current || !Number.isFinite(time)) return;
    const clamped = Math.max(0, Math.min(duration || 1000, time));
    videoRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  // Generate lightweight visual filmstrip on background canvas
  useEffect(() => {
    if (!videoUrl) return;
    let isCancelled = false;

    const generateFilmstrip = async () => {
      const canvas = filmstripCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsGeneratingFilmstrip(true);

      const offVideo = document.createElement("video");
      offVideo.src = videoUrl;
      offVideo.muted = true;
      offVideo.playsInline = true;
      offVideo.crossOrigin = "anonymous";
      offVideo.preload = "auto";

      try {
        await new Promise<void>((resolve, reject) => {
          offVideo.onloadedmetadata = () => resolve();
          offVideo.onerror = () => reject(new Error("Failed to load video metadata"));
          setTimeout(() => reject(new Error("Timeout loading video")), 6000);
        });

        if (isCancelled) return;
        const totalDuration = offVideo.duration;
        if (!totalDuration || !Number.isFinite(totalDuration)) return;

        const numThumbs = 10;
        const thumbWidth = canvas.width / numThumbs;
        const thumbHeight = canvas.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < numThumbs; i++) {
          if (isCancelled) break;
          const targetTime = Math.min(totalDuration - 0.05, Math.max(0.01, (i / (numThumbs - 1 || 1)) * totalDuration));

          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              offVideo.removeEventListener("seeked", onSeeked);
              resolve();
            };
            offVideo.addEventListener("seeked", onSeeked, { once: true });
            offVideo.currentTime = targetTime;
          });

          if (isCancelled) break;

          try {
            ctx.drawImage(offVideo, i * thumbWidth, 0, thumbWidth, thumbHeight);
          } catch {
            // CORS restriction on remote video drawImage
            break;
          }
        }
      } catch {
        // Fallback gracefully to subtle gradient placeholder
      } finally {
        if (!isCancelled) {
          setIsGeneratingFilmstrip(false);
        }
        offVideo.src = "";
        offVideo.remove();
      }
    };

    generateFilmstrip();

    return () => {
      isCancelled = true;
    };
  }, [videoUrl]);

  // Video time update handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    // Loop Preview behavior
    if (isLoopingPreview) {
      if (current >= pend || current < pstart) {
        videoRef.current.currentTime = pstart;
      }
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsLoopingPreview(false);
    } else {
      setIsLoopingPreview(false);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Play Cut Preview Loop
  const playPreviewLoop = () => {
    if (!videoRef.current) return;
    seekVideo(pstart);
    setIsLoopingPreview(true);
    videoRef.current.play();
    setIsPlaying(true);
  };

  // Stop video when ended
  const handleEnded = () => {
    setIsPlaying(false);
    setIsLoopingPreview(false);
  };

  // Percentage calculations
  const totalDur = duration > 0 ? duration : Math.max(pend, 10);
  const startPct = Math.min(100, Math.max(0, (pstart / totalDur) * 100));
  const endPct = Math.min(100, Math.max(0, (pend / totalDur) * 100));
  const currentPct = Math.min(100, Math.max(0, (currentTime / totalDur) * 100));
  const cutDuration = Math.max(0, pend - pstart);

  // Mouse / Touch Drag handling
  const startDrag = (
    e: React.MouseEvent | React.TouchEvent,
    type: "start" | "end" | "window" | "playhead"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragRef.current = {
      type,
      startX: clientX,
      initialStart: pstart,
      initialEnd: pend,
    };

    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
      setIsLoopingPreview(false);
    }

    const onPointerMove = (moveEvt: MouseEvent | TouchEvent) => {
      if (!dragRef.current.type || !trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const currentClientX = "touches" in moveEvt ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const deltaX = currentClientX - dragRef.current.startX;
      const deltaTime = (deltaX / trackRect.width) * totalDur;

      const dragType = dragRef.current.type;

      if (dragType === "start") {
        let newStart = dragRef.current.initialStart + deltaTime;
        newStart = Math.max(0, Math.min(pend - 0.2, newStart));
        if (pend - newStart > maxCut) {
          newStart = pend - maxCut;
        }
        onChange(Number(newStart.toFixed(2)), Number(pend.toFixed(2)));
        seekVideo(newStart);
      } else if (dragType === "end") {
        let newEnd = dragRef.current.initialEnd + deltaTime;
        newEnd = Math.max(pstart + 0.2, Math.min(totalDur, newEnd));
        if (newEnd - pstart > maxCut) {
          newEnd = pstart + maxCut;
        }
        onChange(Number(pstart.toFixed(2)), Number(newEnd.toFixed(2)));
        seekVideo(newEnd);
      } else if (dragType === "window") {
        const windowLength = dragRef.current.initialEnd - dragRef.current.initialStart;
        let newStart = dragRef.current.initialStart + deltaTime;
        let newEnd = newStart + windowLength;

        if (newStart < 0) {
          newStart = 0;
          newEnd = windowLength;
        }
        if (newEnd > totalDur) {
          newEnd = totalDur;
          newStart = totalDur - windowLength;
        }

        onChange(Number(newStart.toFixed(2)), Number(newEnd.toFixed(2)));
        seekVideo(newStart);
      } else if (dragType === "playhead") {
        const clickRatio = Math.max(0, Math.min(1, (currentClientX - trackRect.left) / trackRect.width));
        const seekTime = clickRatio * totalDur;
        seekVideo(seekTime);
      }
    };

    const onPointerUp = () => {
      dragRef.current.type = null;
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("touchend", onPointerUp);
  };

  // Direct track click to seek playhead
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = ratio * totalDur;
    seekVideo(seekTime);
  };

  // Format seconds to mm:ss.s
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins < 10 ? "0" : ""}${mins}:${Number(secs) < 10 ? "0" : ""}${secs}s`;
  };

  if (!videoSource) {
    return null;
  }

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Scissors size={18} className="text-[#00E6D7]" />
          <span className="text-sm font-semibold text-white">{label}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#00E6D7]/10 text-[#00E6D7] border border-[#00E6D7]/20">
            Cut: {cutDuration.toFixed(2)}s / {maxCut}s max
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playPreviewLoop}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isLoopingPreview
                ? "bg-[#00E6D7] text-black shadow-lg shadow-[#00E6D7]/20 font-semibold"
                : "bg-white/10 text-white/90 hover:bg-white/20 hover:text-white"
            }`}
            title="Loop preview between pstart and pend"
          >
            <Eye size={14} />
            <span>{isLoopingPreview ? "Previewing Cut..." : "Preview Cut (Loop)"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const initialEnd = Math.min(totalDur, maxCut);
              onChange(0, initialEnd);
              seekVideo(0);
            }}
            className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reset cut to first 10s"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Video Player & Monitor */}
      <div className="relative w-full aspect-video max-h-56 bg-black/80 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          muted={isMuted}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="w-full h-full object-contain"
        />

        {/* Video Overlays / Controls */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 rounded text-white/80 hover:text-[#00E6D7] transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <span className="font-mono text-[11px] text-white/70">
              {formatTime(currentTime)} / {formatTime(totalDur)}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-[#00E6D7]">pstart: {pstart.toFixed(2)}s</span>
            <span className="text-white/40">|</span>
            <span className="text-[#00E6D7]">pend: {pend.toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {/* Interactive Video Bar / Timeline Trimmer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-white/40 font-mono px-1">
          <span>00:00.0s</span>
          <span className="text-white/70 font-sans text-xs">
            Drag handles or slide the bar (max {maxCut}s)
          </span>
          <span>{formatTime(totalDur)}</span>
        </div>

        {/* Timeline Track Container */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative w-full h-14 bg-white/5 border border-white/15 rounded-xl overflow-hidden cursor-pointer select-none"
        >
          {/* Filmstrip Canvas */}
          <canvas
            ref={filmstripCanvasRef}
            width={800}
            height={60}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-60"
          />

          {/* Filmstrip loading indicator */}
          {isGeneratingFilmstrip && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] text-white/50 tracking-wider">Loading video timeline...</span>
            </div>
          )}

          {/* Dimmed Left Non-Selected Area */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-black/75 backdrop-blur-[1px] pointer-events-none transition-[width] duration-75"
            style={{ width: `${startPct}%` }}
          />

          {/* Dimmed Right Non-Selected Area */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-black/75 backdrop-blur-[1px] pointer-events-none transition-[width] duration-75"
            style={{ width: `${100 - endPct}%` }}
          />

          {/* Active 10s Selection Window */}
          <div
            className="absolute top-0 bottom-0 border-y-2 border-[#00E6D7] bg-[#00E6D7]/15 cursor-grab active:cursor-grabbing group shadow-lg shadow-[#00E6D7]/10"
            style={{
              left: `${startPct}%`,
              width: `${Math.max(1, endPct - startPct)}%`,
            }}
            onMouseDown={(e) => startDrag(e, "window")}
            onTouchStart={(e) => startDrag(e, "window")}
          >
            {/* Start Handle (pstart) */}
            <div
              className="absolute left-0 top-0 bottom-0 w-3 -translate-x-1.5 bg-[#00E6D7] rounded-l-md cursor-ew-resize flex items-center justify-center hover:scale-110 hover:brightness-125 transition-transform z-10"
              onMouseDown={(e) => startDrag(e, "start")}
              onTouchStart={(e) => startDrag(e, "start")}
              title={`Preview start: ${pstart.toFixed(2)}s`}
            >
              <div className="w-0.5 h-4 bg-black/80 rounded-full" />
            </div>

            {/* Middle Drag Grip Cue */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 bg-white rounded-full" />
                <div className="w-0.5 h-3 bg-white rounded-full" />
                <div className="w-0.5 h-3 bg-white rounded-full" />
              </div>
            </div>

            {/* End Handle (pend) */}
            <div
              className="absolute right-0 top-0 bottom-0 w-3 translate-x-1.5 bg-[#00E6D7] rounded-r-md cursor-ew-resize flex items-center justify-center hover:scale-110 hover:brightness-125 transition-transform z-10"
              onMouseDown={(e) => startDrag(e, "end")}
              onTouchStart={(e) => startDrag(e, "end")}
              title={`Preview end: ${pend.toFixed(2)}s`}
            >
              <div className="w-0.5 h-4 bg-black/80 rounded-full" />
            </div>
          </div>

          {/* Playhead Needle Indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-20 pointer-events-none shadow-[0_0_8px_rgba(244,63,94,0.9)]"
            style={{ left: `${currentPct}%` }}
          >
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full -translate-x-1 -translate-y-1 shadow" />
          </div>
        </div>

        {/* Precise Time Inputs & Quick Adjusters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1">
              Preview Start (pstart)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.1"
                min="0"
                max={Math.max(0, pend - 0.1)}
                value={pstart}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (Number.isFinite(val) && val >= 0 && val < pend) {
                    const finalVal = pend - val > maxCut ? pend - maxCut : val;
                    onChange(Number(finalVal.toFixed(2)), pend);
                    seekVideo(finalVal);
                  }
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00E6D7]"
              />
              <button
                type="button"
                onClick={() => {
                  const newStart = Math.min(currentTime, Math.max(0, pend - 0.2));
                  const clampedStart = pend - newStart > maxCut ? pend - maxCut : newStart;
                  onChange(Number(clampedStart.toFixed(2)), pend);
                }}
                className="px-2 py-1.5 rounded-lg bg-white/5 text-[11px] text-white/70 hover:text-[#00E6D7] hover:bg-white/10 border border-white/10 transition-colors cursor-pointer whitespace-nowrap"
                title="Set pstart to current playback position"
              >
                Set Current
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1">
              Preview End (pend)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.1"
                min={pstart + 0.1}
                max={totalDur}
                value={pend}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (Number.isFinite(val) && val > pstart && val <= totalDur) {
                    const finalVal = val - pstart > maxCut ? pstart + maxCut : val;
                    onChange(pstart, Number(finalVal.toFixed(2)));
                    seekVideo(finalVal);
                  }
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00E6D7]"
              />
              <button
                type="button"
                onClick={() => {
                  const newEnd = Math.max(currentTime, pstart + 0.2);
                  const clampedEnd = newEnd - pstart > maxCut ? pstart + maxCut : Math.min(totalDur, newEnd);
                  onChange(pstart, Number(clampedEnd.toFixed(2)));
                }}
                className="px-2 py-1.5 rounded-lg bg-white/5 text-[11px] text-white/70 hover:text-[#00E6D7] hover:bg-white/10 border border-white/10 transition-colors cursor-pointer whitespace-nowrap"
                title="Set pend to current playback position"
              >
                Set Current
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => {
                const s = Math.max(0, currentTime);
                const e = Math.min(totalDur, s + maxCut);
                onChange(Number(s.toFixed(2)), Number(e.toFixed(2)));
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Clock size={13} />
              <span>Next {maxCut}s from here</span>
            </button>
          </div>

          <div className="flex flex-col justify-end">
            <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] flex items-center justify-between">
              <span className="text-white/50">Clip Duration:</span>
              <span className={`font-mono font-medium ${cutDuration > maxCut ? "text-red-400" : "text-[#00E6D7]"}`}>
                {cutDuration.toFixed(2)}s / {maxCut}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
