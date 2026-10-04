import React, {
    type RefObject,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Film,
    Layers,
    Box,
} from "lucide-react";
import { SmartImage } from "@/utils/SmartImage";

const CATEGORIES = [
    {
        id: "video-editing",
        title: "Video Editing",
        badge: "4K Cuts",
        icon: Film,
        image: "/home/20/2.webp",
        videoUrl: "/home/Videos/output-first.mp4",
        poster: "/home/Videos/output-first-poster.jpg",
    },
    {
        id: "motion-design",
        title: "Motion Design",
        badge: "2D Motion",
        icon: Sparkles,
        image: "/home/20/1.webp",
        videoUrl: "/home/Videos/output-second.mp4",
        poster: "/home/Videos/output-second-poster.jpg",
    },
    {
        id: "3d-uiux",
        title: "3D & UI/UX",
        badge: "Visual Flow",
        icon: Box,
        image: "/home/20/3.webp",
        videoUrl: "/home/Videos/output-third.mp4",
        poster: "/home/Videos/output-third-poster.jpg",
    },
    {
        id: "brand-identity",
        title: "Brand Identity",
        badge: "Visual System",
        icon: Layers,
        image: "/home/20/4.webp",
        videoUrl: "/home/Videos/output-fourth.mp4",
        poster: "/home/Videos/output-fourth-poster.jpg",
    },
];

const SHOWREEL = {
    videoUrl: "/home/showreel/showreel.mp4",
    poster: "/home/showreel/showreel-poster.png",
};

interface RightSectionHeroProps {
    activeTab: string;
    shouldReduceMotion?: boolean | null;
    videoRef: RefObject<HTMLVideoElement | null>;
    handleTimeUpdate: () => void;
    onCategoryChange: (category: string) => void;
}

