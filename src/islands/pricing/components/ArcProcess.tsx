import { useEffect, useMemo, useRef, useState } from "react"

export const ArcProcess = () => {
    const steps = useMemo(
        () => [
            {
                id: 1,
                title: "Pick a Plan",
                subtitle: "Choose what fits your goal",
                description:
                    "Select a plan that matches your volume and style. We’ll confirm your brand voice, references, and platforms.",
            },
            {
                id: 2,
                title: "Kickoff + Brief",
                subtitle: "We align on the first batch",
                description:
                    "You share assets and a quick brief. We outline hooks, structure, and deliverables so there are no surprises.",
            },
            {
                id: 3,
                title: "Production",
                subtitle: "Script, edit, motion",
                description:
                    "We produce each video with the right pacing, overlays, and polish for the platform you’re targeting.",
            },
            {
                id: 4,
                title: "Delivery + Iterate",
                subtitle: "Weekly delivery rhythm",
                description:
                    "You receive videos on a predictable schedule. We iterate based on performance and feedback.",
            },
        ],
        [],
    )

    const sectionRef = useRef<HTMLElement>(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const element = sectionRef.current
        if (!element) return

        let rafId = 0
        let isVisible = false

        const clamp = (value: number, min: number, max: number) =>
            Math.min(Math.max(value, min), max)

        const isLowPower =
            typeof window !== "undefined" &&
            (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
                document.documentElement.classList.contains("gpu-off") ||
                (window as any).__GPU_OFF__)

        const update = () => {
            if (!element || !isVisible) return

            const rect = element.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const start = viewportHeight * 0.2
            const total = rect.height - viewportHeight * 0.4
            const next = clamp((start - rect.top) / total, 0, 1)
            setProgress((prev) => (Math.abs(prev - next) > 0.005 ? next : prev))
        }

        const onScroll = () => {
            if (!isVisible || rafId) return
            rafId = window.requestAnimationFrame(() => {
                update()
                rafId = 0
            })
        }

        let observer: IntersectionObserver | null = null
        if (typeof IntersectionObserver !== "undefined") {
            observer = new IntersectionObserver(
                (entries) => {
                    isVisible = entries[0].isIntersecting
                    if (isVisible) {
                        update()
                    }
                },
                { rootMargin: "150px" }
            )
            observer.observe(element)
        } else {
            isVisible = true
            update()
        }

        if (!isLowPower) {
            window.addEventListener("scroll", onScroll, { passive: true })
            window.addEventListener("resize", onScroll)
        } else {
            setProgress(0.5)
        }

        return () => {
            if (rafId) window.cancelAnimationFrame(rafId)
            if (observer) observer.disconnect()
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [])

    const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max)

    return (
        <section ref={sectionRef} className="relative z-10 mx-auto mt-10 w-full max-w-[980px] px-4 pb-24">
            <h2 className="text-center text-white text-2xl md:text-3xl font-bold mb-12">
                Our <span className="text-[#1FC5C8]">Process</span>
            </h2>

            <div className="relative">
                <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full -translate-x-1/2 lg:block">
                    <div className="relative h-full w-[4px] rounded-full bg-[#0D3444]">
                        <div
                            className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-[#24D6D2] to-[#0FA8C4] transition-[height] duration-200"
                            style={{ height: `${progress * 100}%` }}
                        />
                        <div
                            className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-[#65E6E3] bg-[#1FC5C8] shadow-[0_0_20px_rgba(31,197,200,0.8)] transition-[top] duration-200"
                            style={{ top: `calc(${progress * 100}% - 8px)` }}
                        />
                    </div>
                </div>

                <div className="space-y-10 md:space-y-12">
                    {steps.map((step, index) => {
                        const segment = 1 / steps.length
                        const segmentStart = index * segment
                        const stepProgress = clamp((progress - segmentStart) / segment, 0, 1)
                        const isActive = stepProgress > 0

                        const fromOffset = 260
                        const xOffset = (1 - stepProgress) * fromOffset
                        const signedOffset = index % 2 === 0 ? -xOffset : xOffset

                        const isLeft = index % 2 === 0

                        return (
                            <div key={step.id} className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[1fr_90px_1fr]">
                                <article
                                    className={`rounded-2xl border bg-[#0A1C29]/85 p-6 backdrop-blur-sm transition-[transform,opacity,border-color,box-shadow] duration-500 ${
                                        isActive
                                            ? "border-[#1FC5C8] shadow-[0_0_30px_rgba(31,197,200,0.18)]"
                                            : "border-[#14384B]"
                                    } ${isLeft ? "lg:col-start-1" : "lg:col-start-3"}`}
                                    style={{
                                        transform: `translate3d(${signedOffset}px, 0, 0)`,
                                        opacity: 0.25 + stepProgress * 0.75,
                                    }}
                                >
                                    <h3 className="text-white text-xl font-bold">{step.title}</h3>
                                    <p className="mt-1 text-[#1FC5C8] text-sm font-semibold">{step.subtitle}</p>
                                    <p className="mt-3 text-white/70 text-base leading-6">{step.description}</p>
                                </article>
                            </div>
                        )
                    })}
                </div>
            </div>
            </section>
    )
}
