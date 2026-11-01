import {
  Coins,
  SlidersHorizontal,
  Subtitles,
  Video,
  Sparkles,
  FileText,
  Zap,
  RotateCcw,
  Calendar,
  ChevronRight,
  Pencil,
  Play,
  Info,
  CheckCircle2,
} from "lucide-react";

type SummaryLine = {
  title: string;
  value: string;
  price: number;
};

type Props = {
  packageName: string;
  lines: SummaryLine[];
  total: number;
  duration?: number;
  durationTitle?: string;
  deliveryHint?: string;
  onEdit?: () => void;
};

const PACKAGE_META: Record<string, { description: string; image: string }> = {
  "Talking Head Editing": {
    description: "Clean, professional edits for interviews, explainer videos, courses, and more.",
    image: "/videoEditing.webp",
  },
  "Product Trailers & Explainers": {
    description: "High-impact product videos and explainers designed to engage and convert.",
    image: "/video-pieces/Featured-One.webp",
  },
  "Social Media Animation Reels": {
    description: "Fast-paced, hook-driven motion reels tailored for TikTok, Reels, and Shorts.",
    image: "/animation-section/short-form.webp",
  },
  "2D Animation": {
    description: "Custom 2D motion graphics and character animation crafted for your story.",
    image: "/animation-section/motion.webp",
  },
  "3D Animation": {
    description: "Cinematic 3D animation and product renders that elevate brand perception.",
    image: "/animation-section/3D.webp",
  },
  "Branding & Design": {
    description: "Comprehensive brand identity, design systems, and visual assets.",
    image: "/animation-section/brandidentity.webp",
  },
  "UI/UX Design": {
    description: "Interactive, modern UI/UX design crafted for digital products and SaaS.",
    image: "/animation-section/uiux.webp",
  },
  "CGI & Character Animation": {
    description: "Advanced CGI and character animation for immersive visual experiences.",
    image: "/animation-section/Animated_boy.webp",
  },
  "Monthly Content Packages": {
    description: "Dedicated monthly design and video production to scale your brand.",
    image: "/retainers/1.webp",
  },
};

function getOptionIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("base") || t.includes("price") || t.includes("cost") || t.includes("budget")) return Coins;
  if (t.includes("style") || t.includes("type") || t.includes("complexity")) return SlidersHorizontal;
  if (t.includes("caption") || t.includes("subtitle")) return Subtitles;
  if (t.includes("b-roll") || t.includes("camera") || t.includes("video")) return Video;
  if (t.includes("motion") || t.includes("graphic") || t.includes("animation")) return Sparkles;
  if (t.includes("source") || t.includes("footage") || t.includes("asset") || t.includes("script")) return FileText;
  if (t.includes("speed") || t.includes("delivery") || t.includes("timeline")) return Zap;
  if (t.includes("revision") || t.includes("round")) return RotateCcw;
  return CheckCircle2;
}

function formatValue(value: string) {
  const dollarMatch = value.match(/^(\$[\d,]+)(\s+.*)?$/i);
  if (dollarMatch) {
    return (
      <>
        <span className="font-bold text-white">{dollarMatch[1]}</span>
        {dollarMatch[2] && (
          <span className="font-normal text-[#7A98A6]">{dollarMatch[2]}</span>
        )}
      </>
    );
  }
  return <span className="font-medium text-white">{value}</span>;
}

