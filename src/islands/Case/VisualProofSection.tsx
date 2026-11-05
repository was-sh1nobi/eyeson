"use client";

import { useEffect, useRef, useState } from "react";
import { httpService } from "@/utils/httpService.ts";

const SECTIONS = ["Lottie Animation Main", "UI Animation Main", "Branded Motion", "UI Animation", "Lottie Animation"];

type CardItem = {
  label: string;
  section: string;
  imageUrl: string;
};

const defaultItems: CardItem[] = [
  { label: "Lottie Animation", section: SECTIONS[0], imageUrl: "" },
  { label: "UI Animation", section: SECTIONS[1], imageUrl: "" },
  { label: "Branded motion", section: SECTIONS[2], imageUrl: "" },
  { label: "UI Animation", section: SECTIONS[3], imageUrl: "" },
  { label: "Lottie Animation", section: SECTIONS[4], imageUrl: "" },
];

type Props = {
  slug?: string;
};

export default function VisualProofSection({ slug }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<CardItem[]>(defaultItems);
  const [loadingPictures, setLoadingPictures] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoadingPictures(false);
      return;
    }
    setLoadingPictures(true);
    (async () => {
      try {
        const res: any = await httpService.get(`/project/picture/get?slug=${slug}`);
        const pictures: any[] = res?.data ?? res ?? [];
        if (Array.isArray(pictures) && pictures.length > 0) {
          setItems(prev => prev.map(item => {
            const match = pictures.find((p: any) => p.section === item.section);
            const backendUrl = match?.filepath || match?.imageUrl || match?.url || match?.path || "";
            return backendUrl ? { ...item, imageUrl: backendUrl } : item;
          }));
        }
      } catch (err: any) {
        console.warn("[VisualProofSection] Failed to fetch backend pictures, using fallback:", err);
      } finally {
        setLoadingPictures(false);
      }
    })();
  }, [slug]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const fixImageUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/media/") || url.startsWith("/uploads/")) {
      return `${import.meta.env.PUBLIC_API_URL}${url}`;
    }
    return url;
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .skeleton-shimmer {
          background: #0a1d24;
        }
        /* Shine animates via transform (GPU-composited), not background-position (repaints every frame) */
        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          inset: 0 -60%;
          background: linear-gradient(100deg, transparent 40%, #10262e99 50%, transparent 60%);
          transform: translateX(-50%);
          animation: skeleton-shimmer 1.6s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes skeleton-shimmer {
          from { transform: translateX(-50%); }
          to { transform: translateX(50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer::after { animation: none; opacity: 0; }
        }
      `,
        }}
      />

      <div
        ref={containerRef}
        className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight text-cyan-300 sm:text-[34px] lg:text-[38px]">
            Visual Proof
          </h2>
          <p className="mt-2 text-[15px] text-white/70 sm:text-base">
            Built to explain. Designed to convert.
          </p>
        </div>

        {/* گرید 3 ستونه */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {items.map((item, index) => {
            const isWide = index === 0; // کارت اول دو ستون میگیره
            const isTopRow = index < 2; // دو کارت اول ردیف بالا هستن

            // While fetching: show skeletons for all cards.
            // After fetch: only render cards that actually have a picture.
            if (!loadingPictures && !item.imageUrl && !item.imageUrl.startsWith("/case/")) {
              return null;
            }

            return (
              <article
                key={index}
                data-reveal
                style={{ transitionDelay: `${index * 0.1}s` }}
                className={`group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#071a21] shadow-lg transition-colors hover:border-cyan-400/40
                  ${isWide ? "md:col-span-2" : "md:col-span-1"}
                  ${isTopRow ? "min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]" : "min-h-[220px] sm:min-h-[240px] lg:min-h-[280px]"}
                `}
              >
                {loadingPictures || !item.imageUrl ? (
                  <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <ImageWithSkeleton
                    key={item.imageUrl}
                    src={fixImageUrl(item.imageUrl)}
                    alt={item.label}
                  />
                )}

                <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md">
                  {item.label}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  return (
    <div className="absolute inset-0">
      {/* Skeleton only renders when needed — cached images skip it entirely */}
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        // Cached images never fire onLoad after hydration — catch them here
        ref={(el) => {
          if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

