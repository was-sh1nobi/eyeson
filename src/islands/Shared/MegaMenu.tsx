"use client";

import { useState, useEffect } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICE_GROUPS = [
    {
        title: "Product Marketing & Video Production",
        description: "Production systems for brands that need consistent content output.",
        items: [
            { title: "Product & SaaS Trailers", description: "Launch videos for SaaS products and digital platforms.", image: "/Header/ContentServices/cp.webp", accent: "#17d6d4", href: "/saas" },
            { title: "Explainer Videos", description: "Animated videos that explain products, services, and concepts.", image: "/Header/ContentServices/sfc.webp", accent: "#4bc7ff", href: "/saas" },
            { title: "Product Demo Videos", description: "Feature walkthroughs and product demonstrations.", image: "/Header/ContentServices/vd.webp", accent: "#7ee6ff", href: "/video" },
            { title: "Ad Creative Production", description: "Video ads for paid social and performance marketing.", image: "/Header/ContentServices/ac.webp", accent: "#66f2c5", href: "/adcreatives" },
        ],
        href: "/video",
    },
    {
        title: "Content Production",
        description: "Motion-first storytelling and animation work.",
        items: [
            { title: "Video Editing for Social Media", description: "Short form editing for TikTok, Reels, Shorts, and social campaigns.", image: "/Header/ContentServices/vd.webp", accent: "#8eefff", href: "/video" },
            { title: "Motion Graphics", description: "Animated graphics for marketing, education, and brand content.", image: "/Header/C&MServices/mg.webp", accent: "#5ee8ff", href: "/motiongraphics" },
            { title: "Full Content Production Retainer", description: "Ongoing content creation, editing, and publishing support.", image: "/Header/C&MServices/md.webp", accent: "#5ee8ff", href: "/retainers" },
        ],
        href: "/animation",
    },
    {
        title: "Design & Motion",
        description: "Brand and digital systems built for clarity.",
        items: [
            { title: "2D / 3D Animation", description: "Custom animation for products, brands, and visual storytelling.", image: "/Header/C&MServices/23a.webp", accent: "#ffd56a", href: "/animation" },
            { title: "Brand Identity & Logo Design", description: "Logos, visual systems, and brand guidelines.", image: "/Header/DesignServices/uixd.webp", accent: "#ffee99", href: "/branding" },
            { title: "UI/UX Design", description: "Websites, landing pages, and SaaS product interfaces.", image: "/Header/DesignServices/uixd.webp", accent: "#ffee99", href: "/uiux" },
        ],
        href: "/branding",
    },
];

const MENU_ITEMS = [
    { id: "1", title: "Home", path: "/" },
    { id: "3", title: "Portfolio", path: "/portfolio" },
    { id: "4", title: "Pricing", path: "/pricing" },
    { id: "5", title: "About", path: "/about" },
    { id: "6", title: "Contact", path: "/contact" },
];

// ─── Desktop Mega Menu ────────────────────────────────────────────────────────

