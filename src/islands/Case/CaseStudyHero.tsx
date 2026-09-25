import React, { useState, useEffect } from "react";

interface CaseData {
  avatar?: string;
  title?: string;
  description?: string;
  tools?: { name: string; iconUrl?: string }[];
  projectType?: string;
  projectTimeline?: string;
}

const DEFAULT_DATA: CaseData = {
  title: "CryptoZen",
  description:
    "CryptoZen is a crypto education brand aiming to make blockchain simple, engaging, and actionable. Our mission was to help them scale their content and grow their audience across Instagram, TikTok, and YouTube, with a focus on driving VIP membership conversions through high-retention, short-form video.",
  tools: [
    { name: "Blender", iconUrl: "/case/blender.webp" },
    { name: "Illustrator", iconUrl: "/case/ai.webp" },
    { name: "Photoshop", iconUrl: "/case/ps.webp" },
    { name: "After Effects", iconUrl: "/case/ae.webp" },
  ],
  projectType: "Subscription",
  projectTimeline: "9 Months",
  avatar: "/case/hero-case.webp",
};

type Props = {
  slug?: string;
};

export default function CaseStudyHero({ slug }: Props) {
  const [data, setData] = useState<CaseData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.PUBLIC_API_URL;
        const response = await fetch(
          `${API_URL}/project/details?slug=${slug}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        setData((prev) => ({ ...prev, ...json }));
      } catch (err) {
        console.warn("[CaseStudyHero] Using fallback data:", err);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const {
    title = DEFAULT_DATA.title,
    description = DEFAULT_DATA.description,
    tools = DEFAULT_DATA.tools,
    projectType = DEFAULT_DATA.projectType,
    projectTimeline = DEFAULT_DATA.projectTimeline,
    avatar = DEFAULT_DATA.avatar,
  } = data;

  const API_URL = import.meta.env.PUBLIC_API_URL;
  const imageUrl = avatar?.startsWith("http")
    ? avatar
    : `${API_URL}${avatar}`;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        {/* Left */}
        <div className="w-full lg:w-[48%] animate-slide-up">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-cyan-300 sm:text-4xl lg:text-[3.35rem]">
            {loading ? "Loading..." : title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-[15px] lg:text-base">
            {description}
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold text-white/80">Tools:</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {tools?.map((tool, i) => (
                <div
                  key={i}
                  className="group flex h-11 min-w-11 items-center justify-center rounded-xl transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {tool.iconUrl ? (
                    <img
                      src={tool.iconUrl}
                      alt={tool.name}
                      width="28"
                      height="28"
                      className="h-7 w-7 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold tracking-wide text-white/45">
                      {tool.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#061b21]/90 px-4 py-2 text-sm text-white/75">
              <img src="/case/layers.webp" alt="Layers" />
              <span>Project Type : {projectType}</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#061b21]/90 px-4 py-2 text-sm text-white/75">
              <img src="/case/clock.webp" alt="Clock" />
              <span>Project Timeline : {projectTimeline}</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-[52%] animate-fade-in">
          <div className="relative mx-auto w-full max-w-[620px]">
            <div className="absolute inset-0 rounded-[28px] bg-[#061b21]/30 blur-[38px]" />

            <div className="relative overflow-hidden rounded-[28px]">
              <img
                src={imageUrl}
                alt={title}
                width="1200"
                height="900"
                loading="lazy"
                className="block h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
