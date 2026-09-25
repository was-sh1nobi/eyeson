import { SmartImage } from "../../utils/SmartImage.tsx";

export const ServicesSection = () => {
  const cardBg = "bg-[#091D24]/80";
  const cardBorder = "border border-[#14343B]";
  const tagBg = "bg-transparent border border-[#234F58]";

  return (
    <section className="relative w-full py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-16 overflow-hidden font-sans">
      {/* ===== هدر ===== */}
      <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12 lg:mb-16 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-2 leading-tight sm:text-3xl md:text-4xl lg:text-[44px]">
          Complete <span className="text-[#42D1D1]">Branding</span>
        </h2>
        <h2 className="text-2xl font-bold text-white mb-4 leading-tight sm:text-3xl md:text-4xl lg:text-[44px] lg:mb-6">
          & Visual Identity Services
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto md:text-base">
          Build a distinctive, scalable brand identity that stays consistent across every touchpoint.
        </p>
      </div>

      {/* ===== گرید اصلی ===== */}
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 animate-slide-up"
      >
        {/* ===== کارت بزرگ چپ ===== */}
        <div
          className={`lg:col-span-5 rounded-3xl ${cardBg} ${cardBorder} p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-colors duration-200 hover:border-[#42D1D1]/40`}
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-3 sm:text-2xl sm:mb-4">
              Brand Strategy & Positioning
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 font-light sm:mb-6">
              Define your brand's purpose, audience, positioning, and visual direction.
</p>

<p className="text-white font-medium mb-2 text-sm sm:mb-3">
Includes:
</p>
<div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
{["Brand Discovery", "Positioning", "Brand Messaging"].map(
(tag) => (
<span
key={tag}
className={`px-3 py-1 rounded-full text-xs text-gray-300 ${tagBg}`}
>
{tag}
</span>
),
)}
</div>
</div>

<div className="relative w-full aspect-video rounded-xl overflow-hidden mt-auto bg-[#041217] sm:aspect-4/3">
<SmartImage
src="/Branding/transform.webp"
alt="Transform your brand"
fill
className="object-cover"
/>
</div>
</div>

{/* ===== ۴ کارت راست ===== */}
<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
{/* کارت ۱ */}
<div
className={`rounded-3xl ${cardBg} ${cardBorder} p-5 sm:p-6 shadow-lg transition-colors duration-200 hover:border-[#42D1D1]/40`}
>
<div className="flex items-center gap-3 mb-3 sm:gap-4 sm:mb-4">
<div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-b from-[#14343B] to-transparent border border-[#234F58] flex items-center justify-center shadow-inner sm:w-12 sm:h-12">
<svg
className="w-5 h-5 text-[#42D1D1] sm:w-6 sm:h-6"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
/>
</svg>
</div>
<h3 className="text-base font-bold text-white sm:text-lg">
Brand Identity Design
</h3>
</div>
<p className="text-gray-400 text-xs leading-relaxed mb-4 font-light sm:text-sm">
Logo, colors, typography, and visual assets designed into a complete brand system.
</p>
<div className="flex flex-wrap gap-1.5 sm:gap-2">
{["Logo Design", "Color Palette", "Typography"].map((tag) => (
<span
key={tag}
className={`px-2.5 py-0.5 rounded-full text-xs text-gray-300 ${tagBg}`}
>
{tag}
</span>
))}
</div>
</div>

{/* کارت ۲ */}
<div
className={`rounded-3xl ${cardBg} ${cardBorder} p-5 sm:p-6 shadow-lg transition-colors duration-200 hover:border-[#42D1D1]/40`}
>
<div className="flex items-center gap-3 mb-3 sm:gap-4 sm:mb-4">
<div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-b from-[#14343B] to-transparent border border-[#234F58] flex items-center justify-center shadow-inner sm:w-12 sm:h-12">
<svg
className="w-5 h-5 text-[#42D1D1] sm:w-6 sm:h-6"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
/>
</svg>
</div>
<h3 className="text-base font-bold text-white sm:text-lg">
Brand Guidelines & Systems
</h3>
</div>
<p className="text-gray-400 text-xs leading-relaxed mb-4 font-light sm:text-sm">
Clear rules and documentation to keep your brand consistent everywhere.
</p>
<div className="flex flex-wrap gap-1.5 sm:gap-2">
{["Brand Guidelines", "Design Systems", "Asset Libraries"].map(
(tag) => (
<span
key={tag}
className={`px-2.5 py-0.5 rounded-full text-xs text-gray-300 ${tagBg}`}
>
{tag}
</span>
),
)}
</div>
</div>

{/* کارت ۳ */}
<div
className={`rounded-3xl ${cardBg} ${cardBorder} p-5 sm:p-6 shadow-lg transition-colors duration-200 hover:border-[#42D1D1]/40`}
>
<div className="flex items-center gap-3 mb-3 sm:gap-4 sm:mb-4">
<div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-b from-[#14343B] to-transparent border border-[#234F58] flex items-center justify-center shadow-inner sm:w-12 sm:h-12">
<svg
className="w-5 h-5 text-[#42D1D1] sm:w-6 sm:h-6"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
/>
</svg>
</div>
<h3 className="text-base font-bold text-white sm:text-lg">
Motion & Digital Brand Assets
</h3>
</div>
<p className="text-gray-400 text-xs leading-relaxed mb-4 font-light sm:text-sm">
Logo animations, video assets, social templates, and marketing graphics.
</p>
<div className="flex flex-wrap gap-1.5 sm:gap-2">
{[
"Logo Animation",
"Social Media Assets",
"Marketing Graphics",
].map((tag) => (
<span
key={tag}
className={`px-2.5 py-0.5 rounded-full text-xs text-gray-300 ${tagBg}`}
>
{tag}
</span>
))}
</div>
</div>

{/* کارت ۴ */}
<div
className={`rounded-3xl ${cardBg} ${cardBorder} p-5 sm:p-6 shadow-lg transition-colors duration-200 hover:border-[#42D1D1]/40`}
>
<div className="flex items-center gap-3 mb-3 sm:gap-4 sm:mb-4">
<div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-b from-[#14343B] to-transparent border border-[#234F58] flex items-center justify-center shadow-inner sm:w-12 sm:h-12">
<svg
className="w-5 h-5 text-[#42D1D1] sm:w-6 sm:h-6"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
/>
</svg>
</div>
<h3 className="text-base font-bold text-white sm:text-lg">
Rebranding & Brand Refresh
</h3>
</div>
<p className="text-gray-400 text-xs leading-relaxed mb-4 font-light sm:text-sm">
Modernize existing brands while preserving brand equity and recognition.
</p>
<div className="flex flex-wrap gap-1.5 sm:gap-2">
{[
"Brand Audit",
"Visual Modernization",
"Transition Strategy",
].map((tag) => (
<span
key={tag}
className={`px-2.5 py-0.5 rounded-full text-xs text-gray-300 ${tagBg}`}
>
{tag}
</span>
))}
</div>
</div>
</div>
</div>
</section>
);
};
