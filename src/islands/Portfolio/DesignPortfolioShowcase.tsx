import { SmartImage } from "../../utils/SmartImage.tsx";
import { getCategoryHref } from "../../utils/categoryLinks";

type DesignShowcaseItem = {
  id: string;
  title: string;
  category: string;
  src: string;
  className: string;
};

const designShowcaseItems: DesignShowcaseItem[] = [
  {
    id: "top-1",
    title: "Branded Motion",
    category: "Branded motion",
    src: "/portfolio/design-showcase/top-1.webp",
    className: "md:col-span-4 md:row-span-2 md:row-start-1  ",
  },
  {
    id: "top-2",
    title: "UI Animation",
    category: "UI Animation",
    src: "/portfolio/design-showcase/top-2.webp",
    className: "md:col-span-4 md:row-span-2 md:row-start-1",
  },
  {
    id: "top-3",
    title: "Lottie Animation",
    category: "Lottie Animation",
    src: "/portfolio/design-showcase/top-3.webp",
    className: "md:col-span-4 md:row-span-2 md:row-start-1",
  },
  {
    id: "bottom-left",
    title: "Lottie Animation",
    category: "Lottie Animation",
    src: "/portfolio/design-showcase/bottom-left.webp",
    className: "md:col-span-6 md:row-span-3 md:row-start-3",
  },
  {
    id: "mid-1",
    title: "UI Animation",
    category: "UI Animation",
    src: "/portfolio/design-showcase/top-3.webp",
    className: "md:col-span-3 md:col-start-7  md:row-start-3",
  },
  {
    id: "mid-2",
    title: "UI Animation",
    category: "UI Animation",
    src: "/portfolio/design-showcase/mid-2.webp",
    className: "md:col-span-3 md:col-start-10 md:row-span-2 md:row-start-3 ",
  },
  {
    id: "bot-1",
    title: "UI Animation",
    category: "UI Animation",
    src: "/portfolio/design-showcase/bot-1.webp",
    className: "md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-4 ",
  },
  {
    id: "bot-2",
    title: "UI Animation",
    category: "UI Animation",
    src: "/portfolio/design-showcase/top-3.webp",
    className: "md:col-span-3 md:col-start-10 md:row-start-5",
  },
];

export const DesignPortfolioShowcase = () => {
  return (
    <section
      className="relative isolate overflow-hidden pb-20 animate-fade-in"
    >
      <div
        aria-hidden="true"
        className="portfolio-design-bg pointer-events-none absolute inset-y-0 left-1/2 h-full w-screen -translate-x-1/2 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/portfolio/bg-vectors/Design-Showcase.svg')",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* HEADER */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm text-white font-thin tracking-[0.2em]">
            OUR WORK
          </span>
          <h2 className="bg-linear-to-r from-cyan-400 via-[#00E6D7] to-[#00A9BD] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
            Design portfolio
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
            More than aesthetics.
          </p>
        </div>

        {/* 📱 MOBILE (فقط 4 تا) */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:hidden">
          {designShowcaseItems.slice(0, 4).map((item) => (
            <article
              key={item.id}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#071A28] h-[160px]"
            >
              <img
                src={item.src}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3">
                <span className="text-xs text-white/85">{item.category}</span>
              </div>
              <a
                href={getCategoryHref(item.category)}
                className="absolute inset-0 z-10 rounded-2xl"
                aria-label={`View our ${item.category} work`}
              />
            </article>
          ))}
        </div>

        {/* 💻 DESKTOP (همه + layout اصلی) */}
        <div className="hidden sm:grid mt-8 grid auto-rows-[120px] grid-cols-1 gap-4 sm:auto-rows-[145px] sm:grid-cols-2 md:grid-cols-12 md:auto-rows-[160px]">
          {designShowcaseItems.map((item) => (
            <article
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#071A28] ${item.className}`}
            >
              <SmartImage
                src={item.src}
                alt={item.title}
                fill
                objectFit="cover"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3">
                <span className="inline-block rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs text-white/85">
                  {item.category}
                </span>
              </div>
              <a
                href={getCategoryHref(item.category)}
                className="absolute inset-0 z-10 rounded-2xl"
                aria-label={`View our ${item.category} work`}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// Delays the decorative background slightly so content can establish first.
// This keeps the SVG from competing with the initial card/image paint.
