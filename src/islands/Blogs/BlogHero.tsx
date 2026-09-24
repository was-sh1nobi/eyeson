import { useState, useEffect, useCallback, useRef } from "react";
import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SmartImage } from "../../utils/SmartImage.tsx";

// ---------------------------------------------------------------------------
// Logger — only verbose when PUBLIC_LOG_LEVEL === "verbose"
// ---------------------------------------------------------------------------
const LOG_LEVEL = import.meta.env.PUBLIC_LOG_LEVEL ?? "silent";
const isVerbose = LOG_LEVEL === "verbose";

const logger = {
  log: (...args: unknown[]) => {
    if (isVerbose) console.log("%c[BlogHero]", "color:#25d9e0;font-weight:bold", ...args);
  },
  group: (label: string) => {
    if (isVerbose) console.group(`%c[BlogHero] ${label}`, "color:#25d9e0;font-weight:bold");
  },
  groupEnd: () => {
    if (isVerbose) console.groupEnd();
  },
  error: (...args: unknown[]) => {
    // errors always show, verbose or not
    console.error("[BlogHero]", ...args);
  },
};

type BlogSection = {
  id?: string;
  title: string;
  intro?: string;
  bullets?: string[];
  points?: string[];
};

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  cover?: { url: string } | null;
}

interface PostBase {
  id: number;
  title: string;
  publishedAt?: string;
  slug: string;
  category?: string | null;
  readTime?: string;
  cover?: { url: string } | null;
}

interface BlogHeroProps {
  /** Full post object where `content` is a markdown string */
  markdownPost?: PostBase & { content: string };
  /** Full post object where `content` is a Strapi blocks array */
  blocksPost?: PostBase & { content: BlocksContent };
}

const exampleSections: BlogSection[] = [
  {
    id: "key-takeaways",
    title: "Key takeaways",
    bullets: [
      "A video production subscription gives you continuous access to a creative team.",
      "No more repeated onboarding cycles.",
      "Flexible vs in-house teams.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Inline share icons (no extra dependency)
// ---------------------------------------------------------------------------
const IconCopy = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
);
const IconCheck = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
);
const IconLinkedin = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6 0h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.34c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21H9V9z" />
    </svg>
);
const IconX = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.9 3h3.3l-7.2 8.24L22.5 21h-6.6l-5.18-6.78L4.8 21H1.5l7.7-8.8L1.5 3h6.78l4.68 6.18L17.9 3zm-1.16 16.2h1.83L7.34 4.7H5.38l11.36 14.5z" />
    </svg>
);
const IconShare = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <path d="M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4" />
    </svg>
);
const IconCalendar = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
);
const IconClock = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
);

