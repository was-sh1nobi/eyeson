
import BusinessNeedsSection from "../Shared/BusinessNeedsSection.tsx";

export const VideoNeedsBlock = () => {
    return(
        <BusinessNeedsSection
            label="WHY VIDEO EDITING MATTERS"
            beforeHighlight="Why Modern Brands Need"
            highlight="Better Video Editing"
            afterHighlight=""
            body="In today’s content environment, raw footage alone is not enough. Strong editing helps
brands communicate faster, hold attention longer, and make content feel more
professional across social media, websites, ads, and product launches.
Good editing improves clarity, pacing, storytelling, and viewer experience, helping every
piece of content work harder instead of getting ignored."

            mainTitle="Turn Attention Into Action"
            mainBody="Professional editing helps your audience understand your message faster, trust your brand
more, and stay engaged longer. Better pacing, structure, visuals, and storytelling make
content feel easier to watch and more effective across modern platforms."
            primaryBtnText="Get a Free Sample"
            secondaryBtnText="See Our Work"

            cards={[
                {
                    id: 1,
                    title: "Build a Stronger Brand Identity",
                    description:
                        "Consistent editing style, motion, pacing, captions, and visuals help your content feel more\n" +
                        "recognizable, polished, and aligned across every platform.",
                    image: "/Shared/Features/left.webp",                },
                {
                    id: 2,
                    title: "Stand Out in Crowded Feeds",
                    description:
                        "Clean structure, stronger hooks, better pacing, and sharper storytelling help your content\n" +
                        "separate itself from low-quality or forgettable posts online.",
                    image: "/Shared/Features/middle.webp",                },
                {
                    id: 3,
                    title: "Create Reusable Content Assets",
                    description:
                        "Strong edits can be repurposed across Reels, Shorts, YouTube, ads, landing pages,\n" +
                        "podcasts, and campaigns, giving your brand more value from every piece of footage.",
                    image: "/Shared/Features/right.webp",                },
            ]}

        />
    )
}