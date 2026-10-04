import BusinessNeedsSection from "../Shared/BusinessNeedsSection.tsx";

export const RetainerNeedsBlock = () => {
  return (
    <BusinessNeedsSection
      label="WHY A RETAINER WORKS"
      beforeHighlight="Stop Starting"
      highlight="From Zero Every Month."
      afterHighlight=""
      body="Without an ongoing creative system, every new piece of content creates another production cycle. Find someone. Explain the brand. Send references. Negotiate scope. Wait for availability. Review the work. Then repeat everything next week."
      mainTitle="A Retainer Changes the Relationship"
      mainBody="We learn your brand once, establish the workflow, build your visual language, and become faster as the partnership develops. Your ideas move faster. Your brand becomes more consistent. Your content pipeline becomes predictable."
      primaryBtnText="Start Your Retainer"
      secondaryBtnText="Explore Our Work"
      cards={[
        {
          id: 1,
          title: "Faster Production",
          description:
            "We already understand your brand, product, audience, references, and preferences—so less time is wasted onboarding every project.",
          image: "/Shared/Features/left.webp",
        },
        {
          id: 2,
          title: "Consistent Quality",
          description:
            "Your content maintains the same visual language and production standard across campaigns and platforms.",
          image: "/Shared/Features/middle.webp",
        },
        {
          id: 3,
          title: "Better Over Time",
          description:
            "Every project teaches us more about your brand, audience, and what performs—making future production more efficient.",
          image: "/Shared/Features/right.webp",
        },
      ]}
    />
  );
};
