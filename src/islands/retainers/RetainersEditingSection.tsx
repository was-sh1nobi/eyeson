import { SmartImage } from "../../utils/SmartImage.tsx";
import PrimaryButton from "@/components/Shared/PrimaryButton.tsx";

export default function RetainersEditingSection() {
    return (
        <section
            className="relative flex w-full flex-col items-center justify-center gap-8 px-6 py-12 lg:flex-row lg:items-center lg:gap-16 lg:px-20 lg:py-24 animate-fade-in"
        >
            <p className="text-[11px] sm:text-sm tracking-widest text-white/60 font-semibold uppercase text-center w-full lg:absolute lg:top-8 lg:left-1/2 lg:-translate-x-1/2">
                CREATIVE PRODUCTION THAT DOESN’T STOP
            </p>
            <div
                className="relative order-2 w-full max-w-[640px] cursor-pointer overflow-hidden rounded-2xl shadow-lg lg:order-1 lg:w-1/2 transition-transform duration-300 hover:scale-[1.02]"
                style={{ aspectRatio: "1250 / 841" }}
            >
                <SmartImage
                    src="/video-pieces/under-hero.svg"
                    alt="Creative retainer"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <div className="relative order-1 flex w-full max-w-full flex-col items-center gap-6 pt-0 text-center md:max-w-none md:text-left lg:order-2 lg:w-1/2 lg:pt-8 animate-slide-up">
                <h2 className="text-[30px] font-bold leading-[1.15] text-white md:text-3xl md:leading-tight lg:text-6xl text-center">
                    Your Brand Needs More Than <span className="text-[#0fe0d2]">One Great Video.</span>
                </h2>
                <p className="text-lg leading-8 text-gray-200 md:text-xl md:leading-relaxed text-center">
                    One launch video is valuable.
                    But modern brands need content constantly.
                    New campaigns. Product updates. Social posts. Ads. Feature launches. Sales assets.
                    Announcements. Reels. Motion graphics. New ideas every week. Our monthly retainers give you an ongoing creative team that already understands your
                    brand, product, audience, and visual language.
                    Instead of starting from zero every time you need something created, we build a production
                    system around your business and keep it moving.
                </p>

                <PrimaryButton
                    text="Build Your Content System"
                    href="/portfolio"
                    width="19rem"
                    height="50px"
                />
            </div>
        </section>
    );
}