export const SummaryPanel = ({
  packageName,
  lines,
  total,
  duration,
  deliveryHint,
  onEdit,
}: Props) => {
  const formatter = new Intl.NumberFormat("en-US");
  const pkgMeta = PACKAGE_META[packageName] || {
    description: "Clean, professional production tailored to your project requirements.",
    image: "/videoEditing.webp",
  };

  const deliveryTime = deliveryHint
    ? deliveryHint.replace(/^(Delivery:\s*|Standard\s*\()?/i, "").replace(/\)$/, "").trim() || "5–7 business days"
    : "5–7 business days";

  const lengthOption = lines.find((l) =>
    /video\s*length|duration/i.test(l.title)
  );

  const formattedDuration = lengthOption
    ? lengthOption.value
    : duration
    ? duration >= 60
      ? duration % 60 === 0
        ? `${duration / 60} minute${duration > 60 ? "s" : ""}`
        : `${duration} seconds`
      : `${duration} seconds`
    : "1 minute";

  const isMonthly = packageName.toLowerCase().includes("monthly");
  const scopeLabel = isMonthly ? "Monthly Deliverables" : "Estimated Video Length";
  const scopeValue = isMonthly
    ? lines.find((l) => /reels/i.test(l.title))?.value || "Monthly Retainer"
    : formattedDuration;

  const displayLines = lengthOption
    ? lines.filter((l) => l !== lengthOption)
    : lines;

  return (
    <div className="w-full max-w-[500px] lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-[28px] border border-[#0D3B47] bg-[#03151D] p-5 sm:p-7 lg:p-9 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_-10px_rgba(0,229,255,0.08)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-0 lg:pb-6 lg:border-b lg:border-[#0D3B47]/60">
          <div>
            <span className="text-[11px] lg:text-xs font-bold uppercase tracking-[0.16em] text-[#587B8A]">
              PROJECT SUMMARY
            </span>
            <h2 className="mt-1 text-2xl sm:text-[28px] lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Project Summary &amp; <br className="sm:hidden" />
              <span className="text-[#00E5FF]">Estimate</span>
            </h2>
          </div>
          <div className="flex h-11 w-11 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-xl border border-[#0D4B59] bg-[#052834]/80 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <FileText className="h-5 w-5 lg:h-6 lg:w-6" />
          </div>
        </div>

        {/* Responsive Layout: stacked on mobile, 2-column on desktop */}
        <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Column (Desktop 7 cols): Package & Selected Options */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Selected Package Card */}
            <div className="flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-[#0B3D4A] bg-[#041D26]/70 p-3.5 sm:p-4 lg:p-5">
              <div className="relative h-18 w-24 sm:h-20 sm:w-28 lg:h-22 lg:w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#06242F]">
                <img
                  src={pkgMeta.image}
                  alt={packageName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 backdrop-blur-xs text-white">
                    <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11px] lg:text-xs text-[#7A98A6] font-medium">Your Selected Package</span>
                <h3 className="mt-0.5 text-base sm:text-[17px] lg:text-lg font-bold text-white truncate">
                  {packageName}
                </h3>
                <p className="mt-0.5 text-[11px] sm:text-xs lg:text-[13px] text-[#7A98A6] leading-relaxed line-clamp-2">
                  {pkgMeta.description}
                </p>
              </div>
            </div>

            {/* Selected Options */}
            <div className="rounded-2xl border border-[#0B3D4A]/60 bg-[#041D26]/40 p-4 sm:p-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h4 className="text-sm sm:text-base font-semibold text-white">Your Selected Options</h4>
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#0E5866] bg-[#082C36] px-3.5 py-1 text-xs font-semibold text-[#00E5FF] hover:bg-[#0E3D4A] transition-colors cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                )}
              </div>

              <div className="mt-3.5 divide-y divide-white/[0.04]">
                {displayLines.map((line, i) => {
                  const Icon = getOptionIcon(line.title);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 text-xs sm:text-[13px] lg:text-sm"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 text-white/85 min-w-0 pr-3">
                        <Icon className="h-4 w-4 text-[#00E5FF] shrink-0" />
                        <span className="truncate">{line.title}</span>
                      </div>
                      <div className="shrink-0 text-right">
                        {formatValue(line.value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (Desktop 5 cols): Investment, Delivery & CTA */}
          <div className="lg:col-span-5 flex flex-col gap-4 mt-6 lg:mt-0">
            {/* Estimated Investment Card */}
            <div className="rounded-2xl border border-[#0D4B59] bg-[#04242F]/70 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-semibold text-white">Estimated Investment</span>
                <Info className="h-4 w-4 text-[#00E5FF]" />
              </div>

              <div className="mt-3.5 flex items-center justify-between rounded-xl bg-[#031B23] px-3.5 sm:px-4 py-2.5 text-xs sm:text-[13px] lg:text-sm">
                <span className="text-[#7A98A6] font-medium">{scopeLabel}</span>
                <span className="font-semibold text-white">{scopeValue}</span>
              </div>

              <div className="my-4 border-b border-dashed border-[#0E4654]" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm sm:text-base font-bold text-white">Total Estimated Cost</div>
                  <div className="text-[11px] text-[#5A7A85]">Based on your selected options</div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#00E5FF] tracking-tight">
                    ${formatter.format(total)}
                  </span>
                  <span className="ml-1.5 text-xs font-bold text-[#7A98A6]">USD</span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery Time */}
            <div className="flex items-center justify-between rounded-2xl border border-[#0D4B59] bg-[#04242F]/50 p-3.5 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#072D38] text-[#00E5FF] shrink-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#7A98A6] font-medium">Estimated Delivery Time</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">{deliveryTime}</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#5A7A85]" />
            </div>

            {/* Proceed to Contact CTA */}
            <a
              href="/contact"
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00D2E5] to-[#0D9488] py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-[0_0_25px_rgba(0,210,229,0.35)] transition-all hover:brightness-110 active:scale-[0.99]"
            >
              <span>Proceed to Contact</span>
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </a>

            {/* Edit Selection Link */}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-[#00E5FF] hover:text-[#52f0ff] transition-colors cursor-pointer py-1"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit Selection</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
