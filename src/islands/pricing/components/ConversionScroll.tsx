import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SVG_LAYERS = [
  { left: "/pricing/svg/process/5.svg", right: "/pricing/svg/process/1.svg" },
  { left: "/pricing/svg/process/6.svg", right: "/pricing/svg/process/2.svg" },
  { left: "/pricing/svg/process/7.svg", right: "/pricing/svg/process/3.svg" },
  { left: "/pricing/svg/process/8.svg", right: "/pricing/svg/process/4.svg" },
];

const CARD_AREA_TOP = 16.42;
const CARD_AREA_HEIGHT = 71.64;

export const ConversionScroll = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  );

  // Breakpoint change listener to update layout and refresh ScrollTrigger
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      ScrollTrigger.refresh();
    };
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // GSAP ScrollTrigger timeline animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // ponytail: animations remain active across all modes (reduced-motion, gpu-off, mobile)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.5,
          fastScrollEnd: true,
          onToggle: (self) => {
            el.classList.toggle("conv-active", self.isActive);
          },
        },
      });

      // Parallax position float
      if (parallaxRef.current) {
        tl.fromTo(
          parallaxRef.current,
          { y: -8 },
          { y: 8, ease: "none", duration: 1 },
          0
        );
      }

      // Progress line fill scale
      if (fillRef.current) {
        tl.fromTo(
          fillRef.current,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 1, ease: "none", duration: 1 },
          0
        );
      }

      // Progress dot position
      if (dotRef.current) {
        tl.fromTo(
          dotRef.current,
          { top: "0%" },
          { top: "100%", ease: "none", duration: 1 },
          0
        );
      }

      // Cumulative sticky card activation:
      // each layer fades in once (slightly before the dot reaches it)
      // and stays visible until the timeline scrubs all the way back.
      const fadeDuration = 0.15;
      // Full-opacity points sit just ahead of the dot arrival so the
      // line feels like it triggers the card early.
      const activateAt = [0, 0.16, 0.44, 0.72];

      layersRef.current.forEach((layerEl, i) => {
        if (!layerEl) return;
        if (i === 0) {
          // First card starts active and stays active.
          tl.set(layerEl, { opacity: 1 }, 0);
        } else {
          tl.fromTo(
            layerEl,
            { opacity: 0.05 },
            {
              opacity: 1,
              ease: "power1.inOut",
              duration: fadeDuration,
            },
            activateAt[i] ?? 0.5
          );
        }
      });

      ScrollTrigger.refresh();
    }, el);

    return () => {
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="conv-root relative z-10 mx-auto w-full overflow-hidden px-4 pb-24 pt-5"
    >
      <h2 className="text-center text-white text-2xl md:text-3xl font-bold ">
        Why <span className="text-[#1FC5C8]">Product Videos</span> increase
        conversion
      </h2>

      <div className="relative mx-auto w-full max-w-105 md:max-w-[2600px]">
        <div
          ref={parallaxRef}
          className="relative w-full overflow-hidden md:overflow-visible will-change-transform"
          style={{
            aspectRatio: isMobile ? "380 / 860" : "1289.28 / 860",
          }}
        >
          {/* Scroll progress follower line: left on mobile, center on desktop */}
          <div
            className="pointer-events-none absolute left-[7%] z-20 md:left-1/2 md:-translate-x-1/2"
            style={{
              top: `${CARD_AREA_TOP}%`,
              height: `${CARD_AREA_HEIGHT}%`,
            }}
          >
            <div className="relative h-full w-0.75 md:w-1 rounded-full bg-[#0D3444]">
              <div
                ref={fillRef}
                className="conv-fill absolute left-0 top-0 h-full w-full rounded-full bg-linear-to-b from-[#0E6578] to-[#08DCF0]"
                style={{ transform: "scaleY(0)", transformOrigin: "top" }}
              />
              <div
                ref={dotRef}
                className="absolute left-1/2 h-3 w-3 md:h-4 md:w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#65E6E3] shadow-[0_0_20px_rgba(8,220,240,0.8)]"
                style={{
                  top: "0%",
                  background: "radial-gradient(circle, #08DCF0, #0E6578)",
                }}
              />
            </div>
          </div>

          {/* SVG Layers */}
          {SVG_LAYERS.map((svg, i) => (
            <div
              key={i}
              ref={(el) => {
                layersRef.current[i] = el;
              }}
              className="conv-layer pointer-events-none absolute inset-0 select-none"
              style={{ opacity: i === 0 ? 1 : 0.05 }}
            >
              {/* Desktop-only left illustration image */}
              {!isMobile && (
                <img
                  src={svg.left}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover ${i == 0 ? "top-8" : ""}`}
                />
              )}

              {/* Right text image: cropped to card column on mobile, full width on desktop */}
              <img
                src={svg.right}
                alt=""
                aria-hidden="true"
                draggable={false}
                loading="lazy"
                decoding="async"
                className="absolute top-0 h-full max-w-none"
                style={
                  isMobile
                    ? {
                        width: "339.28%",
                        left: "-162.63%",
                        objectFit: "fill",
                      }
                    : {
                        width: "100%",
                        left: "0",
                        objectFit: "cover",
                      }
                }
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .conv-root.conv-active .conv-layer { will-change: opacity; }
        .conv-root.conv-active .conv-fill { will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .conv-root.conv-active .conv-layer,
          .conv-root.conv-active .conv-fill { will-change: auto; }
        }
        html.gpu-off .conv-root.conv-active .conv-layer,
        html.gpu-off .conv-root.conv-active .conv-fill {
          will-change: auto;
        }
      `}</style>
    </section>
  );
};