function RightSectionHeroComponent({
    activeTab,
    videoRef,
    onCategoryChange,
}: Omit<RightSectionHeroProps, "handleTimeUpdate">) {
    const isShowreel = activeTab === "showreel";
    const activeCategory = CATEGORIES.find((c) => c.id === activeTab) || null;
    const activeVideo = isShowreel ? SHOWREEL.videoUrl : (activeCategory?.videoUrl ?? SHOWREEL.videoUrl);
    const activePoster = isShowreel ? SHOWREEL.poster : (activeCategory?.poster ?? SHOWREEL.poster);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canLoadVideo, setCanLoadVideo] = useState(false);

    // Always autoplay in every mode (normal, gpu-off, reduced-motion, mobile).
    // No tap-to-play gate: src attaches as soon as the hero is near viewport.
    const shouldAttachSrc = canLoadVideo;

    // React does not reliably set the `muted` *property* from JSX, so browsers
    // treat the video as unmuted and block autoplay. Force it via ref and
    // explicitly call .play() whenever the source becomes available or changes.
    // NOTE: play() must be called unconditionally — with preload="none" nothing
    // fetches until play(), so waiting for `canplay` alone deadlocks (poster
    // stuck forever). play() both initiates the fetch and starts playback.
    useEffect(() => {
        if (!canLoadVideo) return;
        const video = videoRef.current;
        if (!video) return;
        video.muted = true;
        video.defaultMuted = true;
        // On weak devices the first play() often rejects (decode not ready,
        // background tab, data-saver) — keep retrying on every signal.
        const tryPlay = () => {
            const v = videoRef.current;
            if (!v || !v.paused) return;
            v.muted = true;
            const p = v.play();
            if (p) p.catch(() => {});
        };
        tryPlay();
        video.addEventListener("loadeddata", tryPlay);
        video.addEventListener("canplay", tryPlay);
        const onVisible = () => {
            if (!document.hidden) tryPlay();
        };
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            video.removeEventListener("loadeddata", tryPlay);
            video.removeEventListener("canplay", tryPlay);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [activeVideo, canLoadVideo, videoRef]);

    const goPrev = () => {
        if (isShowreel) {
            onCategoryChange(CATEGORIES[CATEGORIES.length - 1].id);
            return;
        }
        const idx = CATEGORIES.findIndex((c) => c.id === activeTab);
        const prev = (idx - 1 + CATEGORIES.length) % CATEGORIES.length;
        onCategoryChange(CATEGORIES[prev].id);
    };
    const goNext = () => {
        if (isShowreel) {
            onCategoryChange(CATEGORIES[0].id);
            return;
        }
        const idx = CATEGORIES.findIndex((c) => c.id === activeTab);
        const next = (idx + 1) % CATEGORIES.length;
        onCategoryChange(CATEGORIES[next].id);
    };

    useEffect(() => {
        // Lazy-load and viewport-aware playback: play when in view, pause when scrolled away
        const el = containerRef.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setCanLoadVideo(true);
            return;
        }
        const io = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                setCanLoadVideo(true);
                const video = videoRef.current;
                if (video) {
                    video.muted = true;
                    video.play().catch(() => {});
                }
            } else {
                const video = videoRef.current;
                if (video && !video.paused) {
                    video.pause();
                }
            }
        }, { rootMargin: "150px", threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, [videoRef]);

    return (
        <div className="relative w-full max-w-212.5 xl:max-w-237.5 mx-auto animate-fade-in flex flex-col items-center">



            <img
                src="/home/RightElements/el/2.svg"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute -top-60 -right-10 scale-[1.3] z-10 h-300 w-300 object-contain pointer-events-none hidden lg:block "
            />

            {/* Giant Mockup Player Container — slightly taller aspect on phones
                (≈ +10px at 360px wide) so the frame image doesn't look cut short */}
            <div ref={containerRef} className="relative aspect-16/10 max-sm:aspect-16/10.5 w-full rounded-[24px] sm:rounded-[32px] md:rounded-[36px] flex justify-center items-end border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,169,189,0.35)] overflow-hidden bg-[#02070f]">
                <SmartImage src="/home/VideoElements/20/mother.webp" alt="" fill priority className="rounded-[inherit] object-cover " />

                {/* Top header bar inside Mockup */}
                <div className="absolute top-0 left-0 z-10 flex items-center justify-between w-full px-3 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3.5 text-white/70">
                    <div className="flex items-center gap-2">
                        <button aria-label="Previous" onClick={goPrev} className="p-1 cursor-pointer text-white/60 hover:text-white transition-colors">
                            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <button aria-label="Next" onClick={goNext} className="p-1 cursor-pointer text-white/60 hover:text-white transition-colors">
                            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full   text-[10px] sm:text-xs text-white/80 font-mono ">
                        <span className="h-2 w-2 rounded-full bg-[#00E6D7] shadow-[0_0_8px_#00E6D7] animate-pulse" />
                        <span>LIVE PREVIEW</span>
                    </div>
                </div>

                {/* Inner Video Container */}
                <div
                    className="relative w-full h-[calc(100%-2.2rem)] sm:h-[calc(100%-2.8rem)] md:h-[calc(100%-3.1rem)] mt-6 sm:mt-7 md:mt-8 rounded-[18px] sm:rounded-[24px] md:rounded-[28px] overflow-hidden"
                    style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
                >
                    <SmartImage src="/home/VideoElements/20/child.webp" alt="" fill priority className="rounded-[inherit] object-cover" />
                    <video
                        ref={videoRef}
                        src={shouldAttachSrc ? activeVideo : undefined}
                        poster={activePoster}
                        preload="metadata"
                        autoPlay
                        muted
                        loop
                        playsInline
                        disablePictureInPicture={false}
                        onCanPlay={() => {
                            const video = videoRef.current;
                            if (video) {
                                video.muted = true;
                                video.play().catch(() => {});
                            }
                        }}
                        className="absolute inset-0 h-full w-full object-cover rounded-[inherit]"
                        style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
                    />
                    <div className="absolute inset-0 bg-[#051118]/20 pointer-events-none rounded-[inherit]" aria-hidden="true" />
                </div>
            </div>

            {/* Showreel button — visible on all breakpoints, switches directly to showreel */}
            <button
                onClick={() => {
                    if (activeTab !== "showreel") onCategoryChange("showreel");
                }}
                disabled={isShowreel}
                aria-pressed={isShowreel}
                style={{ backgroundImage: "var(--button-primary-bg)" }}
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-(--button-shadow) transition-all hover:shadow-(--button-shadow-hover) ${isShowreel ? "opacity-60 cursor-default" : "hover:scale-105 cursor-pointer"}`}
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                Showreel
            </button>

            {/* Premium Category Bar — Desktop Only (Clean Glass Cards with Neon Accents) */}
            <div className="hidden lg:grid grid-cols-4 gap-3.5 mt-5 w-full relative z-30">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeTab === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            aria-pressed={isActive}
                            className={`group relative flex items-center gap-3 p-3 rounded-2xl border transition-[transform,border-color,background-color,box-shadow] duration-300 text-left cursor-pointer overflow-hidden backdrop-blur-xl ${
                                isActive
                                    ? "bg-linear-to-r from-[#042833]/90 to-[#063342]/90 border-[#00E6D7] shadow-[0_0_30px_rgba(0,230,215,0.25)] scale-[1.02]"
                                    : "bg-[#05141e]/80 border-white/8 hover:border-white/25 hover:bg-[#071f2d]/90 hover:scale-[1.01]"
                            }`}
                        >
                            {/* Active Top Glow Line */}
                            {isActive && (
                                <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-[#00E6D7] to-transparent shadow-[0_0_10px_#00E6D7]" />
                            )}

                            {/* Icon Box */}
                            <div className={`p-2.5 rounded-xl border transition-[background-color,border-color,box-shadow,color] duration-300 shrink-0 ${
                                isActive 
                                    ? "bg-[#00E6D7]/20 border-[#00E6D7]/60 text-[#00E6D7] shadow-[0_0_15px_rgba(0,230,215,0.3)]" 
                                    : "bg-white/5 border-white/10 text-white/50 group-hover:text-white group-hover:border-white/20 group-hover:bg-white/10"
                            }`}>
                                <Icon className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <span className={`block text-[10px] font-mono uppercase tracking-wider transition-colors ${
                                    isActive ? "text-[#00E6D7]" : "text-white/40 group-hover:text-white/60"
                                }`}>
                                    {cat.badge}
                                </span>
                                <span className={`block text-[13px] font-bold truncate transition-colors ${
                                    isActive ? "text-white" : "text-white/80 group-hover:text-white"
                                }`}>
                                    {cat.title}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default React.memo(RightSectionHeroComponent);
