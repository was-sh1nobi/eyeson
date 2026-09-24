"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import { useAutoplayAllowed } from "@/utils/useAutoplayAllowed";

import TestimonialCard from "./TestimonialCard";

export default function TestimonialsSection() {
  const autoplayAllowed = useAutoplayAllowed();
  const [stars, setStars] = useState<
    Array<{ top: string; left: string; size: number; delay: number }>
  >([]);

  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = prefersReduced ? 0 : 12;
    const newStars = [...Array(count)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.8 + 1.1,
      delay: Math.random() * 2.2,
    }));
    setStars(newStars);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Crypto Elites",
      role: "Crypto Education Brand",
      avatar: "/customers/crypto-elites.webp",
      text: "We needed crypto content that looked more professional without making the message harder to understand. EyesOn helped us turn the ideas into clean animations that felt easy to watch, and one of the videos passed 500K+ views.",
      stars: 5,
    },
    {
      id: 2,
      name: "Cryptosity",
      role: "Crypto Media & Education",
      avatar: "/customers/cryptosisty.webp",
      text: "Our content already had strong ideas, but the editing needed to feel cleaner and more engaging. EyesOn improved the pacing, structure, captions, and overall look, which made the videos much easier to watch on social media.",
      stars: 4,
    },
    {
      id: 3,
      name: "Predictefy",
      role: "Prediction Market Platform",
      avatar: "/customers/predctfy.webp",
      text: "For our launch video, we needed something that could explain the product quickly and still feel exciting. EyesOn understood the concept fast, shaped the story, and delivered a video that felt polished, modern, and clear.",
      stars: 5,
    },
    {
      id: 4,
      name: "Kraken Team",
      role: "Crypto Exchange Team",
      avatar: "/customers/kraken.webp",
      text: "EyesOn helped us with video editing and made the process simple from start to finish. The edits were clean, the pacing felt professional, and the final videos matched the quality we wanted for our brand.",
      stars: 5,
    },
    {
      id: 5,
      name: "Remora",
      role: "RWA Crypto Brand",
      avatar: "/customers/remora.webp",
      text: "We worked with EyesOn on animations for our Instagram and social media content. They helped make the visuals feel more dynamic and polished, while still keeping the content simple enough for people to understand quickly.",
      stars: 5,
    },
    {
      id: 6,
      name: "Hey Anon",
      role: "Web3 / AI Brand",
      avatar: "/customers/hey-anon.webp",
      text: "We had ideas that were not always easy to explain visually. EyesOn helped turn them into content that felt clearer, smoother, and more engaging, especially with the editing flow and motion details.",
      stars: 4,
    },
    {
      id: 7,
      name: "Nexo",
      role: "Digital Assets Platform",
      avatar: "/customers/nexo.png",
      text: "The team brought a strong level of polish to our video content. The editing felt clean, the motion details were subtle but effective, and the final result looked aligned with the standard we needed.",
      stars: 5,
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {stars.length > 0 && (
        <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#00E6D7] animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================== */}
        {/* Section Header */}
        {/* ========================================== */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white tracking-tight">
            What our{" "}
            <span className="text-[#00E6D7] relative inline-block">
              clients
              <div className="absolute -bottom-2 left-0 h-1.5 w-full bg-gradient-to-r from-[#00E6D7] to-transparent rounded-full shadow-[0_0_10px_#00E6D7]" />
            </span>{" "}
            say after
            <br />
            working with EyesOn
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/70 max-w-3xl mx-auto font-light">
            We collaborate with ambitious teams around the world, from early stage startups and
            online brands to established global companies. Every project is built around clear
            communication, strong creative execution, and making sure our clients feel confident in
            both the process and the final result.
          </p>
        </div>

        {/* ========================================== */}
        {/* Slider Container */}
        {/* ========================================== */}
        <div className="relative group/carousel">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#00E6D7]/10 to-transparent blur-3xl opacity-50 -z-20 pointer-events-none" aria-hidden="true" />

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            autoplay={autoplayAllowed ? {
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            } : false}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
            }}
            className="pb-6"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id} className="h-auto flex">
                <div className="w-full h-full transform-gpu transition-transform duration-300 ">
                  <TestimonialCard item={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            aria-label="Previous testimonials"
            className="swiper-button-prev-custom absolute top-1/2 -left-3 lg:-left-6 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#07212b] border border-white/15 flex items-center justify-center text-white hover:text-[#00E6D7] hover:scale-110 active:scale-95 hover:border-[#00E6D7] hover:shadow-[0_0_20px_rgba(0,230,215,0.4)] transition-[transform,color,border-color,box-shadow] duration-200 shadow-2xl cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            aria-label="Next testimonials"
            className="swiper-button-next-custom absolute top-1/2 -right-3 lg:-right-6 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#07212b] border border-white/15 flex items-center justify-center text-white hover:text-[#00E6D7] hover:scale-110 active:scale-95 hover:border-[#00E6D7] hover:shadow-[0_0_20px_rgba(0,230,215,0.4)] transition-[transform,color,border-color,box-shadow] duration-200 shadow-2xl cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
