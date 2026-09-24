import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { SmartImage } from "@/utils/SmartImage.tsx";
import { useAutoplayAllowed } from "@/utils/useAutoplayAllowed";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "./ProcessScrollSection.css";

export default function HomeServicesSection() {
  const [activeTab, setActiveTab] = useState("animation");
  const autoplayAllowed = useAutoplayAllowed();

  const animationServices = [
    {
      id: 1,
      title: "Product Launch Videos",
      description:
        "High impact videos built to introduce new products, features, apps, SaaS tools, and\n" +
          "campaigns with clarity, energy, and a premium first impression.",
      image: "/animation-section/short-form.webp",
    },
    {
      id: 2,
      title: "Explainer Videos",
      description:
        "Clear animated videos that simplify complex SaaS and AI products, services, or ideas, so\n" +
          "your audience understands the value fast.",
      image: "/animation-section/3D.webp",
    },
    {
      id: 3,
      title: "Motion Graphics",
      description:
        "Clean animated visuals, text, icons, UI elements, and brand motion designed to make your\n" +
          "content feel sharper and more modern.",
      image: "/animation-section/motion.webp",
    },
    {
      id: 4,
      title: "Short Form Social Videos",
      description:
        "High retention videos for Reels, TikTok, Shorts, ads, and daily social content built to grab\n" +
          "attention and support growth.",
      image: "/animation-section/video.webp",
    },
    {
      id: 5,
      title: "Talking Head Video Editing",
      description:
        "Sharp editing for podcasts, founder videos, educational content, YouTube, and personal\n" +
          "brands that need to hold attention longer.",
      image: "/animation-section/short-form.webp",
    },
    {
      id: 6,
      title: "2D / 3D Animation",
      description:
        "Custom animated scenes, product visuals, characters, and premium brand storytelling for\n" +
          "content that needs more depth and impact.",
      image: "/animation-section/3D.webp",
    },
    {
      id: 7,
      title: "SaaS Product Videos",
      description:
        "Modern product videos for software, apps, and tech brands, including UI walkthroughs,\n" +
          "feature videos, demos, and launch explainers.",
      image: "/animation-section/motion.webp",
    },
    {
      id: 8,
      title: "Video Ads & Creatives",
      description:
        "Performance-focused video creatives for paid ads, campaigns, hooks, variations, and\n" +
          "offers that need to convert attention into action.",
      image: "/animation-section/video.webp",
    },
  ];

  const designServices = [
    {
      id: 1,
      title: "Ad Creatives",
      description:
        "Scroll stopping static and motion ad visuals designed to make your offer clear, your brand\n" +
          "look sharper, and your campaigns feel more professional.",
      image: "/animation-section/adcreatives.webp",
    },
    {
      id: 2,
      title: "Brand Identity",
      description:
        "Visual identity design that gives your brand a clear, consistent look across logos, colors,\n" +
          "typography, social content, and digital touchpoints.",
      image: "/animation-section/brandidentity.webp",
    },
    {
      id: 3,
      title: "UI/UX Design",
      description:
        "Clean interface and experience design for websites, apps, landing pages, and product\n" +
          "screens that need to feel modern, simple, and easy to use.",
      image: "/animation-section/uiux.webp",
    },
    {
      id: 4,
      title: "Graphic Design",
      description:
          "Professional graphics for social posts, carousels, banners, pitch decks, thumbnails, and\n" +
          "marketing assets that keep your brand looking consistent.",
      image: "/animation-section/adcreatives.webp",
    }
  ];
  const services =
    activeTab === "animation" ? animationServices : designServices;

  return (
    <section className="relative pb-[var(--space-2xl)] lg:pb-[var(--space-3xl)] overflow-hidden">
      <svg
        height="963"
        viewBox="0 0 1440 963"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute pointer-events-none w-full top-5 opacity-45 lg:opacity-70"
        aria-hidden="true"
      >
        <defs>{/* ... (Your existing SVG defs) ... */}</defs>
      </svg>

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-[var(--space-gutter)] sm:px-[var(--space-gutter-md)] lg:px-[var(--space-gutter-lg)]">
        <div className="text-center mb-10 lg:mb-16">
          <p className="text-caption text-white/50 mb-3 tracking-[0.2em]">
            We can create everything for you
          </p>

          <h2 className="text-h2 mb-6 leading-[1.2] lg:leading-tight text-white px-2">
            <span className="bg-gradient-to-r from-[var(--primitive-teal-400)] to-[#30B9C6] bg-clip-text text-transparent">
              Animation, motion, and design
            </span>
            <br className="hidden sm:block" /> services built for modern brands
          </h2>

          <div className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-[var(--color-border)] backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("animation")}
              className={`px-5 py-2 lg:px-8 lg:py-3 rounded-full cursor-pointer font-medium text-xs lg:text-sm transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ${
                activeTab === "animation"
                  ? "text-white shadow-[var(--elevation-glow)]"
                  : "text-white/60 hover:text-white"
              }`}
              style={activeTab === "animation" ? { backgroundImage: "var(--button-primary-bg)" } : undefined}
              aria-pressed={activeTab === "animation"}
            >
              Motion & Video
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={`px-5 py-2 lg:px-8 lg:py-3 rounded-full cursor-pointer font-medium text-xs lg:text-sm transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ${
                activeTab === "design"
                  ? "text-white shadow-[var(--elevation-glow)]"
                  : "text-white/60 hover:text-white"
              }`}
              style={activeTab === "design" ? { backgroundImage: "var(--button-primary-bg)" } : undefined}
              aria-pressed={activeTab === "design"}
            >
              Design & Branding
            </button>
          </div>
        </div>

        {/* Carousel for Mobile / Grid for Desktop */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={autoplayAllowed ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            breakpoints={{
              768: {
                slidesPerView: 2,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 4,
                centeredSlides: false,
              },
            }}
            className="services-swiper pb-12!"
          >
            {services.map((service) => (
              <SwiperSlide key={service.id} className="h-auto">
                <div className="group relative h-full py-4 w-full">
                  <div className="absolute inset-0 rounded-[var(--radius-2xl)] border border-[var(--color-border-teal)] bg-[var(--card-bg)] opacity-0 lg:group-hover:opacity-100 transition-opacity duration-[var(--duration-slow)]" aria-hidden="true" />

                    <div className="relative h-full bg-[#0f172a]/70 backdrop-blur-md rounded-[var(--radius-2xl)] border border-[var(--card-border)] overflow-hidden z-10 shadow-[var(--card-shadow)] transition-[transform,box-shadow,border-color] duration-[var(--duration-slow)] ease-[var(--ease-default)] lg:group-hover:-translate-y-1.5 lg:group-hover:shadow-[var(--card-shadow-hover)] flex flex-col">
                    <div className="relative h-40 lg:h-48 bg-[#020915] overflow-hidden m-2 rounded-[var(--radius-lg)] shrink-0 border border-white/[0.04]">
                      <SmartImage
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-[var(--duration-slower)] ease-[var(--ease-default)] lg:group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60" />
                    </div>

                    <div className="p-5 lg:p-6 text-center lg:text-left flex-1 flex flex-col justify-center">
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-2 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-white/60 text-xs lg:text-sm leading-relaxed font-light">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style {...({ jsx: "true", global: "true" } as any)}>{`
  .services-swiper .swiper-pagination-bullet {
    background: var(--color-primary) !important;
    opacity: 0.35;
    transition: background var(--duration-normal) var(--ease-default), opacity var(--duration-normal) var(--ease-default), width var(--duration-normal) var(--ease-default);
  }
  .services-swiper .swiper-pagination-bullet-active {
    opacity: 1;
    width: 22px;
    border-radius: var(--radius-sm);
  }
  .services-swiper .swiper-wrapper {
    align-items: stretch;
  }
  .services-swiper .swiper-slide {
    height: auto !important;
    display: flex;
  }
  @media (prefers-reduced-motion: reduce) {
    .services-swiper .swiper-slide { transition: none !important; }
  }
`}</style>
    </section>
  );
}
