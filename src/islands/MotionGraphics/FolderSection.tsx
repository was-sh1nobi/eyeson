import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface CardData {
  title: string;
  subTitle: string;
  image: string;
}

interface InteractiveCardProps extends CardData {
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  image,
  index,
  cardRef,
}) => {
  return (
    <div
      ref={cardRef}
      className="absolute w-48 h-64 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 10 - index,
        transform: `translateY(${index * 8}px) translateX(${index * 4}px) rotate(${index * -2}deg) scale(${1 - index * 0.04})`,
      }}
    />
  );
};

const Folder: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flapRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (): void => {
    const tl = gsap.timeline();
    if (flapRef.current) {
      tl.to(
        flapRef.current,
        {
          y: 20,
          rotateX: -15,
          duration: 0.6,
          ease: "power3.out",
        },
        0,
      );
    }

    cardRefs.current.forEach((card, i) => {
      if (card) {
        gsap.to(card, {
          y: -140 - i * 35,
          x: (i - 1) * 45,
          rotation: (i - 1) * 12,
          scale: 1,
          duration: 0.7,
          delay: i * 0.04,
          ease: "expo.out",
        });
      }
    });
  };

  const handleMouseLeave = (): void => {
    if (flapRef.current) {
      gsap.to(flapRef.current, {
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "power3.inOut",
      });
    }

    cardRefs.current.forEach((card, i) => {
      if (card) {
        gsap.to(card, {
          y: i * 8,
          x: i * 4,
          rotation: i * -2,
          scale: 1 - i * 0.04,
          duration: 0.6,
          ease: "power3.inOut",
        });
      }
    });
  };

  const cardData: CardData[] = [
    {
      title: "Personal",
      subTitle: "Branding",
      image: "/motion-graphics/Folder/1.webp",
    },
    {
      title: "Digital",
      subTitle: "Presence",
      image: "/motion-graphics/Folder/2.webp",
    },
    {
      title: "Brand",
      subTitle: "Story",
      image: "/motion-graphics/Folder/3.webp",
    },
    {
      title: "Motion",
      subTitle: "Content",
      image: "/motion-graphics/Folder/4.webp",
    },
  ];

  return (
    <div
      ref={container}
      className="relative w-[450px] max-w-full h-[400px] flex items-center justify-center cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      {/* Folder Background */}
      <div
        ref={backgroundRef}
        className="absolute w-full h-full"
        style={{
          backgroundImage: "url(/motion-graphics/Folder/FB.svg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* Cards Stack */}
      <div className="relative w-48 h-64 mb-12 z-10">
        {cardData.map((data, i) => (
          <InteractiveCard
            key={i}
            index={i}
            {...data}
            cardRef={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* Folder Front Flap (Glassmorphism) */}
      <div
        ref={flapRef}
        className="absolute bottom-4 w-[500px] max-w-full h-[320px] z-20"
        style={{
          backgroundImage: "url(/motion-graphics/Folder/FF.svg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

/**
 * Main  Component
 */
const MotionSection: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 md:px-8 font-sans overflow-hidden py-20 lg:py-0">
      <div
        className="w-full flex flex-col lg:flex-row justify-center items-center relative z-10 gap-12 lg:gap-16 animate-fade-in"
      >
        {/* Left Section: Content */}
        <div
          className="space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start animate-slide-up"
        >
          <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-white leading-[1.2] lg:leading-[1.1] tracking-tight">
            Where ideas turn into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-400">
              Motion Stories People Remember
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            Great motion content is not just about animation. It is about turning your message into a
            story people can follow, feel, and remember.
            At EyesOn Studio, we create motion graphics for reels, social media content, brand stories,
            product messages, and campaigns that need more than static visuals. Every piece is
            shaped with pacing, visual rhythm, storytelling, and platform behavior in mind, so your
            content feels engaging from the first second.
          </p>

          <p className="text-gray-400 text-sm leading-relaxed max-w-xl opacity-80 mx-auto lg:mx-0">
            Instead of posting random visuals, you build a stronger content language, one that helps
            your brand explain ideas, create emotion, stay recognizable, and show up consistently
            across modern platforms.
            The result is clearer storytelling, stronger brand presence, and motion content your
            audience actually wants to watch.
          </p>

          <button
            className="group relative px-8 py-4 bg-teal-500/10 border border-teal-500/50 rounded-full overflow-hidden transition-[transform,border-color,box-shadow] duration-300 hover:border-teal-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-95 mx-auto lg:mx-0 cursor-pointer"
          >
            <span className="relative z-10 text-teal-400 font-semibold group-hover:text-white transition-colors">
              Start a Motion Project
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Right Section: Interactive Folder */}
        <div
          className="hidden lg:block animate-fade-in"
        >
          <Folder />
        </div>
      </div>
    </div>
  );
};

export default MotionSection;
