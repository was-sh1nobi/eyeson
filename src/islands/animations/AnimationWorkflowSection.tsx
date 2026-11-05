"use client";
import { ClipboardList, Boxes, Film, Zap, type LucideIcon } from "lucide-react";
import {useState} from "react";

type WorkflowItem = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const workflowItems: WorkflowItem[] = [
  {
    id: 1,
    title: "Concept & Creative Planning",
    description:
      "We begin by understanding your brand, goals, audience, and message to define the visual\n" +
        "direction, storytelling approach, animation style, and overall creative vision behind the\n" +
        "project.",
    icon: ClipboardList,
  },
  {
    id: 2,
    title: "Design, Modeling & Visual Systems",
    description:
      "Scenes, assets, environments, motion systems, and visual elements are developed with a\n" +
        "consistent design language to create a more premium and unified final result.",
    icon: Boxes,
  },
  {
    id: 3,
    title: "Animation & Motion Development",
    description:
      "Motion, transitions, camera movement, timing, and scene interactions are carefully\n" +
        "animated to create smoother storytelling, stronger pacing, and more engaging visual flow.",
    icon: Film,
  },
  {
    id: 4,
    title: "Lighting, Polish & Final Compositing",
    description:
      "Lighting, textures, sound integration, visual polish, color work, and compositing are refined\n" +
        "in the final stage to deliver cinematic-quality animations optimized for websites, ads,\n" +
        "social media, SaaS products, and modern campaigns.",
    icon: Zap,
  },
];

export default function AnimationWorkflowSection() {
  const [openId, setOpenId] = useState<number>(1);

  return (
    // حذف بک‌گراند کلی از سکشن، فقط استایل پدینگ و فونت
    <section className="relative w-full overflow-hidden px-4 pt-4 pb-16 sm:px-8 md:pt-8 md:pb-24 lg:px-16 font-sans">
      {/* گرید دو ستونه */}
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-start">
        {/* === ستون چپ: متن و عکس === */}
        <div className="flex flex-col text-left lg:sticky lg:top-24 max-sm:text-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#00aabf] mb-4">
            OUR WORKFLOW
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold leading-[1.15] text-white mb-6 ">
            A Structured <br />
            <span className="text-[#55D2B9]">2D & 3D Animation</span>
            <br />
            Production Workflow
          </h2>
          <p className="text-[13px] sm:text-sm leading-[1.8] text-white/60">
            Strong animation requires more than visuals alone. Behind every polished scene is a
            production system built around planning, creative direction, motion design, and attention
            to detail. Our workflow is designed to keep projects efficient, visually consistent, and
            aligned with modern digital platforms from concept to final delivery.
          </p>

          {/* عکس دسکتاپ (بدون بک‌گراند باکس، مستقیما عکس) */}
          <div className="mt-8 md:mt-12 w-full max-w-100 mx-auto sm:mx-0">
            <img
              src="/preview.webp" // همون عکس 3D که توی دیزاینت هست رو اینجا لود کن
              alt="Workflow 3D visual"
              width={609}
              height={410}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* === ستون راست: باکس اصلی حاوی لیست آکاردئون === */}
        <div className="relative w-full rounded-3xl border border-white/10 bg-linear-to-br from-[#0b1f2a]/80 to-[#020915]/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors duration-300 overflow-hidden">
          {/* خط دکوری فیروزه‌ای سمت چپ کانتینر */}
          <div className="absolute left-0 top-16 bottom-16 w-[3px] bg-[#00aabf]/80 rounded-r-md hidden sm:block shadow-[0_0_15px_#00aabf]" />

          <div className="flex flex-col">
            {workflowItems.map((item, index) => {
              const Icon = item.icon;
              const isOpen = openId === item.id;
              // خط جداکننده بین آیتم‌ها (بجز آخری)
              const isLast = index === workflowItems.length - 1;

              return (
                <article
                  key={item.id}
                  className={`w-full transition-colors duration-300 ${
                    !isLast ? "border-b border-white/5" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? 0 : item.id)}
                    className="flex w-full cursor-pointer items-center gap-5 px-6 py-6 text-left transition-colors duration-300 hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00aabf] group sm:px-10 sm:py-7"
                  >
                    {/* باکس آیکون */}
                    <div className="relative shrink-0">
                      {/* افکت نوری دور آیکون */}
                      <div className="absolute inset-0 bg-[#00aabf] blur-md opacity-20 rounded-xl" />
                      <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-[#000E17] to-[#143C3E] border border-[#1ed7d8]/60 text-[#1ed7d8] shadow-[0_0_10px_#00A9BD80] transition-[transform,border-color,color,box-shadow] duration-300 group-hover:scale-105 group-hover:border-[#1ed7d8] group-hover:shadow-[0_0_20px_rgba(0,169,189,0.5)]">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* تایتل */}
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-[#55d2b9]">
                      {item.title}
                    </h3>
                  </button>

                  {/* محتوای توضیحات آکاردئون */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 pb-8"
                        : "grid-rows-[0fr] opacity-0 pb-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 sm:px-10 text-[14px] sm:text-[15px] leading-relaxed text-white/70 max-w-[90%]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
