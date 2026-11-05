import {
  BadgeCheck,
  Wand2,
  Coins,
  ScanEye,
  FolderSearch,
  type LucideIcon,
} from "lucide-react";

const rows = [
  {
    variable: "Best for",
    twoD: "Explainers, educational content, ads, social media campaigns, SaaS storytelling, and\n" +
        "clean brand communication",
    threeD: "Product showcases, launch campaigns, premium visuals, realistic demonstrations,\n" +
        "cinematic branding, and immersive digital experiences",
  },
  {
    variable: "Visual style",
    twoD: "Clean, illustrated, stylized, and graphic-driven visuals with strong flexibility for branding\n" +
        "and storytelling",
    threeD: "Realistic depth, lighting, textures, cinematic motion, and more immersive visual\n" +
        "presentation",
  },
  {
    variable: "Production & Cost",
    twoD: "Faster production workflow and generally more cost-efficient for ongoing content and\n" +
        "marketing campaigns",
    threeD: "Higher production complexity with more advanced rendering, modeling, lighting, and\n" +
        "animation workflows",
  },
  {
    variable: "Brand Feel",
    twoD: "Modern, clean, creative, and visually consistent across digital platforms",
    threeD: "Premium, cinematic, high-end, and visually impressive with stronger realism and depth",
  },
  {
    variable: "Common Use Cases",
    twoD: "Explainer videos, motion graphics, social media content, UI animations, ads, and educational visuals",
    threeD: "Product launches, product renders, hero visuals, tech demos, cinematic ads, and high-end\n" +
        "promotional campaigns",
  },
];

const icons: LucideIcon[] = [BadgeCheck, Wand2, Coins, ScanEye, FolderSearch];

export default function AnimationStyleComparisonSection() {
  return (
    <section className="relative w-full overflow-hidden px-4 pb-20 pt-10 sm:px-6 md:pb-24 md:pt-12 lg:px-16 font-sans">
      <div className="mx-auto max-w-6xl">
        
        {/* === Header === */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/60 sm:text-xs">
            STYLE COMPARISON
          </p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white sm:mt-3 md:text-4xl lg:text-5xl">
            <span className="text-cyan-300">2D vs 3D Animation</span>
            <br />
            Which One Fits Your Brand Best?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-relaxed text-white/65 sm:mt-5 sm:text-sm md:text-base md:leading-7">
            Both 2D and 3D animation are powerful creative tools, but they solve different problems.
            The right choice depends on your goals, visual style, message, audience, production
            scope, and overall brand positioning.
            This comparison helps you quickly understand which animation style better fits your
            content, product, and marketing needs.
          </p>
        </div>

        {/* === Table Container === */}
        <div className="mt-8 overflow-hidden sm:mt-10 rounded-3xl border border-white/10 bg-linear-to-b from-[#0b1f2a]/80 to-[#020915]/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md">
          {/* 
            اینجا min-w رو برداشتیم تا توی موبایل اسکرول افقی نخوره.
            از table-fixed استفاده کردیم که ستون‌ها متناسب تقسیم بشن.
          */}
          <table className="w-full table-fixed border-collapse text-left">
            
            {/* === Table Head === */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white">
                <th className="w-[28%] px-2 py-3 text-[11px] font-semibold tracking-wide sm:w-[30%] sm:px-4 sm:py-4 sm:text-lg md:px-6 md:text-2xl">
                  Variables
                </th>
                <th className="w-[36%] px-2 py-3 text-[11px] font-semibold tracking-wide border-l border-white/10 sm:w-[35%] sm:px-4 sm:py-4 sm:text-lg md:px-6 md:text-2xl">
                  2D animation
                </th>
                <th className="w-[36%] px-2 py-3 text-[11px] font-semibold tracking-wide border-l border-white/10 sm:w-[35%] sm:px-4 sm:py-4 sm:text-lg md:px-6 md:text-2xl">
                  3D animation
                </th>
              </tr>
            </thead>

            {/* === Table Body === */}
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.variable}
                  className={index % 2 === 0 ? "bg-white/[0.03]" : "bg-white/[0.06]"}
                >
                  
                  {/* Column 1: Variables */}
                  <td className="border-t border-white/10 px-2 py-3 align-top sm:px-4 sm:py-4 md:px-6 md:py-5">
                    <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border border-[#1ed7d8]/60 bg-linear-to-br from-[#000E17] to-[#143C3E] text-[#1ed7d8] shadow-[0_0_10px_#00A9BD80] sm:h-8 sm:w-8 md:h-10 md:w-10">
                        {(() => {
                          const Icon = icons[index];
                          return (
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                          );
                        })()}
                      </span>
                      <span className="text-[11px] font-bold text-white sm:text-sm md:text-lg lg:text-xl">
                        {row.variable}
                      </span>
                    </div>
                  </td>

                  {/* Column 2: 2D Animation */}
                  <td className="border-t border-l border-white/10 px-2 py-3 align-top text-[10px] leading-relaxed text-white/85 sm:px-4 sm:py-4 sm:text-sm sm:leading-6 md:px-6 md:py-5 md:text-base md:leading-7 lg:text-lg lg:leading-8">
                    {row.twoD}
                  </td>

                  {/* Column 3: 3D Animation */}
                  <td className="border-t border-l border-white/10 px-2 py-3 align-top text-[10px] leading-relaxed text-white/85 sm:px-4 sm:py-4 sm:text-sm sm:leading-6 md:px-6 md:py-5 md:text-base md:leading-7 lg:text-lg lg:leading-8">
                    {row.threeD}
                  </td>

                </tr>
              ))}
            </tbody>
            
          </table>
        </div>

      </div>
    </section>
  );
}