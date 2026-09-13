"use client";

import { useEffect, useRef, useState } from "react";
import { Edit2, Loader2, X } from "lucide-react";
import { httpService } from "@/utils/httpService.ts";

const SECTIONS = ["Lottie Animation Main", "UI Animation Main", "Branded Motion", "UI Animation", "Lottie Animation"];

type CardItem = {
  label: string;
  section: string;
  imageUrl: string;
};

const defaultItems: CardItem[] = [
  { label: "Lottie Animation", section: SECTIONS[0], imageUrl: "/case/rframe.webp" },
  { label: "UI Animation", section: SECTIONS[1], imageUrl: "/case/lframe.webp" },
  { label: "Branded motion", section: SECTIONS[2], imageUrl: "/case/b1f.webp" },
  { label: "UI Animation", section: SECTIONS[3], imageUrl: "/case/b2f.webp" },
  { label: "Lottie Animation", section: SECTIONS[4], imageUrl: "/case/b3f.webp" },
];

type Props = {
  slug?: string;
};

function getErrorMessage(err: any): string {
  if (err?.response) {
    const status = err.response.status;
    const body = err.response.data;
    const detail = typeof body === "string" ? body : body?.message || body?.error || body?.detail || JSON.stringify(body);
    return `HTTP ${status} — ${detail}`;
  }
  return err instanceof Error ? err.message : String(err);
}

export default function AdminVisualProofSection({ slug: propSlug }: Props) {
  const slug = propSlug || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<CardItem[]>(defaultItems);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [loadingPictures, setLoadingPictures] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!slug) return;
    setLoadingPictures(true);
    setFetchError(null);
    (async () => {
      try {
        const res: any = await httpService.get(`/project/picture/get?slug=${slug}`);
        const pictures: any[] = res?.data ?? res ?? [];
        console.log("[VisualProof] GET response:", pictures);
        setItems(prev => prev.map(item => {
          const match = pictures.find((p: any) => p.section === item.section);
          const backendUrl = match?.filepath || match?.imageUrl || match?.url || "";
          return backendUrl ? { ...item, imageUrl: backendUrl } : item;
        }));
      } catch (err: any) {
        console.error("[VisualProof] GET failed:", err);
        setFetchError(getErrorMessage(err));
      } finally {
        setLoadingPictures(false);
      }
    })();
  }, [slug, retryCounter]);

  const showUploadError = (msg: string) => {
    setUploadError(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setUploadError(null), 8000);
  };

  const handleImageEdit = (index: number) => {
    setEditingIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || editingIndex === null) return;
    e.target.value = "";

    setSaving(editingIndex);
    setUploadError(null);
    try {
      const section = items[editingIndex].section;
      const formData = new FormData();
      formData.append("picture", file);
      const res: any = await httpService.post(
        `/project/picture/add?slug=${slug}&section=${encodeURIComponent(section)}`,
        formData,
      );
      console.log("[VisualProof] POST response:", res?.data);
      const newUrl = res?.data?.filepath || res?.data?.imageUrl || res?.data?.url || URL.createObjectURL(file);
      console.log("[VisualProof] new imageUrl:", newUrl);
      setItems(prev => prev.map((item, i) => i === editingIndex ? { ...item, imageUrl: newUrl } : item));
    } catch (err: any) {
      console.error("[VisualProof] Upload failed:", err?.response?.data || err);
      showUploadError(getErrorMessage(err));
    } finally {
      setSaving(null);
      setEditingIndex(null);
    }
  };

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

        {uploadError && (
          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200 backdrop-blur-sm">
            <X className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer" onClick={() => setUploadError(null)} />
            <span className="flex-1">{uploadError}</span>
          </div>
        )}

        {fetchError && !loadingPictures && (
          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-200 backdrop-blur-sm">
            <X className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer" onClick={() => setFetchError(null)} />
            <span className="flex-1">{fetchError}</span>
            <button
              onClick={() => setRetryCounter(c => c + 1)}
              className="shrink-0 rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* گرید 3 ستونه */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {items.map((item, index) => {
            const isWide = index === 0;
            const isTopRow = index < 2;

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
                {item.imageUrl ? (
                <img
                  src={item.imageUrl.startsWith("http") ? item.imageUrl : item.imageUrl.startsWith("/media/") ? `${import.meta.env.PUBLIC_API_URL}${item.imageUrl}` : item.imageUrl}
                  alt={item.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#071a21] text-white/30 text-sm">
                    No image
                  </div>
                )}

                <button
                  onClick={() => handleImageEdit(index)}
                  disabled={saving !== null}
                  className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white/60 opacity-0 backdrop-blur-sm transition-all hover:bg-cyan-400/20 hover:text-cyan-300 group-hover:opacity-100 disabled:opacity-50 cursor-pointer"
                  aria-label="Edit image"
                >
                  {saving === index ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </button>

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
