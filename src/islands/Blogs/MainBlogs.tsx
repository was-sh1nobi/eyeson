import { useState } from "react";
import { RealBlogs } from "./RealBlogs.tsx";

export const MainBlogs = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleScrollToArticles = () => {
        const el = document.getElementById("articles-grid");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="relative w-full">
            {/* Hero Section */}
            <section className="relative z-10 mx-auto flex min-h-[50vh] max-w-5xl flex-col items-center justify-center px-4 pt-24 pb-8 text-center sm:px-6 lg:pt-32 lg:pb-12">
                {/* Ambient glow matching VideoHeader */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-[340px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,169,189,0.22)_0%,rgba(45,212,191,0.1)_45%,transparent_70%)] blur-[70px]"
                />

                {/* Eyebrow badge matching Video page */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#00A9BD]/40 bg-[#001721]/80 px-4 py-1.5 shadow-[0_0_20px_rgba(0,169,189,0.2)] backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-[#00E6D7] shadow-[0_0_8px_#00E6D7] animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#39d0c3] uppercase">
                        Insights & Perspectives
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Less Noise,{" "}
                    <span className="bg-gradient-to-r from-[#00E6D7] via-[#2dd4bf] to-[#00A9BD] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,230,215,0.35)]">
                        More Insight.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#c2d3dc] sm:text-base md:text-lg font-light">
                    Stories, creative strategies, and actionable breakdowns from inside EyesOn Studio. Built to inspire better decisions, not waste your time.
                </p>

                {/* Search Bar matching Video page's sleek borders and buttons */}
                <div className="mt-8 flex w-full max-w-2xl flex-col sm:flex-row items-center gap-2 sm:gap-3 rounded-2xl border border-[#00A9BD]/30 bg-[#00141f]/85 p-2 backdrop-blur-xl shadow-[0_0_30px_rgba(0,169,189,0.18)] transition-all duration-300 focus-within:border-[#00E6D7] focus-within:shadow-[0_0_35px_rgba(0,230,215,0.3)]">
                    <div className="flex h-12 w-full items-center gap-3 px-3">
                        <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-[#00E6D7] shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-3.5-3.5" />
                        </svg>
                        <input
                            className="w-full bg-transparent text-sm outline-none placeholder:text-white/50 text-white"
                            placeholder="Search ideas, topics, or keywords..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleScrollToArticles();
                            }}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="cursor-pointer text-white/50 hover:text-white p-1 text-sm transition-colors"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleScrollToArticles}
                        className="group relative shrink-0 w-full sm:w-auto h-12 px-6 rounded-xl cursor-pointer overflow-hidden font-medium text-sm text-white bg-gradient-to-r from-[#00A9BD] to-[#1D553A] border border-[#00E6D7]/40 shadow-[0_0_20px_rgba(0,169,189,0.3)] hover:shadow-[0_0_25px_rgba(0,230,215,0.5)] transition-all duration-200"
                    >
                        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%] skew-x-[-20deg]" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <span>Discover articles</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* Popular Topics Pill Tags */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/50">
                    <span className="text-white/40">Popular:</span>
                    {["Video Marketing", "Design", "Video Production", "Artificial Intelligence"].map((topic) => (
                        <button
                            key={topic}
                            type="button"
                            onClick={() => {
                                setSearchQuery(topic);
                                handleScrollToArticles();
                            }}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/70 hover:border-[#00A9BD]/50 hover:text-[#00E6D7] transition-colors cursor-pointer"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </section>

            {/* Subtle Divider */}
            <div className="relative mx-auto max-w-7xl px-4">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00A9BD]/30 to-transparent" />
            </div>

            {/* Articles Section */}
            <div id="articles-grid">
                <RealBlogs searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
            </div>
        </div>
    );
};
