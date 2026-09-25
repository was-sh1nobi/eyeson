"use client";

import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  Package,
  Megaphone,
  Palette,
  Rocket,
  Wand2,
  Repeat,
  LayoutGrid,
  Zap,
  BadgeCheck,
  CalendarClock,
  TrendingUp,
  FlaskConical,
  Users,
  Lightbulb,
  PenLine,
  LayoutPanelTop,
  Scissors,
  MonitorPlay,
  AudioWaveform,
  Copy,
  PackageCheck,
  Cloud,
  Sprout,
  Target,
  Briefcase,
  ShoppingCart,
  Building2,
  Eye,
  MousePointerClick,
  GraduationCap,
  Compass,
  Layers,
  HeartHandshake,
  SlidersHorizontal,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

type RetainerCard = {
  id: number;
  title: string;
  description: string;
};

type RetainerCardsGridProps = {
  eyebrow?: string;
  beforeTitle?: string;
  highlight?: string;
  afterTitle?: string;
  intro?: string;
  cards: RetainerCard[];
};

const iconMap: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["short-form", "video", "film"], icon: Clapperboard },
  { keywords: ["product video", "product content"], icon: Package },
  { keywords: ["ad creatives", "paid"], icon: Megaphone },
  { keywords: ["brand content", "brand story"], icon: Palette },
  { keywords: ["launch"], icon: Rocket },
  { keywords: ["motion graphic", "motion design", "motion"], icon: Wand2 },
  { keywords: ["repurpos", "adaptation", "reuse"], icon: Repeat },
  { keywords: ["static", "graphic"], icon: LayoutGrid },
  { keywords: ["faster", "speed"], icon: Zap },
  { keywords: ["consistent quality", "consistent"], icon: BadgeCheck },
  { keywords: ["predictable", "calendar"], icon: CalendarClock },
  { keywords: ["better over time", "growth", "scale"], icon: TrendingUp },
  { keywords: ["creative testing", "test", "experiment"], icon: FlaskConical },
  { keywords: ["less management", "management", "team"], icon: Users },
  { keywords: ["strategy", "concepts", "concept"], icon: Lightbulb },
  { keywords: ["script"], icon: PenLine },
  { keywords: ["storyboard"], icon: LayoutPanelTop },
  { keywords: ["editing", "edit"], icon: Scissors },
  { keywords: ["ui animation", "ui"], icon: MonitorPlay },
  { keywords: ["sound"], icon: AudioWaveform },
  { keywords: ["variation"], icon: Copy },
  { keywords: ["final delivery", "delivery"], icon: PackageCheck },
  { keywords: ["saas", "ai"], icon: Cloud },
  { keywords: ["startup"], icon: Sprout },
  { keywords: ["marketing team", "marketing"], icon: Target },
  { keywords: ["agenc"], icon: Briefcase },
  { keywords: ["ecommerce", "consumer", "commerce"], icon: ShoppingCart },
  { keywords: ["established", "brand"], icon: Building2 },
  { keywords: ["attention", "awareness"], icon: Eye },
  { keywords: ["acquisition"], icon: MousePointerClick },
  { keywords: ["education"], icon: GraduationCap },
  { keywords: ["conversion"], icon: TrendingUp },
  { keywords: ["retention"], icon: Repeat },
  { keywords: ["direction"], icon: Compass },
  { keywords: ["multi-disciplinary", "multi"], icon: Layers },
  { keywords: ["familiarity", "relationship"], icon: HeartHandshake },
  { keywords: ["flexible"], icon: SlidersHorizontal },
  { keywords: ["communication", "message"], icon: MessageSquare },
];

const DEFAULT_ICON: LucideIcon = ArrowUpRight;

function iconForTitle(title: string): LucideIcon {
  const normalized = title.toLowerCase();
  const match = iconMap.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );
  return match?.icon ?? DEFAULT_ICON;
}

export default function RetainerCardsGrid({
  eyebrow = "",
  beforeTitle = "",
  highlight = "",
  afterTitle = "",
  intro = "",
  cards = [],
}: RetainerCardsGridProps) {
  return (
    <section className="relative w-full overflow-hidden px-4 py-16 sm:px-6 lg:px-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1ed7d8]/30 bg-[#1ed7d8]/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-[#35e4d8]">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="mt-6 font-heading text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[44px]">
            {beforeTitle}
            {highlight ? (
              <>
                <br />
                <span className="bg-linear-to-r from-[#35e4d8] to-[#00A9BD] bg-clip-text text-transparent">
                  {highlight}
                </span>
              </>
            ) : null}
            {afterTitle ? <> {afterTitle}</> : null}
          </h2>
          {intro ? (
            <p className="mt-5 text-sm leading-7 text-[#c3d4de] md:text-base md:leading-8">
              {intro}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          {cards.map((card) => {
            const Icon = iconForTitle(card.title);

            return (
              <article
                key={card.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#FFFFFF14] bg-[#0A1D29]/70 p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#1ed7d8]/50 hover:shadow-[0_0_25px_rgba(0,168,182,0.15)]"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1ed7d8]/30 bg-[#1ed7d8]/10 text-[#35e4d8] transition-colors duration-300 group-hover:border-[#1ed7d8] group-hover:bg-[#1ed7d8] group-hover:text-black">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-white transition-colors duration-300 group-hover:text-[#35e4d8]">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-[#c3d4de]">
                    {card.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
