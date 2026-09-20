
import BusinessNeedsSection from "../Shared/BusinessNeedsSection.tsx";

export const SaasNeedsBlock = () => {
    return(
        <BusinessNeedsSection
            label="WHY PRODUCT VIDEO MATTERS"
            beforeHighlight="Why SaaS Product"
            highlight="Videos Matter"
            afterHighlight=""
            body="People rarely spend minutes figuring out your software. Your video can make the value clear in seconds."

            mainTitle="Your Product May Be Powerful. But Can People Understand It Fast?"
            mainBody="Software often becomes difficult to market because too much information is presented at once. Features, dashboards, workflows, integrations, automation, AI capabilities, and technical advantages can quickly overwhelm a new visitor. A strong SaaS trailer simplifies that complexity. We show the problem, introduce the product, demonstrate what makes it valuable, and guide the viewer through the experience without forcing them to read an entire website. The result is a product that feels easier to understand, easier to trust, and easier to buy."
            primaryBtnText="Start Your Video"
            secondaryBtnText="See Our Work"
            cards={[
                {
                    id: 1,
                    title: "Explain Your Product Faster",
                    description:
                        "Instead of asking visitors to study pages of copy and screenshots, give them a clear visual overview of your product, workflow, and key advantages within seconds.",
                    image: "/Shared/Features/left.webp",                },
                {
                    id: 2,
                    title: "Make Your SaaS Feel Premium",
                    description:
                        "Strong motion design changes how software is perceived. Clean UI animation, cinematic pacing, sound design, and visual storytelling can make your product feel more established, polished, and valuable.",
                    image: "/Shared/Features/middle.webp",                },
                {
                    id: 3,
                    title: "Increase Product Understanding",
                    description:
                        "When viewers understand the problem, solution, workflow, and outcome clearly, it becomes easier for them to see how your software fits into their business or life.",
                    image: "/Shared/Features/right.webp",                },
            ]}

        />
    )
}
