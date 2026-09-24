import React, {
  memo,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import OrbitCircles from "./Orbit-Circles.svg";
import { useMediaQuery } from "react-responsive";
import SecondaryButton from "@/components/Shared/SecondaryButton";
import PrimaryButton from "@/components/Shared/PrimaryButton";
type AssetWithSrc = {
  src: string;
};

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
/* ================= TYPES ================= */

export interface IconConfig {
  name: string;
  start: number;
  end: number;
  iconSrc?: string | AssetWithSrc;
  iconAlt?: string;
  iconSize?: number;
  iconClassName?: string;
}

export interface OrbitConfig {
  pathD: string;
  stroke?: string;
  color?: string;
  icons: IconConfig[];
}

export interface ButtonConfig {
  label: string;
  link?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary";
  className?: string;
}

export interface ContentConfig {
  headingHighlight?: string;
  headingMain: string;
  headingSecondLine?: string;
  subheading?: string;
  buttons?: ButtonConfig[];
}

export const content: ContentConfig = {
  headingHighlight: "300+",
  headingMain: "Animations",
  headingSecondLine: "crafted every year",
  subheading:
    "We started as a small collective obsessed with turning raw concepts into striking visuals. Over time, that obsession became a full-scale design and animation practice trusted by brands that care about clarity, style, and storytelling.",
  buttons: [
    {
      label: "See our work",
      link: "/work",
      variant: "primary",
    },
    {
      label: "Play showreel",
      onClick: () => console.log("Play showreels clicked"),
      variant: "secondary",
    },
  ],
};

interface OrbitSystemProps {
  orbits: OrbitConfig[];
  content: ContentConfig;
  width?: string | number;
  height?: string | number;
  animations: boolean;
}

export const OrbitSystem = memo(function OrbitSystem({
  orbits,
  content,
  animations,
}: OrbitSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const orbitPathsRef = useRef<SVGPathElement[]>([]);
  const iconRefs = useRef<Record<string, SVGGElement | null>>({});
  const animationInitializedRef = useRef(false);
  const iconTweensRef = useRef<gsap.core.Tween[]>([]);

  const isMobileView = useMediaQuery({ maxWidth: 700 });
  const [isInView, setIsInView] = useState(false);
  // Low-power gate: reduced motion, GPU-off probe, or save-data → static
  // render (no ScrollTrigger/MotionPath scrub, no icon duplication).
  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => {
      setLowPower(
        mq.matches ||
          document.documentElement.classList.contains("gpu-off") ||
          document.documentElement.classList.contains("reduce-motion") ||
          (window as any).__GPU_OFF__ === true ||
          (window as any).__REDUCED_MOTION__ === true,
      );
    };
    check();
    mq.addEventListener?.("change", check);
    return () => mq.removeEventListener?.("change", check);
  }, []);
  const isStatic = isMobileView || lowPower || !animations;
  // Hydration-safe unique id (useId is deterministic server↔client)
  const rawId = useId();
  const instanceId = rawId.replace(/:/g, "") || "orbit";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "80px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ===== GSAP (lazy) ===== */
  // displayOrbits must be declared before the effect that uses it.
  // Static mode (mobile / reduced / gpu-off): no icon duplication — half the DOM.
  const displayOrbits = isStatic
    ? orbits
    : orbits.map((orbit) => {
        const n = orbit.icons.length;
        if (n === 0) return orbit;
        const expanded: IconConfig[] = [];
        const copies = 2;
        for (let c = 0; c < copies; c++) {
          const offset = c / copies; // 0, 0.5
          for (const ic of orbit.icons) {
            const suffix = c === 0 ? "" : `-c${c}`;
            expanded.push({
              ...ic,
              name: `${ic.name}${suffix}`,
              start: ic.start - offset,
              end: ic.end - offset,
            });
          }
        }
        return { ...orbit, icons: expanded };
      });

  useLayoutEffect(() => {
    if (!sceneRef.current || animationInitializedRef.current || !isInView) {
      return;
    }

    animationInitializedRef.current = true;
    iconTweensRef.current.forEach((tween) => tween.kill());
    iconTweensRef.current = [];

    // Static fallback: place each icon once at its path midpoint — no
    // ScrollTrigger, no scrub, no per-scroll work.
    if (isStatic) {
      const ctx = gsap.context(() => {
        displayOrbits.forEach((orbit, orbitIndex) => {
          const pathEl = orbitPathsRef.current[orbitIndex];
          if (!pathEl) return;
          orbit.icons.forEach((icon) => {
            const key = `${orbitIndex}-${icon.name}`;
            const iconEl = iconRefs.current[key];
            if (!iconEl) return;
            const mid = (icon.start + icon.end) / 2;
            gsap.set(iconEl, {
              motionPath: {
                path: pathEl,
                align: pathEl,
                alignOrigin: [0.5, 0.5],
                start: mid,
                end: mid,
              },
            });
          });
        });
      }, sceneRef);
      return () => {
        animationInitializedRef.current = false;
        ctx.revert();
      };
    }

    const ctx = gsap.context(() => {
      displayOrbits.forEach((orbit, orbitIndex) => {
        const pathEl = orbitPathsRef.current[orbitIndex];
        if (!pathEl) return;

        orbit.icons.forEach((icon) => {
          const key = `${orbitIndex}-${icon.name}`;
          const iconEl = iconRefs.current[key];
          if (!iconEl) return;

          // Place at start before ScrollTrigger takes over — fixes flash at (0,0) and misalignment on first paint
          gsap.set(iconEl, {
            motionPath: {
              path: pathEl,
              align: pathEl,
              alignOrigin: [0.5, 0.5],
              start: icon.start,
              end: icon.start,
            },
          });

          iconTweensRef.current.push(
            gsap.to(iconEl, {
              ease: "none",
              motionPath: {
                path: pathEl,
                align: pathEl,
                alignOrigin: [0.5, 0.5],
                start: icon.start,
                end: icon.end,
              },
              scrollTrigger: {
                trigger: sceneRef.current!,
                start: "top 85%",
                end: "bottom 15%",
                scrub: 0.5,
                fastScrollEnd: true,
              },
            }),
          );
        });
      });

      ScrollTrigger.refresh();
    }, sceneRef);

      return () => {
      animationInitializedRef.current = false;
      iconTweensRef.current.forEach((tween) => tween.kill());
      iconTweensRef.current = [];
      ctx.revert();
    };
  }, [animations, isStatic, isInView, orbits]);

  const orbitIconSize = OrbitCircles.width ?? 64;
  const orbitIconRadius = orbitIconSize / 2;
  const defaultInnerIconSize = orbitIconSize * 0.8;

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[65vh] md:min-h-screen overflow-visible relative flex items-center justify-center py-12 md:py-0"
    >
      <div className="pointer-events-none absolute inset-0" />
      <div
        ref={sceneRef}
        className={`absolute inset-0 pointer-events-none overflow-visible${isStatic ? "" : " will-change-transform"}`}
      >
        <div className="relative w-full h-full">
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid meet"
            className={`absolute inset-0 w-full h-full mx-auto overflow-visible${isStatic ? "" : " will-change-transform"}`}
            style={{
              maskImage:
                "linear-gradient(to bottom, black 65%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 65%, transparent 100%)",
              contain: "layout style paint",
              overflow: "visible",
            }}
          >
            <defs>
              <linearGradient id={`orbit-fade-${instanceId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1AD9E0" stopOpacity="0.95" />
                <stop offset="58%" stopColor="#13C7D0" stopOpacity="0.88" />
                <stop offset="82%" stopColor="#0A8FA1" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#086374" stopOpacity="0.05" />
              </linearGradient>
              {/* Centralised clipPaths — avoids duplicate <defs> inside <g> and id collisions */}
              {displayOrbits.flatMap((orbit, oi) =>
                orbit.icons
                  .filter((ic) => {
                    const v = typeof ic.iconSrc === "string" ? ic.iconSrc : (ic.iconSrc as AssetWithSrc | undefined)?.src;
                    return typeof v === "string" && v.includes("/customers/");
                  })
                  .map((ic) => {
                    const w = ic.iconSize ?? orbitIconSize - 8;
                    return (
                      <clipPath key={`clip-${oi}-${ic.name}`} id={`avatar-clip-${instanceId}-${oi}-${ic.name}`}>
                        <circle r={w / 2} cx={0} cy={0} />
                      </clipPath>
                    );
                  }),
              )}
            </defs>

            {displayOrbits.map((orbit, orbitIndex) => {
              return (
                <g
                  key={orbitIndex}
                  className={`orbit-${orbitIndex + 1}`}
                >
                  <path
                    ref={(el) => {
                      if (el) orbitPathsRef.current[orbitIndex] = el;
                    }}
                    d={orbit.pathD}
                    fill="none"
                    stroke={`url(#orbit-fade-${instanceId})`}
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />

                  {orbit.icons.map((icon) => {
                    const iconSrcValue = icon.iconSrc
                      ? typeof icon.iconSrc === "string"
                        ? icon.iconSrc
                        : icon.iconSrc.src
                      : undefined;
                    const isCustomerAvatar = typeof iconSrcValue === "string" && iconSrcValue.includes("/customers/");
                    const iconWidth = icon.iconSize ?? (isCustomerAvatar ? orbitIconSize - 8 : defaultInnerIconSize);
                    const iconRadius = iconWidth / 2;

                    const gKey = `${orbitIndex}-${icon.name}`;
                    const clipId = `avatar-clip-${instanceId}-${orbitIndex}-${icon.name}`;
                    return (
                      <g
                        key={gKey}
                        ref={(el) => {
                          if (el) {
                            iconRefs.current[gKey] = el;
                          } else {
                            delete iconRefs.current[gKey];
                          }
                        }}
                        className={`icon ${icon.name}`}
                        style={{ transformOrigin: "50% 50%" }}
                      >
                        {isCustomerAvatar && iconSrcValue ? (
                          <>
                            <circle r={orbitIconRadius} cx={0} cy={0} fill="#0a1a24" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
                            <image
                              href={iconSrcValue}
                              width={iconWidth}
                              height={iconWidth}
                              x={-iconRadius}
                              y={-iconRadius}
                              preserveAspectRatio="xMidYMid slice"
                              clipPath={`url(#${clipId})`}
                              aria-label={icon.iconAlt ?? icon.name}
                              className="pointer-events-none"
                            />
                          </>
                        ) : (
                          <>
                            <image
                              href={OrbitCircles.src}
                              width={orbitIconSize}
                              height={orbitIconSize}
                              x={-orbitIconRadius}
                              y={-orbitIconRadius}
                              preserveAspectRatio="xMidYMid meet"
                              className="pointer-events-none"
                            />
                            {iconSrcValue && (
                              <image
                                href={iconSrcValue}
                                width={iconWidth}
                                height={iconWidth}
                                x={-iconRadius}
                                y={-iconRadius}
                                preserveAspectRatio="xMidYMid meet"
                                aria-label={icon.iconAlt ?? icon.name}
                                className={`pointer-events-none ${icon.iconClassName ?? ""}`.trim()}
                              />
                            )}
                          </>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div
        className="relative z-10 flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-6 min-h-[50vh] sm:min-h-[70vh] pt-32 sm:pt-48 lg:pt-60 w-full text-center max-w-4xl mx-auto px-4 animate-fade-in"
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white relative z-10 leading-tight">
          {content.headingHighlight ? (
            <span className="text-[#38B6B3]">{content.headingHighlight}</span>
          ) : null}
          {content.headingHighlight ? " " : null}
          {content.headingMain}
          {content.headingSecondLine ? (
            <>
              <br />
              {content.headingSecondLine}
            </>
          ) : null}
        </h3>

        {content.subheading && (
          <h5 className="text-xs sm:text-sm md:text-base lg:text-lg w-full max-w-xs sm:max-w-md md:max-w-xl text-[#B5C6CC] relative z-10 leading-relaxed font-light mt-2">
            {content.subheading}
          </h5>
        )}

{content.buttons && (
  <div className="relative z-10 mt-4 flex w-full flex-col gap-2 sm:mt-6 sm:w-auto sm:flex-row sm:gap-4 md:mt-8 md:gap-6">
    {content.buttons.map((btn, idx) => (
      <div key={idx} className="w-full sm:w-auto">
        {idx === 0 ? (
          <PrimaryButton
            text={btn.label}
            href={btn.link}
            width="100%"
            height="50px"
          />
        ) : (
          <SecondaryButton
            text={btn.label}
            href={btn.link}
            width="100%"
            height="50px"
          />
        )}
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
});
