"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

// ایمپورت استایل‌های Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";
import "./UiUxPricingSlider.css";
import PrimaryButton from "@/components/Shared/PrimaryButton";
import SecondaryButton from "@/components/Shared/SecondaryButton";

// اضافه کردن کارت‌های بیشتر (۵ کارت)
const slides = [
  {
    id: 1,
    eyebrow: "Fixed Scope Project",
    price: "Starting from $1,200",
    unit: "per project",
    description:
      "Ideal for websites, landing pages, SaaS platforms, dashboards, and mobile applications\n" +
        "with clearly defined requirements.",
    features: [
      "User Research & UX Planning",
      "Wireframes & User Flows",
      "High Fidelity UI Design",
      "Responsive Desktop & Mobile Layouts",
      "Design System Foundations",
      "Figma Source Files",
    ],
    primaryCta: "Request a Proposal",
    secondaryCta: "Book a Call",
    mainImage: "/uiux/slidebg.webp",
    floatingTags: [
      "/pricing/tag-price-1.webp",
      "/pricing/tag-price-2.webp",
      "/pricing/tag-branding.webp",
      "/pricing/tag-ui.webp",
      "/pricing/device-small.webp",
      "/pricing/tag-off.webp",
    ],
  },

];

export default function UiUxPricingSlider() {
  return (
    <section className="pricing-slider-section">
      <div className="pricing-slider-shell">
        {/* هدر */}
        <div className="pricing-slider-header">
          <h2 className="pricing-slider-title">
            <span className="title-line">Flexible Pricing for </span>
            <span className="title-line">
              <span className="title-accent">UI/UX Projects</span>
            </span>
          </h2>
          <p className="pricing-slider-subtitle">
            Choose a fixed scope project or a dedicated design partnership based on your product,
            goals, and timeline.
          </p>
        </div>

        {/* بدنه اسلایدر */}
        <div className="pricing-slider-stage">
          {/* دکمه قبلی */}
          <button
            className="pricing-nav pricing-prev"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <Swiper
            modules={[Navigation, Pagination, EffectCreative]}
            effect="creative"
            // افکت خفن اسلاید: کارت قبلی محو میشه میره عقب، کارت بعدی میاد رو
            creativeEffect={{
              prev: {
                shadow: true,
                translate: ["-20%", 0, -1],
                opacity: 0,
              },
              next: {
                translate: ["100%", 0, 0],
              },
            }}
            slidesPerView={1}
            spaceBetween={0}
            speed={800}
            loop={true}
            navigation={{
              prevEl: ".pricing-prev",
              nextEl: ".pricing-next",
            }}
            pagination={{
              el: ".pricing-pagination",
              clickable: true,
            }}
            className="pricing-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <article className="pricing-card">
                  <div className="pricing-card-bg" />

                  <div className="pricing-card-content">
                    {/* بخش متن چپ */}
                    <div className="pricing-copy">
                      <p className="pricing-eyebrow">{slide.eyebrow}</p>

                      <div className="pricing-price-row">
                        <h3 className="pricing-price">{slide.price}</h3>
                        <span className="pricing-unit">{slide.unit}</span>
                      </div>

                      <p className="pricing-description">{slide.description}</p>

                      <div className="pricing-features-title">
                        What's included
                      </div>
                      <div className="pricing-features">
                        {slide.features.map((feature) => (
                          <div className="pricing-feature" key={feature}>
                            <span className="pricing-feature-icon">
                              <Check size={12} strokeWidth={3} />
                            </span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pricing-actions">

                        <PrimaryButton text={slide.primaryCta} width="auto" />

                        <SecondaryButton
                          text={slide.secondaryCta}
                          width="auto"

                        />
                      </div>
                    </div>

                    {/* بخش تصویر راست */}
                    <div className="pricing-visual">
                      <div className="visual-wrap">
                        {/* تگ‌های شناور اطراف مانیتور */}
                        <img
                          className="float-card float-1"
                          src={slide.floatingTags[0]}
                          alt=""
                        />
                        <img
                          className="float-card float-2"
                          src={slide.floatingTags[1]}
                          alt=""
                        />
                        <img
                          className="float-card float-3"
                          src={slide.floatingTags[2]}
                          alt=""
                        />
                        <img
                          className="float-card float-4"
                          src={slide.floatingTags[3]}
                          alt=""
                        />
                        <img
                          className="float-card float-5"
                          src={slide.floatingTags[4]}
                          alt=""
                        />
                        <img
                          className="float-card float-6"
                          src={slide.floatingTags[5]}
                          alt=""
                        />

                        <div className="screen-frame">
                          <img
                            src={slide.mainImage}
                            alt="UI/UX mockup"
                            className="screen-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* دکمه بعدی */}
          <button className="pricing-nav pricing-next" aria-label="Next slide">
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* نقطه‌های پایین */}
        <div className="pricing-pagination" />
      </div>
    </section>
  );
}
