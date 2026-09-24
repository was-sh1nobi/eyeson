"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessScrollSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const curveRef = useRef<SVGCircleElement | null>(null);
    const dotsRef = useRef<(SVGGElement | null)[]>([]);
    const cardsRef = useRef<(SVGGElement | null)[]>([]);
    const centerRef = useRef<SVGGElement | null>(null);

    useLayoutEffect(() => {
        if (!sectionRef.current || !svgRef.current) return;
        try {
            const coarseMobile = window.matchMedia("(max-width: 1023px)").matches;
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || (window as any).__REDUCED_MOTION__ === true;
            if (coarseMobile || reduced) return;
        } catch { /* fall through to animated path */ }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=1800",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            tl.fromTo(
                curveRef.current,
                {
                    rotation: 18,
                    svgOrigin: "562 452",
                },
                {
                    rotation: -18,
                    ease: "none",
                },
                0
            );

            dotsRef.current.forEach((dot, i) => {
                if (!dot) return;

                const xTo = [0, -10, -24, -34][i] ?? -20;
                const yTo = [0, -6, 10, 18][i] ?? 10;
                const opTo = [1, 0.78, 0.38, 0][i] ?? 0.4;
                const scaleTo = [1, 0.96, 0.88, 0.76][i] ?? 0.9;

                tl.to(
                    dot,
                    {
                        x: xTo,
                        y: yTo,
                        opacity: opTo,
                        scale: scaleTo,
                        ease: "none",
                    },
                    0
                );
            });

            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                tl.to(
                    card,
                    {
                        y: [0, -5, -12, -18][i] ?? -10,
                        opacity: [1, 0.95, 0.72, 0.35][i] ?? 0.7,
                        ease: "none",
                    },
                    0
                );
            });

            if (centerRef.current) {
                tl.to(
                    centerRef.current,
                    {
                        y: -18,
                        ease: "none",
                    },
                    0
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative h-screen w-full overflow-hidden bg-[#03141d] text-white"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,199,214,0.16),transparent_28%),radial-gradient(circle_at_50%_35%,rgba(0,132,255,0.09),transparent_40%),linear-gradient(to_bottom,#03141d,#021018)]" />

            <div className="absolute inset-0 opacity-50">
                <div className="absolute left-[8%] top-[12%] h-1 w-1 rounded-full bg-cyan-200/80 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <div className="absolute left-[16%] top-[20%] h-1 w-1 rounded-full bg-cyan-200/50" />
                <div className="absolute left-[71%] top-[11%] h-1 w-1 rounded-full bg-cyan-200/50" />
                <div className="absolute left-[89%] top-[22%] h-1 w-1 rounded-full bg-cyan-200/40" />
                <div className="absolute left-[24%] top-[78%] h-1 w-1 rounded-full bg-cyan-200/30" />
                <div className="absolute left-[84%] top-[74%] h-1 w-1 rounded-full bg-cyan-200/25" />
            </div>

            <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center px-6">
                <div className="relative h-[560px] w-full max-w-[1124px]">
                    <svg
                        ref={svgRef}
                        viewBox="0 0 1124 905"
                        className="absolute left-1/2 top-1/2 h-[905px] w-[1124px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="curveGradient" x1="182" y1="1118" x2="2322" y2="2326.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#00A9BD" />
                                <stop offset="1" stopColor="#0B1F2A" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="cardFillA" x1="183.875" y1="171" x2="2540.039" y2="2209.254" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#0B1F2A" />
                                <stop offset="1" stopColor="#00555F" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="cardStrokeA" x1="1181.5" y1="136" x2="2261.5" y2="2138.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#004E57" />
                                <stop offset="1" stopColor="#00A9BD" />
                            </linearGradient>
                            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="10" result="blur" />
                                <feColorMatrix
                                    in="blur"
                                    type="matrix"
                                    values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 0.5 0"
                                    result="glowOut"
                                />
                                <feMerge>
                                    <feMergeNode in="glowOut" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <circle
                            ref={curveRef}
                            cx="393.5"
                            cy="511.5"
                            r="392.5"
                            stroke="url(#curveGradient)"
                            strokeWidth="2"
                            filter="url(#glow)"
                            opacity="0.95"
                            style={{ transformOrigin: "393.5px 511.5px" }}
                        />

                        <g
                            ref={(el) => {
                                dotsRef.current[0] = el;
                            }}
                            transform="translate(0 0)"
                        >
                            <circle cx="211" cy="163" r="23.5" fill="#0B1F2A" stroke="#00A9BD" />
                            <path d="M215.524 150.727V174H209.911V155.977H209.774L204.57 159.159V154.295L210.308 150.727H215.524Z" fill="#00A9BD" />
                        </g>

                        <g
                            ref={(el) => {
                                dotsRef.current[1] = el;
                            }}
                            transform="translate(0 0)"
                        >
                            <circle cx="562" cy="163" r="23.5" fill="#0B1F2A" stroke="#00A9BD" />
                            <path d="M566.524 150.727V174H560.911V155.977H560.774L555.57 159.159V154.295L561.308 150.727H566.524Z" fill="#00A9BD" />
                        </g>

                        <g
                            ref={(el) => {
                                dotsRef.current[2] = el;
                            }}
                            transform="translate(0 0)"
                        >
                            <circle cx="742" cy="327" r="23.5" fill="#0B1F2A" stroke="#00A9BD" />
                            <path d="M746.524 314.727V338H740.911V319.977H740.774L735.57 323.159V318.295L741.308 314.727H746.524Z" fill="#00A9BD" />
                        </g>

                        <g
                            ref={(el) => {
                                dotsRef.current[3] = el;
                            }}
                            transform="translate(0 0)"
                            opacity="0.1"
                        >
                            <circle cx="786" cy="476" r="23.5" fill="#0B1F2A" stroke="#00A9BD" />
                            <path d="M776.901 483.136V478.75L786.435 463.727H790.332V469.682H788.071L782.491 478.523V478.705H796.298V483.136H776.901ZM788.139 487V481.795L788.253 479.875V463.727H793.514V487H788.139Z" fill="#00A9BD" />
                        </g>

                        <g
                            ref={(el) => {
                                cardsRef.current[0] = el;
                            }}
                        >
                            <rect x="52.5" y="2.5" width="299" height="115" rx="15.5" fill="url(#cardFillA)" />
                            <rect x="52.5" y="2.5" width="299" height="115" rx="15.5" stroke="url(#cardStrokeA)" />
                        </g>

                        <g
                            ref={(el) => {
                                cardsRef.current[1] = el;
                            }}
                        >
                            <rect x="403.5" y="2.5" width="299" height="115" rx="15.5" fill="url(#cardFillA)" />
                            <rect x="403.5" y="2.5" width="299" height="115" rx="15.5" stroke="url(#cardStrokeA)" />
                        </g>

                        <g
                            ref={(el) => {
                                cardsRef.current[2] = el;
                            }}
                        >
                            <rect x="861.5" y="170.5" width="299" height="115" rx="15.5" fill="url(#cardFillA)" />
                            <rect x="861.5" y="170.5" width="299" height="115" rx="15.5" stroke="url(#cardStrokeA)" />
                        </g>

                        <g
                            ref={(el) => {
                                cardsRef.current[3] = el;
                            }}
                        >
                            <rect x="858" y="427.5" width="283" height="115" rx="15.5" fill="url(#cardFillA)" />
                            <rect x="858" y="427.5" width="283" height="115" rx="15.5" stroke="url(#cardStrokeA)" />
                        </g>

                        <g
                            ref={centerRef}
                            transform="translate(0 0)"
                        >
                            <text x="562" y="406" textAnchor="middle" fill="#2FB7C2" fontSize="44" fontWeight="700">
                                A simple,
                            </text>
                            <text x="562" y="462" textAnchor="middle" fill="#FFFFFF" fontSize="44" fontWeight="700">
                                structured process
                            </text>
                            <text x="562" y="519" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15">
                                Our team brings years of experience producing high-impact visuals
                            </text>
                            <text x="562" y="543" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15">
                                for brands of all sizes. We turn complex ideas into clear,
                            </text>
                            <text x="562" y="567" textAnchor="middle" fill="rgba(255,255,255,0.68)" fontSize="15">
                                compelling stories through animation, product design and motion-driven content.
                            </text>
                        </g>
                    </svg>
                </div>
            </div>
        </section>
    );
}