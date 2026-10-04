import { useMemo, useState, useEffect } from "react";
import { SmartImage } from "../../utils/SmartImage.tsx";

const STRAPI_URL = import.meta.env.PUBLIC_POST_URL || "https://blog.eyesonstudio.com";
const API_URL = `${STRAPI_URL}/api/posts`;

interface StrapiPost {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    category?: string | null;
    content?: string;
    publishedAt: string;
    cover?: { url: string } | null;
}

interface Post {
    id: number;
    category: string;
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    image: string;
}

const categories = [
    { id: 1, name: "All" },
    { id: 2, name: "Video Marketing" },
    { id: 3, name: "Design" },
    { id: 4, name: "Video Production" },
    { id: 5, name: "Artificial Intelligence" },
];

function extractExcerpt(content?: string): string {
    if (!content) return "Insights, strategies, and creative playbooks from EyesOn Studio...";
    const clean = content
        .replace(/#+\s+.*?\n/g, " ")
        .replace(/!\[.*?\]\(.*?\)/g, " ")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    if (clean.length <= 130) return clean;
    return clean.slice(0, 130) + "...";
}

interface RealBlogsProps {
    searchQuery?: string;
    onClearSearch?: () => void;
}

export const RealBlogs = ({ searchQuery = "", onClearSearch }: RealBlogsProps) => {
    const [page, setPage] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
    const pageSize = 9;

    useEffect(() => {
        fetch(`${API_URL}?populate=*`)
            .then((res) => res.json())
            .then((data) => {
                const mapped: Post[] = data.data.map((post: StrapiPost) => {
                    const coverUrl = post.cover?.url
                        ? post.cover.url.startsWith("http")
                            ? post.cover.url
                            : `${STRAPI_URL}${post.cover.url}`
                        : "";
                    return {
                        id: post.id,
                        title: post.title,
                        slug: post.slug,
                        category: post.category || "Video Production",
                        excerpt: extractExcerpt(post.content),
                        date: new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        }),
                        image: coverUrl,
                    };
                });
                setPosts(mapped);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const normalize = (value: string) => value.trim().toLowerCase();

    useEffect(() => {
        setPage(1);
    }, [selectedCategory, searchQuery]);

    const filteredPosts = useMemo(() => {
        let result = posts;

        const cat = normalize(selectedCategory);
        if (cat !== "all") {
            result = result.filter((post) => normalize(post.category) === cat);
        }

        const q = normalize(searchQuery);
        if (q) {
            result = result.filter(
                (post) =>
                    normalize(post.title).includes(q) ||
                    normalize(post.excerpt).includes(q) ||
                    normalize(post.category).includes(q)
            );
        }

        return result;
    }, [selectedCategory, posts, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
    const paginatedPosts = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredPosts.slice(start, start + pageSize);
    }, [filteredPosts, page]);

    useEffect(() => {
        const prevLink = document.querySelector('link[rel="prev"]');
        const nextLink = document.querySelector('link[rel="next"]');
        const baseUrl = `${window.location.origin}/blogs`;

        if (page > 1) {
            const href = `${baseUrl}?page=${page - 1}`;
            if (prevLink) {
                prevLink.setAttribute("href", href);
            } else {
                const link = document.createElement("link");
                link.rel = "prev";
                link.href = href;
                document.head.appendChild(link);
            }
        } else if (prevLink) {
            prevLink.remove();
        }

        if (page < totalPages) {
            const href = `${baseUrl}?page=${page + 1}`;
            if (nextLink) {
                nextLink.setAttribute("href", href);
            } else {
                const link = document.createElement("link");
                link.rel = "next";
                link.href = href;
                document.head.appendChild(link);
            }
        } else if (nextLink) {
            nextLink.remove();
        }

        return () => {
            document.querySelector('link[rel="prev"]')?.remove();
            document.querySelector('link[rel="next"]')?.remove();
        };
    }, [page, totalPages]);

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
        const el = document.getElementById("articles-grid");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
    };

    if (loading) {
        return (
            <div className="relative z-10 mx-auto mt-12 grid w-full max-w-7xl grid-cols-1 justify-items-center gap-6 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 md:px-8 xl:gap-8">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="flex min-h-[380px] h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#00131e]/70"
                    >
                        <div className="relative h-48 w-full overflow-hidden bg-white/5">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <div className="h-4 w-24 rounded-full bg-white/10" />
                            <div className="h-5 w-full rounded bg-white/10" />
                            <div className="h-4 w-5/6 rounded bg-white/10" />
                            <div className="h-4 w-2/3 rounded bg-white/10" />
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="h-3 w-24 rounded bg-white/10" />
                                <div className="h-3 w-16 rounded bg-white/10" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <style>{`
              @keyframes card-ai-float { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.25; } 50% { transform: translateY(-4px) scale(1.03); opacity: 0.55; } }
              @keyframes card-ai-core { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.12); opacity: 0.7; } }
              @keyframes card-orbit { to { transform: rotate(360deg); } }
              @keyframes card-orbit-rev { to { transform: rotate(-360deg); } }
              @keyframes card-node-pulse { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }
            `}</style>

            <div className="relative z-10 w-full overflow-hidden pt-4 pb-12">
                {/* Categories Tab Pill Bar */}
                <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-4 sm:gap-3 sm:px-6 lg:gap-3.5">
                    {categories.map((category) => {
                        const isActive = normalize(selectedCategory) === normalize(category.name);
                        return (
                            <button
                                type="button"
                                onClick={() => handleCategorySelect(category.name)}
                                key={category.id}
                                className={`cursor-pointer shrink-0 rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 ${
                                    isActive
                                        ? "shadow-[0_0_24px_rgba(0,169,189,0.45)] bg-gradient-to-r from-[#00A9BD] to-[#1D553A] border border-[#00E6D7] text-white scale-[1.03]"
                                        : "bg-[#00141f]/70 border border-white/10 text-white/70 hover:border-[#00A9BD]/50 hover:text-white backdrop-blur-md"
                                }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {/* Active Search / Filter status indicator */}
                {searchQuery && (
                    <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 pt-3 text-xs text-white/70 sm:px-6 md:px-8">
                        <p>
                            Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} matching{" "}
                            <span className="font-semibold text-[#00E6D7]">&ldquo;{searchQuery}&rdquo;</span>
                        </p>
                        {onClearSearch && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="cursor-pointer font-medium text-[#39d0c3] hover:underline"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                )}

                {/* Post Cards Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="relative z-10 mx-auto mt-6 grid w-full max-w-7xl grid-cols-1 justify-items-center gap-6 px-4 pb-14 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 md:px-8 xl:gap-8">
                        {paginatedPosts.map((post) => (
                            <a
                                href={`/blog/${post.slug}`}
                                key={post.id}
                                className="group relative flex min-h-[380px] h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#00131e]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#00A9BD]/70 hover:shadow-[0_16px_36px_rgba(0,169,189,0.25)]"
                            >
                                {/* Top ambient highlight line on hover */}
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E6D7] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <div className="relative h-48 w-full overflow-hidden bg-[#010e17]">
                                    {imageErrors[post.id] || !post.image ? (
                                        <div className="absolute inset-0 overflow-hidden bg-[#02131C]">
                                            <div
                                                className="absolute inset-0 opacity-15"
                                                style={{
                                                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,169,189,0.2) 1px, transparent 0)`,
                                                    backgroundSize: '14px 14px',
                                                    animation: 'card-ai-float 5s ease-in-out infinite',
                                                    willChange: 'transform, opacity'
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,169,189,0.04)_0%,transparent_50%)]" />
                                            <div className="absolute inset-0 grid place-items-center">
                                                <div className="h-16 w-16 rounded-full border border-[#00A9BD]/10" style={{ animation: 'card-orbit 25s linear infinite', willChange: 'transform' }} />
                                                <div className="h-11 w-11 rounded-full border border-dashed border-[#00A9BD]/15" style={{ animation: 'card-orbit-rev 18s linear infinite', willChange: 'transform' }} />
                                                <div className="h-8 w-8 rounded-full border border-[#00A9BD]/20" style={{ animation: 'card-ai-core 3s ease-in-out infinite', willChange: 'transform, opacity' }} />
                                                <div className="h-4 w-4 rounded-md border border-[#00A9BD]/30 bg-[#00A9BD]/10" style={{ animation: 'card-ai-core 2.5s ease-in-out infinite 0.3s', willChange: 'transform, opacity' }} />
                                                <div className="h-1.5 w-1.5 rounded-full bg-[#00A9BD]/60" style={{ animation: 'card-node-pulse 2s ease-in-out infinite', willChange: 'transform, opacity' }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                            loading="lazy"
                                            onError={() => setImageErrors((prev) => ({ ...prev, [post.id]: true }))}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#00131e] via-[#00131e]/30 to-transparent opacity-85" />

                                    <span className="absolute top-3 left-3 rounded-full border border-[#00A9BD]/40 bg-[#000E17]/85 px-3 py-1 text-[11px] font-semibold text-[#39d0c3] backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                        {post.category}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col p-5 text-left text-white">
                                    <h3 className="text-base sm:text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-[#00E6D7] line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#c2d3dc]/80 font-light">
                                        {post.excerpt}
                                    </p>

                                    <footer className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 text-[11px] text-white/60">
                                        <div className="flex items-center gap-2 text-white/80">
                                            <SmartImage
                                                src="/blogs/P1.svg"
                                                alt="Eyeson Studio"
                                                width={16}
                                                height={16}
                                                className="h-4 w-4"
                                            />
                                            <span className="font-medium text-white/80">EyesOn Studio</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white/60">
                                            <SmartImage
                                                src="/blogs/P2.svg"
                                                alt="Calendar"
                                                width={14}
                                                height={14}
                                                className="h-3.5 w-3.5 opacity-70"
                                            />
                                            <span>{post.date}</span>
                                        </div>
                                    </footer>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    /* Empty Search State */
                    <div className="relative z-10 mx-auto my-16 flex max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-[#00A9BD]/30 bg-[#00131e]/50 p-8 text-center text-white/70">
                        <div className="rounded-full bg-[#00A9BD]/15 p-4 text-[#00E6D7]">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h4 className="mt-4 text-lg font-bold text-white">No articles found</h4>
                        <p className="mt-2 text-xs text-white/60 leading-relaxed">
                            We couldn&apos;t find any articles matching your search or filter. Try a different term or reset filters.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCategory("All");
                                if (onClearSearch) onClearSearch();
                            }}
                            className="mt-5 rounded-xl border border-[#00A9BD]/40 bg-[#00A9BD]/10 px-4 py-2 text-xs font-semibold text-[#00E6D7] hover:bg-[#00A9BD]/20 transition-colors cursor-pointer"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 pt-2 pb-10">
                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                            className="cursor-pointer rounded-xl border border-white/10 bg-[#FFFFFF0A] px-4 py-2 text-xs sm:text-sm text-white/80 transition hover:border-[#00A9BD]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }).map((_, idx) => {
                            const num = idx + 1;
                            const active = num === page;
                            return (
                                <button
                                    key={num}
                                    onClick={() => goToPage(num)}
                                    className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition ${
                                        active
                                            ? "border border-[#00E6D7] bg-gradient-to-r from-[#00A9BD] to-[#1D553A] text-white shadow-[0px_0px_16px_rgba(0,169,189,0.5)]"
                                            : "border border-white/10 bg-[#FFFFFF0A] text-white/70 hover:border-white/30 hover:text-white"
                                    }`}
                                >
                                    {num}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page === totalPages}
                            className="cursor-pointer rounded-xl border border-white/10 bg-[#FFFFFF0A] px-4 py-2 text-xs sm:text-sm text-white/80 transition hover:border-[#00A9BD]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
