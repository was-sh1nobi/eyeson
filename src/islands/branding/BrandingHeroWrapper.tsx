import {HeroBasic} from "../Shared/HeroBasic.tsx";
import BrandingHeroCard from "./BrandingHeroCard.tsx";
import {VideoHeader} from "@/islands/Shared/VideoHeader.tsx";



export const BrandingHeroWrapper = () => {
    return (
        <>


            <VideoHeader

                BeforeHighlight=""
                Highlight="Branding & Visual"
                AfterHighlight=" Identity for Brands"
                Description="Build a brand people recognize, remember, and trust.
From logos and visual systems to complete brand identities, we create distinctive brands
that communicate clearly, stand out in competitive markets, and remain consistent across
every touchpoint."

                imageUrl="/Branding/21.svg"
                topText="MONTHLY CONTENT · CREATIVE RETAINERS · ONGOING PRODUCTION"

                primaryBtnText="View Our Work"
                primaryBtnUrl="/portfolio"
                secondaryBtnText="Get Pricing"
                secondaryBtnUrl="/pricing"

                showBackground={true}
                backgroundClassName="
    bg-[linear-gradient(to_bottom,#010e17_0%,#01343a_35%,#34776c_65%,rgba(52,119,108,0.6)_80%,rgba(52,119,108,0.25)_90%,transparent_100%)]
    "

                headingClassName="text-3xl sm:text-3xl lg:text-4xl font-extrabold"
                highlightClassName="text-[#39d0c3]"

                textContainerClassName="space-y-5"

                primaryBtnWrapperClassName="bg-gradient-to-r from-[#0fe0d2] to-[#08717e] p-[2px] rounded-full"
                primaryBtnClassName="bg-gradient-to-r from-[#00A9BD] to-[#1D553A] text-white px-6 py-3"

                secondaryBtnWrapperClassName="bg-gradient-to-r from-[#08717e] to-[#40ae90] p-[2px] rounded-full"
                secondaryBtnClassName="bg-gradient-to-r from-[#00061D] to-[#0B1F2A] text-white px-6 py-3"

                imageWrapperClassName="rounded-3xl overflow-hidden w-100 md:w-120 scale-[1.1] lg:scale-[1.5]"

            />



        </>)
}