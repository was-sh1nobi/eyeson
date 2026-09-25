"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type ChooserItem = { id: string | number; title: string; thumbnail: string; src: string };

export default function ShowreelChooser({
  isOpen,
  onClose,
  items,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: ChooserItem[];
  onSelect: (item: ChooserItem) => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);
  if (!isOpen) return null;
  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans isolate">
      <div onClick={onClose} className="absolute inset-0 bg-[#020610]/80 backdrop-blur-md" />
      <div className="relative w-full max-w-[720px] rounded-[24px] bg-[#0A101D] border border-white/10 p-4 sm:p-6 shadow-[0_0_60px_rgba(0,169,189,0.25)] animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base sm:text-lg">Choose showreel</h3>
          <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/70 hover:text-white hover:bg-white/20 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => { onSelect(it); onClose(); }}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black text-left hover:border-[#00A9BD]/60 hover:scale-[1.02] transition-[transform,border-color]"
            >
              <img src={it.thumbnail || it.src} alt={it.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0A101D] shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                </span>
              </div>
              <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">{it.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}
