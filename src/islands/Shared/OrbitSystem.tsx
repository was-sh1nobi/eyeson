import React, {
  memo,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import OrbitCircles from "./Orbit-Circles.svg";
import SecondaryButton from "@/components/Shared/SecondaryButton";
import PrimaryButton from "@/components/Shared/PrimaryButton";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
// 📱 don't refresh ScrollTrigger when the mobile URL bar shows/hides
ScrollTrigger.config({ ignoreMobileResize: true });

/* ================= TYPES ================= */

type AssetWithSrc = {
  src: string;
};

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

/* ================= HELPERS ================= */

/** how far each icon travels along its orbit (0–1). lower = tighter / always visible */
const TRAVEL = 0.1;

/** Evenly spaces icons on each orbit, offsets alternate orbits, keeps travel inside [0,1] */
function normalizeOrbits(orbits: OrbitConfig[]): OrbitConfig[] {
  return orbits.map((orbit, oi) => {
    const n = orbit.icons.length || 1;
    const phase = oi % 2 ? 0.5 / n : 0;
    return {
      ...orbit,
      icons: orbit.icons.map((ic, i) => {
        const start = (i / n + phase) % 1;
        const dir = start + TRAVEL <= 1 ? 1 : -1;
        return { ...ic, start, end: start + dir * TRAVEL };
      }),
    };
  });
}

const getSrc = (s?: string | AssetWithSrc) =>
    typeof s === "string" ? s : s?.src;

/* ================= COMPONENT ================= */

export const OrbitSystem = memo(function OrbitSystem({
                                                       orbits,
                                                       content,
                                                       animations,
                                                     }: OrbitSystemProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const iconRefs = useRef<Record<string, SVGGElement | null>>({});
  const [ready, setReady] = useState(false);

  // hydration-safe unique id
  const instanceId = useId().replace(/:/g, "") || "orbit";

  // stable identity even if the parent passes a fresh array every render
  const sig = JSON.stringify(
      orbits.map((o) => [o.pathD, o.icons.map((i) => i.name)]),
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const displayOrbits = useMemo(() => normalizeOrbits(orbits), [sig]);

  /* 1️⃣ Place icons on their orbit BEFORE first paint (even when animations=false) */
  useLayoutEffect(() => {
    displayOrbits.forEach((orbit, oi) => {
      const path = pathRefs.current[oi];
      if (!path) return;
      orbit.icons.forEach((icon, ii) => {
        const el = iconRefs.current[`${oi}-${ii}`];
        if (!el) return;
        gsap.set(el, {
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            start: icon.start,
            end: icon.start,
          },
        });
      });
    });
    setReady(true); // reveal only after they're placed
  }, [displayOrbits]);

  /* 2️⃣ ONE ScrollTrigger / one timeline for all icons */
  useLayoutEffect(() => {
    if (!animations || !sceneRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: sceneRef.current,
        start: "top 90%",
        end: "bottom 10%",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    displayOrbits.forEach((orbit, oi) => {
      const path = pathRefs.current[oi];
      if (!path) return;
      orbit.icons.forEach((icon, ii) => {
        const el = iconRefs.current[`${oi}-${ii}`];
        if (!el) return;
        tl.to(
            el,
            {
              motionPath: {
                path,
                align: path,
                alignOrigin: [0.5, 0.5],
                start: icon.start,
                end: icon.end,
              },
              duration: 1,
            },
            0,
        );
      });
    });

    // jump straight to current scroll progress → no "flying in" on reload mid-page
    if (tl.scrollTrigger) tl.progress(tl.scrollTrigger.progress);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [animations, displayOrbits]);

  const orbitIconSize = (OrbitCircles as any).width ?? 64;
  const orbitIconRadius = orbitIconSize / 2;
  const defaultInnerIconSize = orbitIconSize * 0.8;

  return (
      <div className="w-full min-h-[65svh] md:min-h-screen overflow-visible relative flex items-center justify-center py-12 md:py-10">
        <div
            ref={sceneRef}
            className="absolute inset-0 pointer-events-none overflow-visible"
        >
          <svg
              viewBox="-60 -60 1120 1120"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient
                  id={`orbit-fade-${instanceId}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
              >
                <stop offset="0%" stopColor="#1AD9E0" stopOpacity="0.95" />
                <stop offset="58%" stopColor="#13C7D0" stopOpacity="0.88" />
                <stop offset="82%" stopColor="#0A8FA1" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#086374" stopOpacity="0.05" />
              </linearGradient>

              {/* centralised clipPaths — no duplicate defs / id collisions */}
              {displayOrbits.flatMap((orbit, oi) =>
                  orbit.icons.map((ic, ii) => {
                    if (!getSrc(ic.iconSrc)?.includes("/customers/")) return null;
                    const w = ic.iconSize ?? orbitIconSize - 8;
                    return (
                        <clipPath
                            key={`${oi}-${ii}`}
                            id={`clip-${instanceId}-${oi}-${ii}`}
                        >
                          <circle r={w / 2} cx={0} cy={0} />
                        </clipPath>
                    );
                  }),
              )}
            </defs>

            {displayOrbits.map((orbit, oi) => (
                <g key={oi} className={`orbit-${oi + 1}`}>
                  <path
                      ref={(el) => {
                        pathRefs.current[oi] = el;
                      }}
                      d={orbit.pathD}
                      fill="none"
                      stroke={`url(#orbit-fade-${instanceId})`}
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                  />

                  {orbit.icons.map((icon, ii) => {
                    const src = getSrc(icon.iconSrc);
                    const isAvatar = !!src?.includes("/customers/");
                    const w =
                        icon.iconSize ??
                        (isAvatar ? orbitIconSize - 8 : defaultInnerIconSize);
                    const r = w / 2;
                    const k = `${oi}-${ii}`;

                    return (
                        <g
                            key={k}
                            ref={(el) => {
                              iconRefs.current[k] = el;
                            }}
                            className={`icon ${icon.name}`}
                            style={{
                              opacity: ready ? 1 : 0,
                              transition: "opacity .35s ease",
                            }}
                        >
                          {isAvatar && src ? (
                              <>
                                <circle
                                    r={orbitIconRadius}
                                    cx={0}
                                    cy={0}
                                    fill="#0a1a24"
                                    stroke="rgba(255,255,255,0.18)"
                                    strokeWidth={1}
                                />
                                <image
                                    href={src}
                                    width={w}
                                    height={w}
                                    x={-r}
                                    y={-r}
                                    preserveAspectRatio="xMidYMid slice"
                                    clipPath={`url(#clip-${instanceId}-${k})`}
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
                                {src && (
                                    <image
                                        href={src}
                                        width={w}
                                        height={w}
                                        x={-r}
                                        y={-r}
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
            ))}
          </svg>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-6 min-h-[50svh] sm:min-h-[70svh] pt-32 sm:pt-48 lg:pt-60 w-full text-center max-w-4xl mx-auto px-4 animate-fade-in">
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