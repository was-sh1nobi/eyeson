import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SVG_LAYERS = [
  { left: "/pricing/svg/process/5.svg", right: "/pricing/svg/process/1.svg" },
  { left: "/pricing/svg/process/6.svg", right: "/pricing/svg/process/2.svg" },
  { left: "/pricing/svg/process/7.svg", right: "/pricing/svg/process/3.svg" },
  { left: "/pricing/svg/process/8.svg", right: "/pricing/svg/process/4.svg" },
];

const SEG = 1 / SVG_LAYERS.length;

export const ConversionScroll = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  );

  // Breakpoint listener — event-driven, no per-resize setState storm.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);


  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;


    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;


    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 15%",
        end: "bottom 50%",
        scrub: 0.5,
        fastScrollEnd: true,
        onUpdate: (self) => {
          el.style.setProperty("--p", self.progress.toFixed(3));
        },
        // GPU layers only while the scrub range is active — not forever.
        onToggle: (self) => {
          el.classList.toggle("conv-active", self.isActive);
        },
      });
      ScrollTrigger.refresh();
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  const CARD_AREA_TOP = 16.42;
  const CARD_AREA_HEIGHT = 71.64;

  return (
    <section
      ref={sectionRef}
      className="conv-root relative z-10 mx-auto w-full overflow-hidden px-4 pb-24 pt-5"
      style={{ "--p": 0.5 } as CSSProperties}
    >
      <h2 className="text-center text-white text-2xl md:text-3xl font-bold mb-12">
        Why <span className="text-[#1FC5C8]">Product Videos</span> increase
        conversion
      </h2>

      <div className="relative mx-auto w-full max-w-[2600px]">
        <div
          className="relative w-full overflow-visible"
          style={{
            aspectRatio: isMobile ? "1289.28 / 3696.72" : "1289.28 / 924.18",
            // Parallax driven by --p (composited transform, no re-render).
            transform: "translateY(calc((var(--p, 0.5) - 0.5) * 16px))",
          }}
        >
          <div
            className="pointer-events-none absolute left-[5%] z-20 md:left-1/2 md:-translate-x-1/2"
            style={{
              top: `${CARD_AREA_TOP}%`,
              height: `${CARD_AREA_HEIGHT}%`,
            }}
          >
            <div className="relative h-full w-[3px] md:w-1 rounded-full bg-[#0D3444]">
              {/* scaleY instead of height% — composite-only, no layout per frame */}
              <div
                className="conv-fill absolute left-0 top-0 h-full w-full rounded-full bg-linear-to-b from-[#0E6578] to-[#08DCF0]"
                style={{
                  transform: "scaleY(var(--p, 0.5))",
                  transformOrigin: "top",
                }}
              />
              {/* top% touches only this tiny subtree's layout, not the images */}
              <div
                className="absolute left-1/2 h-3 w-3 md:h-4 md:w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#65E6E3] shadow-[0_0_20px_rgba(8,220,240,0.8)]"
                style={{
                  top: "calc(var(--p, 0.5) * 100%)",
                  background: "radial-gradient(circle, #08DCF0, #0E6578)",
                }}
              />
            </div>
          </div>
          {SVG_LAYERS.map((svg, i) => {
            // Same math as before, evaluated by the browser per frame:
            // opacity = 0.05 + clamp((p - i*SEG + 0.2) / SEG, 0, 1) * 0.95
            const c = Math.round((0.2 - i * SEG) * 1000) / 1000;
            return (
              <div
                key={i}
                className="conv-layer pointer-events-none absolute inset-0 select-none"
                style={{
                  opacity: `clamp(0.05, calc((var(--p, 0.5) + ${c}) / ${SEG} * 0.95 + 0.05), 1)`,
                }}
              >
                {/* Desktop-only art is not even fetched on mobile */}
                {!isMobile && (
                  <img
                    src={svg.left}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <img
                  src={svg.right}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: isMobile ? "69% 16.42%" : undefined }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* GPU layers only while the section is on/near screen (JS toggles .conv-active).
           Opacity/scaleY then animate on the compositor — no repaint of the giant art. */
        .conv-root.conv-active .conv-layer { will-change: opacity; }
        .conv-root.conv-active .conv-fill { will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .conv-root.conv-active .conv-layer,
          .conv-root.conv-active .conv-fill { will-change: auto; }
        }
      `}</style>
    </section>
  );
};
