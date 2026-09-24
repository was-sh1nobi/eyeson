"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { useAutoplayAllowed } from "@/utils/useAutoplayAllowed";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "./UiUxAppSlider.css";

const baseScreens = [
  { id: 1, src: "/uiux/mobile-frame1.webp", alt: "App Screen 1" },
  { id: 2, src: "/uiux/mobile-frame2.webp", alt: "App Screen 2" },
  { id: 3, src: "/uiux/mobile-frame1.webp", alt: "App Screen 3 (Appointy)" },
  { id: 4, src: "/uiux/mobile-frame2.webp", alt: "App Screen 4" },
  { id: 5, src: "/uiux/mobile-frame1.webp", alt: "App Screen 5" },
  { id: 6, src: "/uiux/mobile-frame2.webp", alt: "App Screen 6" },
  { id: 7, src: "/uiux/mobile-frame1.webp", alt: "App Screen 7" },
];

const appScreens = [
  ...baseScreens.map((s) => ({ ...s, id: `${s.id}-a` })),
  ...baseScreens.map((s) => ({ ...s, id: `${s.id}-b` })),
  ...baseScreens.map((s) => ({ ...s, id: `${s.id}-c` })),
];

export default function UiUxAppSlider() {
  const autoplayAllowed = useAutoplayAllowed();
  return (
    <section className="app-slider-section">
      <div className="app-slider-header">
        <h2 className="app-slider-title">
          <span className="title-teal">Mobile App </span>Design Portfolio
        </h2>
        <p className="app-slider-subtitle">
          Explore a selection of mobile applications designed for usability, engagement, and
          seamless user experiences
        </p>
      </div>

      <div className="app-slider-container">
        <div className="fade-edge fade-left"></div>
        <div className="fade-edge fade-right"></div>

        <Swiper
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          initialSlide={7}
          loop={true}
          loopAdditionalSlides={3}
          speed={600}
          autoplay={autoplayAllowed ? {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          coverflowEffect={{
            rotate: 0,
            stretch: -40,
            depth: 150,
            modifier: 1,
            slideShadows: false,
          }}
          className="app-swiper"
        >
          {appScreens.map((screen) => (
            <SwiperSlide key={screen.id} className="app-slide">
              <div className="mockup-frame">
                <div className="mockup-notch"></div>
                <img
                  src={screen.src}
                  alt={screen.alt}
                  className="mockup-screen"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
