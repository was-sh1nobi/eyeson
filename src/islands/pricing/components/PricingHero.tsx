"use client";

import { useEffect, useRef, useState } from "react";
import { ShortForm } from "./ShortForm";
import { SummaryPanel } from "./SummaryPanel";
import { PackageCards } from "./PackageCards";

const options = [
  { id: 1, name: "Product Trailers & Explainers", label: "Product Trailers & Explainers" },
  { id: 2, name: "Talking Head Editing", label: "Talking Head Editing" },
  { id: 3, name: "Social Media Animation Reels", label: "Social Media Animation Reels" },
  { id: 4, name: "2D Animation", label: "2D Animation" },
  { id: 5, name: "3D Animation", label: "3D Animation" },
  { id: 6, name: "Branding & Design", label: "Branding & Design" },
  { id: 7, name: "UI/UX Design", label: "UI/UX Design" },
  { id: 8, name: "CGI & Character Animation", label: "CGI & Character Animation" },
  { id: 9, name: "Monthly Content Packages", label: "Monthly Content Packages" },
];

export const PricingHero = () => {
  const [selected, SetSelected] = useState<string>(options[0].name);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [estimatedSummary, setEstimatedSummary] = useState<{
    packageName: string
    lines: { title: string; value: string; price: number }[]
    total: number
    deliveryHint: string
    duration: number
    durationTitle?: string
  } | null>(null);

  const handleEstimated = (summary: {
    lines: { title: string; value: string; price: number }[]
    total: number
    deliveryHint: string
    duration: number
    durationTitle?: string
  }) => {
    setEstimatedSummary({
      ...summary,
      packageName: selected,
    });
  };

  const handleTabChange = (name: string) => {
    SetSelected(name);
    setEstimatedSummary(null);
    setMenuOpen(false);
  };

  // Close the mobile menu on outside tap / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <div
        className="pricing-hero-bg relative w-full min-h-dvh flex items-center justify-center flex-col gap-10 sm:gap-20 overflow-x-hidden pb-20 pt-40"
        style={{
          backgroundImage: "url('/aboutus.webp')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      >

        {/* پس‌زمینه محو */}
        <div className="absolute bg-[#003641] w-[372px] h-[262px] top-[97px] -left-[147px] blur-[300px] pointer-events-none z-[-1]" />

        {/* عنوان */}
        <div className="px-4 text-center ">
          <h2 className="leading-tight flex flex-col items-center justify-center gap-2">
            <span className="text-3xl sm:text-[40px] font-bold text-white">
              Flexible {' '}
              <span className="bg-linear-to-t from-[#42B6A7] to-[#41B6A7] bg-clip-text text-transparent">
                Pricing <br/>
              </span>{" "}
              for Every Creative Need
            </span>
            <br className="hidden sm:block" />
            <span className="font-light text-md sm:text-xl  text-white/90 sm:text-white mt-2 block sm:mt-0 sm:inline">
              From social content and motion graphics to branding, animation, and product videos, <br/>
              choose the solution that fits your goals, timeline, and budget.
            </span>
            <span className="font-bold relative top-10 text-md sm:text-xl  text-white/90 sm:text-white mt-2 block sm:mt-0 sm:inline">
              The pricing shown below is intended as a general estimate and starting point. <br/> Final
pricing may vary depending on project scope, complexity, timeline, and specific
requirements. <br/>
              <span className="font-light text-md sm:text-xl  text-white/90 sm:text-white mt-2 block sm:mt-0 sm:inline">
              For a tailored quote and project consultation, we recommend booking a call with our team. <br/>
We also offer special pricing and discounts for first-time clients on selected services.
            </span>
            </span>
          </h2>
        </div>



          {/* ===== Service selector: structured dropdown on mobile, pill list on desktop ===== */}
          <div ref={menuRef} className="w-full px-4 sm:px-6 md:hidden">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Select a service
            </p>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                menuOpen
                  ? "border-[#00A9BD] bg-linear-to-r from-[#065A69] via-[#093A47] to-[#0B1F2A] shadow-[0_0_15px_rgba(0,169,189,0.3)]"
                  : "border-[#00A9BD3D] bg-[#0B1F2A] hover:border-[#00A9BD80]"
              }`}
            >
              <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-white">
                {options.find((o) => o.name === selected)?.label ?? selected}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={`shrink-0 text-[#2bd6de] transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <ul
                  role="listbox"
                  aria-label="Services"
                  className="mt-2 space-y-1 rounded-2xl border border-[#00A9BD3D] bg-[#071e2b] p-2"
                >
                  {options.map((option) => {
                    const isActive = option.name === selected;
                    return (
                      <li key={option.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() => handleTabChange(option.name)}
                          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                            isActive
                              ? "bg-linear-to-r from-[#065A69] via-[#093A47] to-[#0B1F2A] text-white shadow-[0_0_15px_rgba(0,169,189,0.25)]"
                              : "text-white/70 hover:bg-white/[0.05] hover:text-white active:bg-white/[0.08]"
                          }`}
                        >
                          <span
                            className={`w-7 shrink-0 text-xs font-extrabold tabular-nums ${
                              isActive ? "text-[#2bd6de]" : "text-white/30"
                            }`}
                          >
                            {String(option.id).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1 leading-snug">{option.label}</span>
                          {isActive && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-[#2bd6de]">
                              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="hidden w-full px-4 sm:px-6 md:block">
            <div className="flex flex-wrap justify-center gap-3 py-2">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={option.name === selected}
                  onClick={() => handleTabChange(option.name)}
                  className={`text-white font-bold border cursor-pointer transition-colors rounded-full py-2 px-5 sm:px-6 h-12 text-sm sm:text-base text-center flex items-center justify-center shrink-0 whitespace-nowrap
                    ${
                      option.name === selected
                        ? "bg-linear-to-r from-[#065A69] via-[#093A47] to-[#0B1F2A] border-[#00A9BD] shadow-[0_0_15px_rgba(0,169,189,0.3)]"
                        : "bg-[#0B1F2A] border-[#00A9BD3D] hover:border-[#00A9BD80]"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
       

        {/* خط جداکننده (فقط در موبایل) */}
        <div className="w-full -mt-6 sm:-mt-10 h-[1px] relative bg-linear-to-r from-[#00222600] via-[#00A9BD50] to-[#00222600] md:hidden" />

        {/* محتوای انتخابی */}
        <div className="z-10 w-full px-4 sm:px-6 max-w-6xl mx-auto flex justify-center -mt-2 sm:-mt-8">
          {estimatedSummary ? (
            <SummaryPanel
              packageName={estimatedSummary.packageName}
              lines={estimatedSummary.lines}
              total={estimatedSummary.total}
              duration={estimatedSummary.duration}
              durationTitle={estimatedSummary.durationTitle}
              deliveryHint={estimatedSummary.deliveryHint}
              onEdit={() => setEstimatedSummary(null)}
            />
          ) : (
            <>
              {selected === "Product Trailers & Explainers" && (
              <ShortForm
                  packageName="Product Trailers & Explainers"
                  onEstimated={handleEstimated}
                  fields={[
                      {
                          title: "Base Price",
                          items: ["Product Trailer", "Product Explainer", "Product Demo", "Product Walkthrough", "Launch Package"],
                          prices: [650, 850, 800, 900, 1300]
                      },
                      {
                          title: "Video Length",
                          items: ["Under 30 sec", "30–60 sec", "60–90 sec", "90–120 sec", "2+ Minutes"],
                          prices: [0, 25, 75, 150, 300]
                      },
                      {
                          title: "Product Complexity",
                          items: ["Simple Product", "Medium Product", "Advanced Product", "Enterprise Product"],
                          prices: [0, 50, 150, 300]
                      },
                      {
                          title: "Animation Complexity",
                          items: ["Basic UI Animation", "Standard Motion Design", "Advanced Motion Design", "Premium Motion Design"],
                          prices: [0, 100, 250, 350]
                      },
                      {
                          title: "Script & Pre-Production",
                          items: ["Client Provides Script", "Script Review & Refinement", "Full Scriptwriting"],
                          prices: [0, 25, 100]
                      },
                      {
                          title: "Voiceover",
                          items: ["No Voiceover (Music & Sound Design Included)", "AI Voiceover", "Custom Voiceover"],
                          prices: [0, 50, 150]
                      },
                      {
                          title: "Asset Readiness",
                          items: ["Final UI Ready", "Minor UI Cleanup", "UI Recreation", "Full UI Design Required"],
                          prices: [0, 25, 100, 250]
                      },
                      {
                          title: "Delivery Speed",
                          items: ["Standard Timeline", "Priority Delivery", "Express Delivery"],
                          prices: [0, 10, 20],
                          unit: "percentage"
                      },
                      {
                          title: "Revision Rounds",
                          items: ["2 Rounds", "3 Rounds", "4 Rounds", "5 Rounds"],
                          prices: [0, 75, 150, 250]
                      },
                  ]}
            />
              )}
              {selected === "Social Media Animation Reels" && (
            <ShortForm
              packageName="Social Media Animation Reels"
              onEstimated={handleEstimated}
              fields={[
                { title: "Base Price", items: ["$160 Per Minute"], prices: [160], unit: "per_minute" },
                { title: "Animation Complexity", items: ["Basic Motion Graphics", "Standard Motion Design", "Advanced Motion Design", "Premium Motion Design"], prices: [0, 20, 45, 70], unit: "per_minute" },
                { title: "Visual Style", items: ["Simple Typography & Graphics", "Mixed Media Animation", "Custom Illustrations", "Custom Visual System"], prices: [0, 25, 55, 80], unit: "per_minute" },
                { title: "Assets Provided", items: ["All Assets Provided", "Minor Asset Creation", "Moderate Asset Creation", "Heavy Asset Creation"], prices: [0, 25, 75, 150], unit: "per_minute" },
                { title: "Voiceover", items: ["No Voiceover (Music & Sound Design Included)", "AI Voiceover", "Custom Voiceover"], prices: [0, 10, 30] },
                { title: "Script & Content", items: ["Client Provides Script", "Script Review & Refinement", "Full Scriptwriting"], prices: [0, 15, 30] },
                { title: "Delivery Speed", items: ["Standard", "Priority", "Express"], prices: [0, 10, 15], unit: "percentage" },
                { title: "Revision Rounds", items: ["2 Rounds", "3 Rounds", "4 Rounds", "5 Rounds"], prices: [0, 25, 35, 50] },
              ]}

            />
              )}
              {selected === "2D Animation" && (
            <ShortForm
              packageName="2D Animation"
              onEstimated={handleEstimated}
              fields={[
                { title: "Base Price", items: ["$180 Per Finished Minute"], prices: [180], unit: "per_minute" },
                { title: "Animation Complexity", items: ["Basic Motion Graphics", "Standard 2D Animation", "Advanced 2D Animation", "Premium 2D Animation"], prices: [0, 20, 50, 90], unit: "per_minute" },
                { title: "Illustrations", items: ["Client Assets Provided", "Minor Asset Creation", "Moderate Asset Creation", "Full Custom Illustrations"], prices: [0, 20, 50, 100], unit: "per_minute" },
                { title: "Character Animation", items: ["No Characters", "Basic Character Animation", "Standard Character Animation", "Advanced Character Animation"], prices: [0, 30, 60, 120], unit: "per_minute" },
                { title: "Voiceover", items: ["No Voiceover", "AI Voiceover", "Custom Voiceover"], prices: [0, 20, 50] },
                { title: "Script", items: ["Client Provides Script", "Script Review", "Full Scriptwriting"], prices: [0, 15, 40] },
                { title: "Delivery Speed", items: ["Standard", "Priority", "Express"], prices: [0, 10, 15], unit: "percentage" },
                { title: "Revision Rounds", items: ["2 Rounds", "3 Rounds", "4 Rounds", "5 Rounds"], prices: [0, 20, 35, 50] },
              ]}

            />
              )}
              {selected === "3D Animation" && (
            <ShortForm
              packageName="3D Animation"
              onEstimated={handleEstimated}
              fields={[
                { title: "Base Price", items: ["$350 Per Finished Minute"], prices: [350], unit: "per_minute" },
                { title: "3D Complexity", items: ["Basic 3D Animation", "Standard 3D Animation", "Advanced 3D Animation", "Premium 3D Animation"], prices: [0, 50, 100, 200], unit: "per_minute" },
                { title: "Modeling Requirements", items: ["Client Provides Models", "Minor Model Adjustments", "Custom Modeling", "Complex Product Modeling"], prices: [0, 30, 100, 200], unit: "per_minute" },
                { title: "Texturing & Materials", items: ["Basic Materials", "Enhanced Materials", "Premium Realistic Materials"], prices: [0, 30, 75], unit: "per_minute" },
                { title: "Environments & Scenes", items: ["Simple Scene", "Standard Environment", "Complex Environment"], prices: [0, 50, 150], unit: "per_minute" },
                { title: "Voiceover", items: ["No Voiceover", "AI Voiceover", "Custom Voiceover"], prices: [0, 20, 50] },
                { title: "Script", items: ["Client Provides Script", "Script Review", "Full Scriptwriting"], prices: [0, 15, 50] },
                { title: "Delivery Speed", items: ["Standard", "Priority", "Express"], prices: [0, 10, 20], unit: "percentage" },
                { title: "Revision Rounds", items: ["2 Rounds", "3 Rounds", "4 Rounds", "5 Rounds"], prices: [0, 30, 50, 75] },
              ]}

            />
              )}
              {selected === "Talking Head Editing" && (
            <ShortForm
              packageName="Talking Head Editing"
              onEstimated={handleEstimated}
              fields={[
                { title: "Base Price", items: ["$120 Per Minute"], prices: [120], unit: "per_minute" },
                { title: "Editing Style", items: ["Basic Editing", "Enhanced Editing", "Premium Editing"], prices: [0, 15, 35], unit: "per_minute" },
                { title: "Captions", items: ["No Captions", "Basic Captions", "Animated Captions", "Premium Dynamic Captions"], prices: [0, 5, 15, 30], unit: "per_minute" },
                { title: "B-Roll", items: ["Client Provides B-Roll", "Basic B-Roll Integration", "Advanced B-Roll Storytelling"], prices: [0, 10, 25], unit: "per_minute" },
                { title: "Motion Graphics", items: ["None", "Basic Graphics", "Standard Motion Graphics", "Advanced Motion Graphics"], prices: [0, 10, 25, 50], unit: "per_minute" },
                { title: "Source Footage", items: ["Single Camera", "Multi Camera", "Podcast / Multi Source"], prices: [0, 15, 30], unit: "per_minute" },
                { title: "Delivery Speed", items: ["Standard", "Priority", "Express"], prices: [0, 10, 20], unit: "percentage" },
                { title: "Revision Rounds", items: ["2 Rounds", "3 Rounds", "4 Rounds", "5 Rounds"], prices: [0, 20, 40, 75] },
              ]}

            />
              )}
              {selected === "Branding & Design" && (
            <PackageCards
              packages={[
                {
                  title: "Logo Design",
                  price: 500,
                  includes: [
                    "Logo Design",
                    "Color Palette",
                    "Typography Selection",
                    "Basic Brand Guidelines",
                    "2 Revision Rounds",
                  ],
                },
                {
                  title: "Brand Identity",
                  price: 1500,
                  includes: [
                    "Logo Design",
                    "Brand Identity System",
                    "Color System",
                    "Typography System",
                    "Brand Guidelines",
                    "Core Brand Assets",
                    "2 Revision Rounds",
                  ],
                },
                {
                  title: "Complete Brand System",
                  price: 3500,
                  includes: [
                    "Everything in Brand Identity",
                    "Social Media Kit",
                    "Brand Presentation",
                    "Marketing Assets",
                    "Extended Brand Applications",
                    "Complete Brand Ecosystem",
                    "2 Revision Rounds",
                  ],
                },
              ]}
            />
              )}
              {selected === "UI/UX Design" && (
            <PackageCards
              packages={[
                {
                  title: "Landing Page Design",
                  price: 750,
                  includes: [
                    "Research & Inspiration",
                    "Wireframes",
                    "High-Fidelity Design",
                    "Desktop & Mobile Versions",
                    "2 Revision Rounds",
                  ],
                },
                {
                  title: "Website Design",
                  price: 2000,
                  includes: [
                    "Up to 5 Pages",
                    "Wireframes",
                    "UI Design System",
                    "Responsive Design",
                    "Developer Handoff",
                    "2 Revision Rounds",
                  ],
                },
                {
                  title: "SaaS Product Design",
                  price: 3500,
                  includes: [
                    "Product Research",
                    "User Flows",
                    "Wireframes",
                    "UI Design System",
                    "Dashboard Design",
                    "Core Product Screens",
                    "Developer Handoff",
                    "2 Revision Rounds",
                  ],
                },
              ]}
            />
              )}
              {selected === "Monthly Content Packages" && (
            <ShortForm
              packageName="Monthly Content Packages"
              onEstimated={handleEstimated}
              fields={[
                { title: "Reel Type", items: ["Clean Edit & VFX", "Motion Graphic Reel", "Advanced Custom Animation"], prices: [120, 180, 240], unit: "per_quantity" },
                { title: "Number of Reels", items: ["1 Reel", "5 Reels", "10 Reels", "20 Reels", "30 Reels"], prices: [0, 0, 0, 0, 0], quantityValues: [1, 5, 10, 20, 30], discounts: [{ min: 30, percent: 25 }, { min: 20, percent: 15 }, { min: 10, percent: 10 }] },
                { title: "Stories", items: ["No Stories", "5 Stories", "10 Stories", "20 Stories", "30 Stories"], prices: [0, 40, 75, 140, 200] },
                { title: "Carousel Posts", items: ["None", "1 Carousel (Up To 5 Slides)", "1 Carousel (6–10 Slides)"], prices: [0, 40, 60] },
                { title: "Static Posts", items: ["None", "5 Static Posts", "10 Static Posts", "20 Static Posts"], prices: [0, 90, 170, 320] },
                { title: "Content Strategy", items: ["No Strategy", "Monthly Content Strategy"], prices: [0, 800] },
                { title: "Social Media Management", items: ["No Management", "Basic Management"], prices: [0, 600] },
                { title: "Growth Consulting", items: ["None", "Monthly Growth Consulting"], prices: [0, 1000] },
                { title: "Priority Delivery", items: ["Standard", "Priority", "Express"], prices: [0, 10, 20], unit: "percentage" },
                { title: "Additional Revisions", items: ["2 Rounds", "3 Rounds", "4 Rounds", "5 Rounds"], prices: [0, 100, 200, 300] },
              ]}
            />
              )}
              {selected === "CGI & Character Animation" && (
            <ShortForm
              packageName="CGI & Character Animation"
              onEstimated={handleEstimated}
              fields={[
                { title: "Project Type", items: ["CGI Product Animation", "Character Animation", "CGI Commercial"], prices: [500, 700, 900], unit: "per_minute" },
                { title: "Animation Complexity", items: ["Basic", "Standard", "Advanced", "Premium"], prices: [0, 100, 250, 500], unit: "per_minute" },
                { title: "3D Model Requirements", items: ["Client Provides Models", "Minor Model Adjustments", "Custom Modeling", "Complex Modeling"], prices: [0, 100, 300, 700] },
                { title: "Characters", items: ["No Characters", "Single Character", "Multiple Characters"], prices: [0, 200, 500] },
                { title: "Environments", items: ["Simple Environment", "Standard Environment", "Complex Environment"], prices: [0, 200, 500] },
                { title: "Voiceover", items: ["No Voiceover", "AI Voiceover", "Professional Voiceover"], prices: [0, 50, 150] },
                { title: "Script", items: ["Client Provides Script", "Script Review", "Full Scriptwriting"], prices: [0, 50, 150] },
                { title: "Delivery Speed", items: ["Standard", "Priority", "Express"], prices: [0, 10, 20], unit: "percentage" },
                { title: "Revision Rounds", items: ["2 Rounds", "3 Rounds", "4 Rounds", "5 Rounds"], prices: [0, 100, 200, 300] },
              ]}

            />
              )}
            </>
          )}
        </div>
      </div>

      {/* استایل برای موبایل */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .pricing-hero-bg {
            background-image: none !important;
            -webkit-mask-image: none;
            mask-image: none;
          }
        }
      `}} />
    </>
  );
};