export const MegaMenu = () => {
    const [active, setActive] = useState(0);

    return (
        <div className="w-[min(1060px,calc(100vw-2rem))] rounded-[34px] border border-[#2bb7c2]/35 bg-[#081721] p-3 shadow-[0_0_40px_rgba(25,189,202,0.24)] backdrop-blur-xl">
            <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
                {/* LEFT — Service Groups */}
                <aside className="rounded-[28px] bg-gradient-to-r from-[#0B1F2A] to-[#09252F] p-5">
                    <p className="text-sm text-white/45">Our Services</p>
                    <div className="mt-6 space-y-2">
                        {SERVICE_GROUPS.map((group, index) => (
                            <button
                                key={group.title}
                                onMouseEnter={() => setActive(index)}
                                className={`w-full rounded-[20px] px-4 py-4 text-left transition-colors duration-200 ${
                                    active === index ? "text-[#22d7de] bg-white/5" : "text-white hover:bg-white/5"
                                }`}
                            >
                                <div className="text-[20px] font-semibold leading-tight">{group.title}</div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* RIGHT — Service Cards */}
                <section className="rounded-[28px] p-3">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 transition-opacity duration-300">
                        {SERVICE_GROUPS[active].items.map((card) => (
                            <a
                                key={card.title}
                                href={card.href}
                                className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-[#FFFFFF05] p-3 transition-colors hover:border-white/10 hover:bg-gradient-to-r hover:from-[#00A9BD]/20 hover:to-[#46B6A0]/20"
                            >
                                <div
                                    className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#04131b]"
                                    style={{ boxShadow: `0 0 0 1px ${card.accent}22` }}
                                >
                                    <img src={card.image} alt={card.title} loading="lazy" decoding="async" width={48} height={48} className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-transparent" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-white transition-colors group-hover:text-[#e9ffff]">{card.title}</h3>
                                    <p className="mt-1 text-[12px] leading-4 text-white/80 line-clamp-2">{card.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

// ─── Mobile: Single Service Group Accordion (CSS Grid Optimized) ────────────

interface MobileServiceGroupProps {
    group: (typeof SERVICE_GROUPS)[number];
    onClose: () => void;
}

const MobileServiceGroup = ({ group, onClose }: MobileServiceGroupProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`rounded-2xl border transition-colors duration-200 ${open ? "border-[#2bd6de]/25 bg-[#071e2b]" : "border-white/[0.07] bg-white/[0.03]"}`}>
            <button onClick={() => setOpen((p) => !p)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: group.items[0].accent, boxShadow: `0 0 8px ${group.items[0].accent}` }} />
                    <span className="text-[15px] font-semibold text-white">{group.title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] text-[#86f5ff] transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▾</span>
                </div>
            </button>

            {/* CSS Grid Animation Trick for Performance */}
            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    <div className="px-3 pb-3">
                        <div className="grid grid-cols-3 gap-2">
                            {group.items.map((card) => (
                                <a key={card.title} href={card.href} onClick={onClose} className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-[#04131b] p-2 text-center transition-colors hover:border-[#2bd6de]/30 hover:bg-[#071f2b]">
                                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 shrink-0" style={{ boxShadow: `0 0 0 1px ${card.accent}33` }}>
                                        <img src={card.image} alt={card.title} className="h-full w-full object-cover" loading="lazy" />
                                    </div>
                                    <p className="text-[10px] leading-tight text-white/60 line-clamp-2">{card.title}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Mobile Menu Panel (Hardware Accelerated) ─────────────────────────────────

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
}

export const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
    const [servicesOpen, setServicesOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#000E17]/80" onClick={onClose} />

            {/* Slide-in Panel (transform-gpu for 60fps) */}
            <div className={`absolute right-0 top-0 h-screen w-[92%] max-w-[380px] border-l border-[#3AAFC8]/25 bg-[#020915] transform-gpu transition-transform duration-300 ease-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}>
                
                <div className="flex-1 px-4 pb-5 pt-6 overflow-y-auto overscroll-contain">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <a href="/" onClick={onClose}>
                            <img src="/logo.webp" className="h-10 object-contain" alt="EyesOn logo" />
                        </a>
                        <button onClick={onClose} className="h-10 w-10 rounded-full border border-[#3AAFC8]/40 bg-[#071D29] text-[#45D4E8] text-2xl flex items-center justify-center">
                            ×
                        </button>
                    </div>

                    {/* Nav */}
                    <div className="space-y-2">
                        <a href={MENU_ITEMS[0].path} onClick={onClose} className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-white/75 transition-colors hover:bg-white/[0.04]">
                            {MENU_ITEMS[0].title}
                        </a>

                        <button onClick={() => setServicesOpen((p) => !p)} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors ${servicesOpen ? "border-[#2bd6de]/35 bg-[#0a2330] text-white" : "border-white/[0.08] bg-white/[0.04] text-white"}`}>
                            <span className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-[#2bd6de]" />
                                <span className="text-[15px] font-semibold">Services</span>
                            </span>
                            <span className={`text-xs text-[#86f5ff] transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}>▾</span>
                        </button>

                        {/* Services List */}
                        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${servicesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="overflow-hidden">
                                <div className="rounded-3xl border border-[#2bb7c2]/20 bg-[#06141d] p-2.5 mt-2 space-y-2">
                                    <p className="px-2 pt-1 pb-1.5 text-[10px] uppercase tracking-[0.25em] text-white/30">Our Services</p>
                                    {SERVICE_GROUPS.map((group) => (
                                        <MobileServiceGroup key={group.title} group={group} onClose={onClose} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/[0.06] mx-1 my-2" />

                        {MENU_ITEMS.slice(1).map((item) => (
                            <a key={item.id} href={item.path} onClick={onClose} className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-white/75 transition-colors hover:bg-white/[0.04]">
                                {item.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* CTA Buttons Sticky at Bottom */}
                <div className="mt-auto grid grid-cols-2 gap-3 p-4 border-t border-white/5 bg-[#020915]">
                    <button onClick={() => window.location.href = "/contact"} className="rounded-full border border-[#3AAFC8]/45 bg-[#041827] px-3 py-3 text-sm font-semibold text-white cursor-pointer">Book a call</button>
                    <button className="rounded-full bg-gradient-to-r from-[#00A9BD] to-[#1D553A] px-3 py-3 text-sm font-semibold text-white">Free sample</button>
                </div>
            </div>
        </div>
    );
};

// ─── Full Header ──────────────────────────────────────────────────────────────

export const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let rafId = 0;
        const onScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = 0;
                const isScrolled = window.scrollY > 20;
                setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            <header className="fixed z-50 w-full top-0">
                <div className={`relative px-4 sm:px-6 lg:px-10 transition-[padding] duration-300 ease-out ${scrolled ? "py-2 lg:py-3" : "py-3 lg:py-6"}`}>

                    {/* Scroll background */}
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-full transition-[background-color,box-shadow,opacity] duration-300 ease-out ${scrolled ? "bg-[#000E17]/90 backdrop-blur-md shadow-md" : "bg-transparent opacity-0"}`} />

                    {/* Desktop Header */}
                    <div className="relative mx-auto max-w-[1200px] hidden lg:flex items-center justify-between gap-3">
                        <a href="/" className="relative z-50">
                            <img src="/logo.webp" className={`object-contain transition-[height] duration-300 ${scrolled ? "h-10" : "h-14"}`} alt="EyesOn logo" />
                        </a>

                        <nav className="hidden lg:flex items-center gap-7">
                            <a href={MENU_ITEMS[0].path} className="text-white/90 hover:text-white transition-colors">{MENU_ITEMS[0].title}</a>
                            <div className="group relative">
                                <a href="#" className="text-white/90 hover:text-white transition-colors inline-flex items-center gap-1 py-4">
                                    Services <span className="text-xs transition-transform group-hover:rotate-180">▾</span>
                                </a>
                                <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[min(1060px,calc(100vw-2rem))] -translate-x-1/2 opacity-0 translate-y-2 transition-[opacity,transform] duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                                    <div className="h-4 w-full" aria-hidden="true" />
                                    <MegaMenu />
                                </div>
                            </div>
                            {MENU_ITEMS.slice(1).map((item) => (
                                <a key={item.id} href={item.path} className="text-white/90 hover:text-white transition-colors">{item.title}</a>
                            ))}
                        </nav>

                        <a href="/contact" className="hidden lg:block px-8 py-2.5 rounded-full text-white font-semibold bg-[#0B1F2A] border border-cyan-300/70 shadow-[0_0_30px_rgba(45,220,255,0.2)] hover:bg-[#0f2c3d] transition-colors text-center">
                            Book a Call
                        </a>
                    </div>

                    {/* Mobile / Compact Header */}
                    <div className="relative mx-auto max-w-[1200px] flex lg:hidden items-center justify-between rounded-full border border-[#3AAFC8]/35 bg-[#000E17]/90 px-4 py-2 shadow-lg backdrop-blur-md sm:px-6">
                        <a href="/" className="relative z-50">
                            <img src="/logo.webp" className="h-9 object-contain" alt="EyesOn logo" />
                        </a>
                        <button className="rounded-full px-5 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-[#00A9BD] to-[#1D553A]">
                            Free sample
                        </button>
                        <button onClick={() => setMobileOpen(true)} className="h-10 w-10 rounded-full border border-[#3AAFC8]/40 bg-[#07202B] flex flex-col justify-center items-center gap-[4px]">
                            <span className="w-5 h-[2px] bg-[#45D4E8] rounded-full" />
                            <span className="w-4 h-[2px] bg-[#45D4E8] rounded-full" />
                            <span className="w-5 h-[2px] bg-[#45D4E8] rounded-full" />
                        </button>
                    </div>
                </div>
            </header>

            <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
        </>
    );
};

export default Header;