export const BlogHero = ({
                           markdownPost,
                           blocksPost,
                         }: BlogHeroProps) => {
  const post = markdownPost ?? blocksPost;
  const title = post?.title ?? "Blog Post";
  const category = post?.category ?? "";
  const date = post?.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
      : "";
  const slug = post?.slug ?? "";
  const readTime = post?.readTime;

  const strapiUrl = import.meta.env.PUBLIC_POST_URL || "https://blog.eyesonstudio.com";
  const coverImage = post?.cover?.url
      ? post.cover.url.startsWith("http")
        ? post.cover.url
        : `${strapiUrl}${post.cover.url}`
      : null;

  const articleSections = exampleSections;
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [copied, setCopied] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const hasMarkdown = !!markdownPost && markdownPost.content.trim().length > 0;
  const hasBlocks = !!blocksPost && Array.isArray(blocksPost.content) && blocksPost.content.length > 0;

  // Log incoming props once on mount
  useEffect(() => {
    logger.group("BlogHero props received");
    logger.log("type:", markdownPost ? "markdown" : blocksPost ? "blocks" : "none");
    logger.log("title:", title);
    logger.log("category:", category);
    logger.log("slug:", slug);
    logger.log("hasMarkdown:", hasMarkdown);
    logger.log("hasBlocks:", hasBlocks);
    logger.groupEnd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdownPost, blocksPost]);

  useEffect(() => {
    if (!category || !slug) {
      logger.log("Skipping related posts fetch — missing category or slug", {
        category,
        slug,
      });
      return;
    }

    const url = `${strapiUrl}/api/posts?filters[category][$eq]=${encodeURIComponent(
        category
    )}&filters[slug][$ne]=${encodeURIComponent(slug)}&populate=cover&pagination[limit]=3`;

    let cancelled = false;

    logger.group("Fetching related posts");
    logger.log("URL:", url);

    fetch(url)
        .then((res) => {
          logger.log("Response status:", res.status, res.statusText);
          if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          logger.log("Raw related posts response:", data);
          if (cancelled) return;
          if (data?.data) {
            logger.log(`Setting ${data.data.length} related post(s)`);
            setRelatedPosts(data.data);
          } else {
            logger.log("No `data` field in response — leaving relatedPosts empty");
          }
        })
        .catch((err) => {
          logger.error("Related posts fetch failed:", err);
        })
        .finally(() => {
          logger.groupEnd();
        });

    return () => {
      cancelled = true;
    };
  }, [category, slug]);

  // Native Web Share API availability
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  // Reading progress bar — optimized with direct DOM update and cached measurement
  useEffect(() => {
    let rafId = 0;
    let docHeight = 0;

    const measureHeight = () => {
      const doc = document.documentElement;
      docHeight = doc.scrollHeight - doc.clientHeight;
    };

    const updateBar = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateBar();
        rafId = 0;
      });
    };

    const onResize = () => {
      measureHeight();
      onScroll();
    };

    measureHeight();
    updateBar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(title);

  const handleCopy = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      logger.log("Link copied to clipboard", pageUrl);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error("Clipboard copy failed", err);
    }
  }, [pageUrl]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({ title, url: pageUrl });
    } catch (err) {
      logger.log("Native share cancelled", err);
    }
  }, [title, pageUrl]);

  const openSocial = useCallback(
      (platform: "linkedin" | "twitter") => {
        const links: Record<"twitter" | "linkedin", string> = {
          twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${shareText}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
        };
        window.open(links[platform], "_blank", "noopener,noreferrer,width=600,height=560");
      },
      [pageUrl, shareText]
  );

  // Shared button styles
  const railBtn =
      "group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/75 transition hover:border-[#25d9e0]/50 hover:bg-[#00A9BD]/10 hover:text-white";

  const pillBtn =
      "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs sm:text-sm text-white/75 transition hover:border-[#25d9e0]/50 hover:bg-[#00A9BD]/10 hover:text-white";

  return (
      <>
        {/* Reading progress */}
        <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent pointer-events-none" aria-hidden="true">
          <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#45B6A0] to-[#25d9e0] shadow-[0_0_12px_rgba(0,169,189,0.7)] transition-[width] duration-75 ease-out"
              style={{ width: "0%" }}
          />
        </div>

        {/* ===================== HERO ===================== */}
        <section className="relative overflow-hidden text-white">
          <div className="relative mx-auto flex w-full max-w-350 flex-col px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
            <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="order-2 max-w-2xl lg:order-1">
                {category && (
                    <span className="mb-5 inline-flex items-center rounded-full border border-[#25d9e0]/30 bg-[#00A9BD]/10 px-3 py-1 text-xs font-medium tracking-wide text-[#25d9e0] sm:text-sm">
                      {category}
                    </span>
                )}
                <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] text-[#2fd1cf] sm:text-4xl md:text-5xl lg:text-[3.4rem]">
                  {title}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70 sm:text-base">
                  <span className="inline-flex items-center gap-2">
                    <SmartImage
                        src="/blogs/P1.svg"
                        alt="Eyeson Studio"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                    />
                    <span>By Eyeson Studio</span>
                  </span>
                  {date && (
                      <>
                        <span className="text-white/30">·</span>
                        <span className="inline-flex items-center gap-1.5">
                          <IconCalendar className="h-4 w-4 text-[#25d9e0]/70" />
                          {date}
                        </span>
                      </>
                  )}
                  {readTime && (
                      <>
                        <span className="text-white/30">·</span>
                        <span className="inline-flex items-center gap-1.5">
                          <IconClock className="h-4 w-4 text-[#25d9e0]/70" />
                          {readTime}
                        </span>
                      </>
                  )}
                </div>

                {/* Mobile share row */}
                <div className="mt-6 flex flex-wrap items-center gap-2 lg:hidden">
                  <span className="text-xs uppercase tracking-wider text-white/40">Share</span>
                  {canNativeShare && (
                      <button onClick={handleNativeShare} className={pillBtn} aria-label="Share">
                        <IconShare className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                  )}
                  <button onClick={handleCopy} className={pillBtn} aria-label="Copy link">
                    {copied ? <IconCheck className="h-4 w-4 text-[#25d9e0]" /> : <IconCopy className="h-4 w-4" />}
                    <span>{copied ? "Copied" : "Copy link"}</span>
                  </button>
                  <button onClick={() => openSocial("linkedin")} className={pillBtn} aria-label="Share on LinkedIn">
                    <IconLinkedin className="h-4 w-4" />
                  </button>
                  <button onClick={() => openSocial("twitter")} className={pillBtn} aria-label="Share on X">
                    <IconX className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-6 rounded-[2.5rem] bg-[#00A9BD]/25 blur-3xl sm:-inset-8" />
                <div className="relative overflow-hidden rounded-[1.5rem] border border-[#62e8f1]/20 bg-[#102530]/75 shadow-[0_0_70px_rgba(0,169,189,0.32)] backdrop-blur-md sm:rounded-[2rem]">
                  <div className="relative aspect-[4/3] w-full sm:aspect-[1.02/1]">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={title}
                            className="absolute inset-0 h-full w-full object-cover opacity-90"
                        />
                    ) : (
                        <div className="absolute inset-0 overflow-hidden bg-[#02131C]">
                          <style>{`
                        @keyframes ai-float { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; } 50% { transform: translateY(-6px) scale(1.04); opacity: 0.7; } }
                        @keyframes ai-core { 0%, 100% { transform: scale(1); opacity: 0.4; box-shadow: 0 0 15px rgba(0,169,189,0.1); } 50% { transform: scale(1.15); opacity: 0.9; box-shadow: 0 0 45px rgba(0,169,189,0.4); } }
                        @keyframes data-stream { 0% { transform: translateX(-100%); opacity: 0; } 15% { opacity: 0.8; } 85% { opacity: 0.8; } 100% { transform: translateX(400%); opacity: 0; } }
                        @keyframes data-stream-v { 0% { transform: translateY(-100%); opacity: 0; } 15% { opacity: 0.6; } 85% { opacity: 0.6; } 100% { transform: translateY(400%); opacity: 0; } }
                        @keyframes node-pulse { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.5); } }
                        @keyframes orbit { to { transform: rotate(360deg); } }
                        @keyframes orbit-rev { to { transform: rotate(-360deg); } }
                        @keyframes sweep { 0% { transform: translateX(-200%); } 100% { transform: translateX(500%); } }
                        @keyframes particle-drift { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.5; } 80% { opacity: 0.5; } 100% { transform: translate(60px, -80px); opacity: 0; } }
                        @keyframes particle-drift-2 { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.4; } 80% { opacity: 0.4; } 100% { transform: translate(-70px, 60px); opacity: 0; } }
                        @keyframes particle-drift-3 { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.35; } 80% { opacity: 0.35; } 100% { transform: translate(80px, 40px); opacity: 0; } }
                      `}</style>
                          <div
                              className="absolute inset-0 opacity-25"
                              style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,169,189,0.25) 1px, transparent 0)`,
                                backgroundSize: "22px 22px",
                                animation: "ai-float 5s ease-in-out infinite",
                                willChange: "transform, opacity",
                              }}
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,169,189,0.08)_0%,transparent_40%,rgba(45,212,191,0.04)_100%)]" />
                          <div className="absolute inset-0 grid place-items-center">
                            <div className="h-64 w-72 rounded-full border border-[#00A9BD]/8" style={{ animation: "orbit 40s linear infinite", willChange: "transform" }} />
                            <div className="h-52 w-60 rounded-full border-2 border-dashed border-[#00A9BD]/12" style={{ animation: "orbit-rev 30s linear infinite", willChange: "transform" }} />
                            <div className="h-40 w-48 rounded-full border border-[#00A9BD]/15" style={{ animation: "orbit 22s linear infinite", willChange: "transform" }} />
                            <div className="h-32 w-36 rounded-full border-2 border-dashed border-[#2dd4bf]/18" style={{ animation: "orbit-rev 16s linear infinite", willChange: "transform" }} />
                            <div className="h-24 w-28 rounded-full border border-[#00A9BD]/20" style={{ animation: "orbit 12s linear infinite", willChange: "transform" }} />
                            <div className="h-16 w-20 rounded-full border-2 border-dashed border-[#2dd4bf]/22" style={{ animation: "orbit-rev 9s linear infinite", willChange: "transform" }} />
                            <div className="h-12 w-12 rounded-full border-2 border-[#00A9BD]/30" style={{ animation: "ai-core 3s ease-in-out infinite", willChange: "transform, opacity, box-shadow" }} />
                            <div className="h-8 w-8 rounded-lg border border-[#00A9BD]/40 bg-[#00A9BD]/10 backdrop-blur-[2px]" style={{ animation: "ai-core 2.5s ease-in-out infinite 0.3s", willChange: "transform, opacity, box-shadow" }} />
                            <div className="h-3 w-3 rounded-full bg-[#00A9BD]/60" style={{ animation: "node-pulse 2s ease-in-out infinite", willChange: "transform, opacity" }} />
                            <div className="absolute h-2.5 w-2.5 rounded-full bg-[#00A9BD]/50 shadow-[0_0_10px_rgba(0,169,189,0.6)]" style={{ animation: "orbit 9s linear infinite", marginTop: "-72px", transformOrigin: "center" }} />
                            <div className="absolute h-2 w-2 rounded-full bg-[#2dd4bf]/50 shadow-[0_0_8px_rgba(45,212,191,0.5)]" style={{ animation: "orbit-rev 8s linear infinite", marginTop: "72px", transformOrigin: "center" }} />
                            <div className="absolute h-2 w-2 rounded-full bg-[#00A9BD]/60 shadow-[0_0_8px_rgba(0,169,189,0.5)]" style={{ animation: "orbit 7s linear infinite", marginLeft: "-60px", transformOrigin: "center" }} />
                            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#2dd4bf]/60 shadow-[0_0_6px_rgba(45,212,191,0.5)]" style={{ animation: "orbit-rev 6s linear infinite", marginLeft: "60px", transformOrigin: "center" }} />
                            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#00A9BD]/40" style={{ animation: "orbit 10s linear infinite", marginTop: "-48px", marginLeft: "48px", transformOrigin: "center" }} />
                            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#2dd4bf]/40" style={{ animation: "orbit-rev 11s linear infinite", marginTop: "48px", marginLeft: "-48px", transformOrigin: "center" }} />
                            <div className="absolute h-2 w-2 rounded-full bg-[#00A9BD]/45 shadow-[0_0_6px_rgba(0,169,189,0.4)]" style={{ animation: "orbit-rev 5s linear infinite", marginTop: "-34px", marginLeft: "34px", transformOrigin: "center" }} />
                            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#2dd4bf]/45 shadow-[0_0_5px_rgba(45,212,191,0.35)]" style={{ animation: "orbit 5.5s linear infinite", marginTop: "34px", marginLeft: "-34px", transformOrigin: "center" }} />
                            <div className="absolute h-1 w-1 rounded-full bg-[#00A9BD]/50" style={{ animation: "particle-drift 4s ease-in-out infinite", top: "30%", left: "20%", willChange: "transform, opacity" }} />
                            <div className="absolute h-1 w-1 rounded-full bg-[#2dd4bf]/50" style={{ animation: "particle-drift-2 5s ease-in-out infinite 1s", top: "60%", left: "70%", willChange: "transform, opacity" }} />
                            <div className="absolute h-0.5 w-0.5 rounded-full bg-[#00A9BD]/60" style={{ animation: "particle-drift-3 4.5s ease-in-out infinite 2s", top: "70%", left: "30%", willChange: "transform, opacity" }} />
                            <div className="absolute h-1 w-1 rounded-full bg-[#2dd4bf]/40" style={{ animation: "particle-drift 3.5s ease-in-out infinite 0.5s", top: "40%", left: "75%", willChange: "transform, opacity" }} />
                            <div className="absolute h-0.5 w-0.5 rounded-full bg-[#00A9BD]/55" style={{ animation: "particle-drift-2 6s ease-in-out infinite 3s", top: "25%", left: "60%", willChange: "transform, opacity" }} />
                            <div className="absolute h-1 w-1 rounded-full bg-[#2dd4bf]/45" style={{ animation: "particle-drift-3 4s ease-in-out infinite 1.5s", top: "80%", left: "45%", willChange: "transform, opacity" }} />
                          </div>
                          <div className="absolute left-[10%] right-[10%] top-[12%] h-px bg-linear-to-r from-transparent via-[#00A9BD]/35 to-transparent" style={{ animation: "data-stream 2.8s ease-in-out infinite 0.2s", willChange: "transform" }} />
                          <div className="absolute left-[8%] right-[8%] top-[35%] h-px bg-linear-to-r from-transparent via-[#2dd4bf]/20 to-transparent" style={{ animation: "data-stream 3.5s ease-in-out infinite 0.6s", willChange: "transform" }} />
                          <div className="absolute left-[5%] right-[5%] top-[55%] h-px bg-linear-to-r from-transparent via-[#00A9BD]/25 to-transparent" style={{ animation: "data-stream 4s ease-in-out infinite 1s", willChange: "transform" }} />
                          <div className="absolute left-[12%] right-[12%] top-[78%] h-px bg-linear-to-r from-transparent via-[#2dd4bf]/20 to-transparent" style={{ animation: "data-stream 3s ease-in-out infinite 1.5s", willChange: "transform" }} />
                          <div className="absolute left-[30%] right-[30%] top-[92%] h-px bg-linear-to-r from-transparent via-[#00A9BD]/15 to-transparent" style={{ animation: "data-stream 4.5s ease-in-out infinite 0.3s", willChange: "transform" }} />
                          <div className="absolute inset-y-0 left-[10%] w-px bg-linear-to-b from-transparent via-[#00A9BD]/18 to-transparent" style={{ animation: "data-stream-v 3.5s ease-in-out infinite 0.4s", willChange: "transform" }} />
                          <div className="absolute inset-y-0 left-[30%] w-px bg-linear-to-b from-transparent via-[#2dd4bf]/12 to-transparent" style={{ animation: "data-stream-v 4s ease-in-out infinite 1.2s", willChange: "transform" }} />
                          <div className="absolute inset-y-0 left-[50%] w-px bg-linear-to-b from-transparent via-[#00A9BD]/15 to-transparent" style={{ animation: "data-stream-v 3s ease-in-out infinite 0.8s", willChange: "transform" }} />
                          <div className="absolute inset-y-0 left-[70%] w-px bg-linear-to-b from-transparent via-[#2dd4bf]/12 to-transparent" style={{ animation: "data-stream-v 4.2s ease-in-out infinite 1.8s", willChange: "transform" }} />
                          <div className="absolute inset-y-0 right-[10%] w-px bg-linear-to-b from-transparent via-[#00A9BD]/18 to-transparent" style={{ animation: "data-stream-v 3.8s ease-in-out infinite 0.5s", willChange: "transform" }} />
                          <div className="absolute inset-x-[15%] top-0 h-px bg-linear-to-r from-transparent via-[#00A9BD]/45 to-transparent" />
                          <div className="absolute inset-x-[15%] bottom-0 h-px bg-linear-to-r from-transparent via-[#00A9BD]/45 to-transparent" />
                          <div className="absolute left-[15%] top-0 h-full w-px bg-linear-to-b from-transparent via-[#00A9BD]/25 to-transparent" />
                          <div className="absolute right-[15%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#00A9BD]/25 to-transparent" />
                          <div className="absolute top-0 h-0.5 w-1/3 bg-linear-to-r from-transparent via-[#00A9BD]/60 to-transparent blur-sm" style={{ animation: "sweep 2s ease-in-out infinite", willChange: "transform" }} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.4),rgba(255,255,255,0.08))]" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(0,169,189,0.24),transparent)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== CONTENT ===================== */}
        <section className="relative mx-auto w-full max-w-350 px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
          <div className="rounded-[1.5rem] border border-white/5 bg-[#071b24]/92 p-5 shadow-[0_0_70px_rgba(0,169,189,0.08)] backdrop-blur-md sm:p-8 lg:rounded-[2rem] lg:p-12">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/50">
              <a href="/" className="transition-colors hover:text-[#25d9e0]">Home</a>
              <span>/</span>
              <a href="/blogs" className="transition-colors hover:text-[#25d9e0]">Blog</a>
              <span>/</span>
              <span className="max-w-60 truncate text-white/70">{title}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12 lg:items-start">
              {/* Article */}
              <article className="prose prose-invert min-w-0 max-w-none">
                {hasMarkdown ? (
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                              <p className="text-[15px] leading-8 text-white/75 sm:text-[16px]">{children}</p>
                          ),
                          h1: ({ children }) => (
                              <h1 className="mt-10 mb-4 font-semibold tracking-tight text-white text-3xl sm:text-[2.15rem]">
                                {children}
                              </h1>
                          ),
                          h2: ({ children }) => (
                              <h2 className="mt-10 mb-4 font-semibold tracking-tight text-white text-2xl sm:text-[1.75rem] scroll-mt-24">
                                {children}
                              </h2>
                          ),
                          h3: ({ children }) => (
                              <h3 className="mt-10 mb-4 font-semibold tracking-tight text-white text-xl sm:text-[1.5rem] scroll-mt-24">
                                {children}
                              </h3>
                          ),
                          ul: ({ children }) => (
                              <ul className="mt-4 space-y-2 text-[15px] leading-8 text-white/72 sm:text-[16px] list-disc pl-6">
                                {children}
                              </ul>
                          ),
                          ol: ({ children }) => (
                              <ol className="mt-4 space-y-2 text-[15px] leading-8 text-white/72 sm:text-[16px] list-decimal pl-6">
                                {children}
                              </ol>
                          ),
                          blockquote: ({ children }) => (
                              <blockquote className="mt-6 border-l-4 border-[#25d9e0] bg-white/5 pl-4 py-3 pr-4 rounded-r-lg text-white/80 italic">
                                {children}
                              </blockquote>
                          ),
                          code: ({ children, className }) => {
                            const isBlock = /language-/.test(className || "");
                            return isBlock ? (
                                <pre className="mt-4 rounded-xl bg-[#0d1f2a] p-4 text-sm text-[#25d9e0] overflow-x-auto border border-white/10">
                            <code>{children}</code>
                          </pre>
                            ) : (
                                <code className="rounded bg-white/10 px-1.5 py-0.5 text-[#25d9e0]">{children}</code>
                            );
                          },
                          a: ({ children, href }) => (
                              <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#25d9e0] underline transition-colors hover:text-white"
                              >
                                {children}
                              </a>
                          ),
                          hr: () => <hr className="my-10 border-white/10" />,
                          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                        }}
                    >
                      {markdownPost!.content}
                    </ReactMarkdown>
                ) : hasBlocks ? (
                    <BlocksRenderer
                        content={blocksPost!.content}
                        blocks={{
                          paragraph: ({ children }) => (
                              <p className="text-[15px] leading-8 text-white/75 sm:text-[16px]">{children}</p>
                          ),
                          heading: ({ children, level }) => {
                            const sizes: Record<number, string> = {
                              1: "text-3xl sm:text-[2.15rem]",
                              2: "text-2xl sm:text-[1.75rem]",
                              3: "text-xl sm:text-[1.5rem]",
                            };
                            const className = `mt-10 mb-4 font-semibold tracking-tight text-white scroll-mt-24 ${
                                sizes[level] || "text-lg"
                            }`;

                            switch (level) {
                              case 1:
                                return <h1 className={className}>{children}</h1>;
                              case 2:
                                return <h2 className={className}>{children}</h2>;
                              case 3:
                                return <h3 className={className}>{children}</h3>;
                              case 4:
                                return <h4 className={className}>{children}</h4>;
                              case 5:
                                return <h5 className={className}>{children}</h5>;
                              default:
                                return <h6 className={className}>{children}</h6>;
                            }
                          },
                          list: ({ children, format }) =>
                              format === "ordered" ? (
                                  <ol className="mt-4 space-y-2 text-[15px] leading-8 text-white/72 sm:text-[16px] list-decimal pl-6">
                                    {children}
                                  </ol>
                              ) : (
                                  <ul className="mt-4 space-y-2 text-[15px] leading-8 text-white/72 sm:text-[16px] list-disc pl-6">
                                    {children}
                                  </ul>
                              ),
                          quote: ({ children }) => (
                              <blockquote className="mt-6 border-l-4 border-[#25d9e0] bg-white/5 pl-4 py-3 pr-4 rounded-r-lg text-white/80 italic">
                                {children}
                              </blockquote>
                          ),
                          code: ({ children }) => (
                              <pre className="mt-4 rounded-xl bg-[#0d1f2a] p-4 text-sm text-[#25d9e0] overflow-x-auto border border-white/10">
                          <code>{children}</code>
                        </pre>
                          ),
                          link: ({ children, url }) => (
                              <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#25d9e0] underline transition-colors hover:text-white"
                              >
                                {children}
                              </a>
                          ),
                        }}
                    />
                ) : (
                    <div className="space-y-14">
                      {articleSections.map((section: BlogSection, index: number) => {
                        const points: string[] = section.points ?? section.bullets ?? [];
                        const sectionId = section.id ?? `section-${index + 1}`;

                        return (
                            <section key={sectionId} id={sectionId} className="scroll-mt-24">
                              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.15rem]">
                                {index + 1}. {section.title}
                              </h2>
                              {section.intro && (
                                  <p className="mt-5 max-w-4xl text-[15px] leading-8 text-white/75 sm:text-[16px]">
                                    {section.intro}
                                  </p>
                              )}
                              {points.length > 0 && (
                                  <ul className="mt-5 space-y-2.5 text-[15px] leading-8 text-white/72 sm:text-[16px]">
                                    {points.map((point, idx) => (
                                        <li key={idx} className="flex gap-3">
                                          <span className="mt-2.75 h-1.5 w-1.5 shrink-0 rounded-full bg-[#25d9e0]" />
                                          <span className="block">{point}</span>
                                        </li>
                                    ))}
                                  </ul>
                              )}
                            </section>
                        );
                      })}
                    </div>
                )}
              </article>

              {/* Desktop sticky share rail */}
              <aside className="hidden lg:block">
                <div className="sticky top-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="mb-3 text-xs uppercase tracking-wider text-white/40">Share this article</p>
                    <div className="space-y-2">
                      <button onClick={handleCopy} className={railBtn + " w-full"}>
                        {copied ? <IconCheck className="h-4 w-4 text-[#25d9e0]" /> : <IconCopy className="h-4 w-4" />}
                        <span>{copied ? "Copied!" : "Copy link"}</span>
                      </button>
                      {canNativeShare && (
                          <button onClick={handleNativeShare} className={railBtn + " w-full"}>
                            <IconShare className="h-4 w-4" />
                            <span>Share via…</span>
                          </button>
                      )}
                      <button onClick={() => openSocial("linkedin")} className={railBtn + " w-full"}>
                        <IconLinkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </button>
                      <button onClick={() => openSocial("twitter")} className={railBtn + " w-full"}>
                        <IconX className="h-4 w-4" />
                        <span>X / Twitter</span>
                      </button>
                    </div>
                  </div>

                  {(date || readTime) && (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/60">
                        {date && (
                            <p className="flex items-center gap-2">
                              <IconCalendar className="h-4 w-4 text-[#25d9e0]/70" />
                              {date}
                            </p>
                        )}
                        {readTime && (
                            <p className="mt-2 flex items-center gap-2">
                              <IconClock className="h-4 w-4 text-[#25d9e0]/70" />
                              {readTime}
                            </p>
                        )}
                      </div>
                  )}
                </div>
              </aside>
            </div>

            {relatedPosts.length > 0 && (
                <section className="mt-16 border-t border-white/10 pt-10">
                  <h2 className="text-2xl font-semibold text-white mb-8">Related Articles</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((post) => {
                      const coverSrc = post.cover?.url
                          ? post.cover.url.startsWith("http")
                              ? post.cover.url
                              : `${import.meta.env.PUBLIC_POST_URL || "https://blog.eyesonstudio.com"}${post.cover.url}`
                          : "";
                      return (
                          <a
                              key={post.id}
                              href={`/blog/${post.slug}`}
                              className="group flex flex-col overflow-hidden rounded-2xl border border-[#00A9BD]/30 bg-[#0B1F2A] transition hover:-translate-y-1 hover:border-[#00A9BD]/60"
                          >
                            {coverSrc ? (
                                <div className="aspect-[16/9] overflow-hidden">
                                  <img
                                      src={coverSrc}
                                      alt={post.title}
                                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      loading="lazy"
                                  />
                                </div>
                            ) : (
                                <div className="flex aspect-[16/9] items-center justify-center bg-[#02131C]">
                                  <span className="text-4xl text-white/20">✦</span>
                                </div>
                            )}
                            <div className="flex flex-1 flex-col px-4 py-4">
                              <h3 className="text-sm font-semibold text-white group-hover:text-[#00A9BD] transition-colors">
                                {post.title}
                              </h3>
                            </div>
                          </a>
                      );
                    })}
                  </div>
                </section>
            )}
          </div>
        </section>
      </>
  );
};
