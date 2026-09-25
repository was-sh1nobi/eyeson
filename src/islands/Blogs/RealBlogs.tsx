
import { useMemo, useState, useEffect } from "react";
import {SmartImage} from "../../utils/SmartImage.tsx";

const STRAPI_URL = import.meta.env.PUBLIC_POST_URL || "https://blog.eyesonstudio.com";
const API_URL = `${STRAPI_URL}/api/posts`;
interface StrapiPost {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    category: string;
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

export const RealBlogs = () => {
    const [page, setPage] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
    const pageSize = 12;

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
                        excerpt: "Read more about this topic...",
                        date: new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
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

    const filteredPosts = useMemo(() => {
        if (normalize(selectedCategory) === "all") {
            return posts;
        }

        const selected = normalize(selectedCategory);
        return posts.filter((post) => normalize(post.category) === selected);
    }, [selectedCategory, posts]);

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

    const placeholderCount = Math.max(0, pageSize - paginatedPosts.length);

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
    };

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setPage(1);
    };

    if (loading) {
        return (
            <>
                <div className="relative z-10 mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 justify-items-center gap-4 px-4 pb-14 sm:grid-cols-2 sm:gap-6 sm:px-6 md:grid-cols-3 md:gap-8 md:px-8 xl:gap-10 xl:px-10">
                    {Array.from({ length: 9 }).map((_, idx) => {
                        const showOnTablet = idx >= 3 ? "hidden sm:block" : "";
                        const showOnDesktop = idx >= 6 ? "hidden md:block" : "";
                        return (
                            <div
                                key={idx}
                                className={`flex min-h-70 h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-[0.5px] border-[#00A9BD]/30 bg-linear-to-r from-[#0B1F2A] to-[#003A43] sm:max-w-90 ${showOnTablet} ${showOnDesktop}`}
                            >
                                <div className="relative h-40 w-full overflow-hidden bg-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                                </div>
                                <div className="flex flex-1 flex-col gap-3 px-4 py-4">
                                    <div className="h-4 w-16 rounded-full bg-white/10" />
                                    <div className="h-5 w-full rounded bg-white/10" />
                                    <div className="h-4 w-full rounded bg-white/10" />
                                    <div className="h-4 w-3/4 rounded bg-white/10" />
                                    <div className="mt-auto flex items-center justify-between pt-2">
                                        <div className="h-3 w-20 rounded bg-white/10" />
                                        <div className="h-3 w-16 rounded bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 pb-10">
                    <div className="h-9 w-20 rounded-lg bg-white/10" />
                    <div className="flex gap-2">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="h-9 w-9 rounded-lg bg-white/10" />
                        ))}
                    </div>
                    <div className="h-9 w-16 rounded-lg bg-white/10" />
                </div>
            </>
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
        <div
            className="relative min-h-712.5 overflow-x-hidden lg:min-h-587.5 overflow-y-hidden"
            data-category-count={categories.length}
        >


            <div className="relative z-10 mx-auto mt-5 flex w-full max-w-7xl flex-wrap items-center justify-center gap-2 px-3 py-4 sm:flex-nowrap sm:gap-3 sm:px-8 sm:py-8 lg:gap-4 lg:px-12 lg:py-12">
                {categories.map((category ) => (
                    <div
                        onClick={() => handleCategorySelect(category.name)}
                        key={category.id} className={` cursor-pointer shrink-0 rounded-[30px]  transition-[background-color,border-color,box-shadow]  px-5 py-2 text-xs sm:text-sm text-white ${selectedCategory.trim() === category.name.trim() ? "shadow-[0_0_35px_#056E7C80]  bg-linear-to-r from-[#00A9BD] to-[#1D553A] border-[3px] border-[#00A9BD]" : "shadow-[0_0_35px_#056E7C3D] bg-[#03001357] border-[3px] border-transparent "}`}>
                        {category.name}
                    </div>

                ))}
            </div>

            <div
                className="relative z-10 mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 justify-items-center gap-4 px-4 pb-14 sm:grid-cols-2 sm:gap-6 sm:px-6 md:grid-cols-3 md:gap-8 md:px-8 xl:gap-10 xl:px-10">
                {paginatedPosts.map((post) => (
                    <a
                        href={`/blog/${post.slug}`}
                        key={post.id}
                        className="group flex min-h-70 h-full overflow-y-hidden w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-[0.5px] border-[#00A9BD] bg-linear-to-r from-[#0B1F2A]  to-[#003A43] shadow-[0px_6px_22px_0px_#00000060] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 hover:border-[#00A9BD]/60 sm:max-w-90"
                    >
                        <div className="relative h-40 w-full overflow-hidden">
                            {imageErrors[post.id] || !post.image ? (
                                <div className="absolute inset-0 overflow-hidden bg-[#02131C]">
                                    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,169,189,0.2) 1px, transparent 0)`, backgroundSize: '14px 14px', animation: 'card-ai-float 5s ease-in-out infinite', willChange: 'transform, opacity' }} />
                                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,169,189,0.04)_0%,transparent_50%)]" />
                                    <div className="absolute inset-0 grid place-items-center">
                                        <div className="h-16 w-16 rounded-full border border-[#00A9BD]/10" style={{ animation: 'card-orbit 25s linear infinite', willChange: 'transform' }} />
                                        <div className="h-11 w-11 rounded-full border border-dashed border-[#00A9BD]/15" style={{ animation: 'card-orbit-rev 18s linear infinite', willChange: 'transform' }} />
                                        <div className="h-8 w-8 rounded-full border border-[#00A9BD]/20" style={{ animation: 'card-ai-core 3s ease-in-out infinite', willChange: 'transform, opacity' }} />
                                        <div className="h-4 w-4 rounded-md border border-[#00A9BD]/30 bg-[#00A9BD]/10" style={{ animation: 'card-ai-core 2.5s ease-in-out infinite 0.3s', willChange: 'transform, opacity' }} />
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#00A9BD]/60" style={{ animation: 'card-node-pulse 2s ease-in-out infinite', willChange: 'transform, opacity' }} />
                                        <div className="absolute h-1.5 w-1.5 rounded-full bg-[#00A9BD]/50 shadow-[0_0_4px_rgba(0,169,189,0.4)]" style={{ animation: 'card-orbit 6s linear infinite', marginTop: '-28px', transformOrigin: 'center' }} />
                                        <div className="absolute h-1 w-1 rounded-full bg-[#2dd4bf]/50 shadow-[0_0_3px_rgba(45,212,191,0.3)]" style={{ animation: 'card-orbit-rev 5s linear infinite', marginTop: '28px', transformOrigin: 'center' }} />
                                        <div className="absolute h-1 w-1 rounded-full bg-[#00A9BD]/60 shadow-[0_0_3px_rgba(0,169,189,0.3)]" style={{ animation: 'card-orbit 4.5s linear infinite', marginLeft: '-22px', transformOrigin: 'center' }} />
                                        <div className="absolute h-0.5 w-0.5 rounded-full bg-[#2dd4bf]/60" style={{ animation: 'card-orbit-rev 3.5s linear infinite', marginLeft: '22px', transformOrigin: 'center' }} />
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                    onError={() => setImageErrors((prev) => ({ ...prev, [post.id]: true }))}
                                />
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        </div>

                        <div className="flex flex-1 flex-col gap-3 px-4 py-4 text-left text-white">
              <span className="rounded-full text-[10px] font-semibold text-[#00A9BD] backdrop-blur">
                {post.category}
              </span>
                            <h3 className="text-base font-semibold leading-tight text-white group-hover:text-[#00A9BD]">
                                {post.title}
                            </h3>
                            <p className="line-clamp-3 text-xs leading-relaxed text-white/70">
                                {post.excerpt}
                            </p>
                            <footer className="mt-auto flex items-center justify-between pt-2 text-[11px] text-white/70">
                                <div className="flex items-center gap-2 text-white/80">
                                    <SmartImage
                                        src="/blogs/P1.svg"
                                        alt="Eyeson Studio"
                                        width={16}
                                        height={16}
                                        className="h-4 w-4"
                                    />
                                    <span>Eyeson Studio</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <SmartImage
                                        src="/blogs/P2.svg"
                                        alt="Calendar icon"
                                        width={16}
                                        height={16}
                                        className="h-4 w-4"
                                    />
                                    <span>{post.date}</span>
                                </div>
                            </footer>
                        </div>
                    </a>
                ))}



                {Array.from({ length: placeholderCount }).map((_, idx) => (
                    <div
                        key={`placeholder-${idx}`}
                        className="flex min-h-70 h-full w-full max-w-105 flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-[#03001357] px-6 text-center text-white/60"
                    >
                        <span className="text-sm font-semibold text-[#00A9BD]">No blog here… yet</span>
                        <p className="mt-2 text-xs text-white/50">We&apos;re preparing more stories for this category.</p>
                    </div>
                ))}
            </div>
            <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 pb-10">
                <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="cursor-pointer rounded-lg border border-white/20 bg-[#FFFFFF0D] px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
                            className={`cursor-pointer rounded-lg bg-[#FFFFFF0D] px-3 py-2 text-sm transition ${
                                active
                                    ? "border border-[#46B6A0] text-white shadow-[0px_0px_12px_0px_#00A9BD55]"
                                    : "border border-white/20 text-white/80 hover:border-white/40 hover:text-white"
                            }`}
                        >
                            {num}
                        </button>
                    );
                })}
                <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="cursor-pointer rounded-lg border border-white/20 bg-[#FFFFFF0D] px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                </button>
            </div>

            <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 md:px-8 xl:px-10">
                <div className="relative overflow-hidden rounded-3xl border border-[#00A9BD]/40 shadow-[0px_0px_30px_0px_#00A9BD40]">
                    <SmartImage
                        src="/blogs/Story-Back.webp"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-[#031722]/90 via-[#031722]/65 to-[#031722]/25" />

                    <div className="relative flex min-h-57.5 flex-col justify-center gap-6 px-6 py-10 text-center sm:gap-8 sm:px-10 sm:text-left lg:min-h-65 lg:flex-row lg:items-center lg:justify-between lg:px-14">
                        <div className="max-w-xl text-white mx-auto lg:mx-0">
                            <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                                Let Your Story Move People.
                            </h2>
                            <p className="mt-3 text-sm text-white/85 sm:text-lg">
                                Tell us what you&apos;re building - we&apos;ll bring it to life with motion.
                            </p>
                            <button className="mt-6 w-full max-w-60 mx-auto cursor-pointer rounded-xl bg-linear-to-r from-[#46B6A0] to-[#00A9BD] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_-10px_#00A9BD] transition sm:mx-0 sm:w-auto">
                                Start a Motion Project
                            </button>
                        </div>

                        <div className="relative hidden h-35 w-full max-w-70 self-end sm:block sm:h-45 sm:max-w-85 lg:h-52.5 lg:max-w-105">
                            <SmartImage
                                src="/blogs/People-ChatGPT.webp"
                                alt="People discussing creative ideas"
                                width={700}
                                height={700}
                                className="object-contain object-right"
                            />
                        </div>
                    </div>
                </div>
            </section>


        </div>
        </>
    );
};
