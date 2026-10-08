import {memo, useEffect, useMemo, useState} from "react";

// Types for tab data
export type TabKey =
  | "client"
  | "industry"
  | "service"
  | "platforms"
  | "primaryGoal"
  | "ourRole"
  | "startingPoint";

export type TabItem = {
  key: TabKey;
  label: string;
  title: string;
  text: string;
};

// Default static tabs – used when no data is supplied by the parent
const DEFAULT_TABS: TabItem[] = [
  {
    key: "client",
    label: "Client",
    title: "CryptoZen",
    text:
      "CryptoZen is a crypto education brand focused on making blockchain content simple, engaging, and actionable. The goal was to grow awareness, build trust, and turn high-retention short-form content into membership conversions.",
  },
  {
    key: "industry",
    label: "Industry",
    title: "Crypto Education",
    text:
      "The industry needed short-form storytelling that could explain a complex topic without losing momentum. We created a clear visual language that made the brand feel confident, modern, and easy to follow across social platforms.",
  },
  {
    key: "service",
    label: "Service",
    title: "Video Strategy & Motion",
    text:
      "We combined scripting, motion design, and editing into one streamlined workflow. Each output was built to support retention, improve clarity, and keep the audience moving through the message without friction.",
  },
  {
    key: "platforms",
    label: "Platforms",
    title: "Instagram, TikTok, YouTube",
    text:
      "The content system was adapted for vertical social feeds and fast-scrolling viewers. Every cut, caption, and movement was tuned for platform-native engagement and stronger completion rates.",
  },
  {
    key: "primaryGoal",
    label: "Primary Goal",
    title: "Membership Growth",
    text:
      "The main objective was to convert attention into action. We designed the case study content to support VIP membership growth while keeping the tone educational, sharp, and visually memorable.",
  },
  {
    key: "ourRole",
    label: "Our Role",
    title: "Creative Direction + Execution",
    text:
      "We handled the concept translation, motion system, visual pacing, and delivery structure. The process was collaborative, fast, and aimed at producing a repeatable system for future campaigns.",
  },
  {
    key: "startingPoint",
    label: "Starting Point",
    title: "Content Audit & Brief",
    text:
      "We started by reviewing the existing content style, identifying what felt repetitive, and defining a more focused direction. From there, the creative brief became the foundation for every visual decision.",
  },
];

type Props = {
  slug?: string;
};

// Component – fetches data from API on mount, falls back to defaults
function CaseStudyTabsSection({ slug }: Props) {
  const [tabs, setTabs] = useState<TabItem[]>(DEFAULT_TABS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("industry");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.PUBLIC_API_URL;
        const response = await fetch(
          `${API_URL}/project/texts?slug=${slug}`,
          { credentials: "omit" }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const texts = await response.json();
        const mapped = texts.map((t: any) => ({
          key: t.section.replace(/\s+/g, "").toLowerCase(),
          label: t.section,
          title: t.title,
          text: t.description,
        }));
        if (mapped.length > 0) setTabs(mapped);
      } catch (err) {
        console.warn("[CaseStudyTabsSection] Using fallback tabs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const active = useMemo(
    () => tabs.find((tab) => tab.key === activeTab) ?? tabs[0],
    [activeTab, tabs],
  );

  // Typewriter effect for the active tab's text
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const timer = window.setInterval(() => {
      i += 2;
      setDisplayedText(active.text.slice(0, i));
      if (i >= active.text.length) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [activeTab, active.text]);

  return (
    <section className="relative overflow-hidden lg:py-40">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-[26px] border border-white/5 bg-[#07181d]/95 px-5 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-16 rounded bg-white/10 animate-pulse" />
              ))}
            </div>
            <div className="h-8 w-1/3 rounded-lg bg-white/10 animate-pulse mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-4/6 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
        ) : (
        <>
        <div className="mb-4 flex flex-nowrap items-center gap-6 overflow-x-auto pb-3 sm:gap-7 sm:justify-evenly [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onMouseEnter={() => setActiveTab(tab.key)}
                onFocus={() => setActiveTab(tab.key)}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "relative shrink-0 text-sm font-medium transition-colors duration-200 sm:text-[15px]",
                  isActive ? "text-cyan-300" : "text-white/35 hover:text-white/60",
                ].join(" ")}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.75)]" />
                )}
              </button>
            );
          })}
        </div>
        <div className="rounded-[26px] border border-white/5 bg-[#07181d]/95 px-5 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight text-white sm:text-[32px]">
            {active.title}
          </h2>
          <p className="mt-4 max-w-5xl text-[15px] leading-7 text-white/80 sm:text-base">
            {displayedText}
            <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-cyan-300 align-middle animate-pulse" />
          </p>
        </div>
        </>
        )}
      </div>
    </section>
  );
}

export default memo(CaseStudyTabsSection);
