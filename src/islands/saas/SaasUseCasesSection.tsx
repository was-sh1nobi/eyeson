const useCases = [
  {
    id: 1,
    title: "Website Hero Videos",
    description:
      "Give visitors an immediate understanding of your product directly from the first section of your website with a short, visually powerful product overview.",
  },
  {
    id: 2,
    title: "Product Launches",
    description:
      "Build excitement around your product, major feature release, redesign, or announcement with launch content designed to make the moment feel important.",
  },
  {
    id: 3,
    title: "Paid Advertising",
    description:
      "Turn your product story into shorter campaign-ready videos for Meta, LinkedIn, YouTube, X, TikTok, and other paid acquisition channels.",
  },
  {
    id: 4,
    title: "Sales & Outreach",
    description:
      "Give prospects a fast way to understand your product before calls, inside cold outreach, sales presentations, proposals, or follow-up sequences.",
  },
  {
    id: 5,
    title: "Social Content",
    description:
      "Transform product features and workflows into polished short-form videos for LinkedIn, X, Instagram, YouTube, and other social platforms.",
  },
  {
    id: 6,
    title: "Investor Presentations",
    description:
      "Help investors quickly understand your product, market position, user experience, and vision with a visual presentation of what you are building.",
  },
];

export default function SaasUseCasesSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            One Video.
            <br />
            <span className="text-[#17d6d4]">Multiple Growth Channels.</span>
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#c6d8e2] md:text-base">
            A strong SaaS video should not live in one place. We create assets that can support your
            product across marketing, sales, launches, fundraising, and growth.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-[#13a8b8]/50 bg-[linear-gradient(160deg,#071c2e,#0a2433)] p-6 transition-colors hover:border-[#23d8dc]"
            >
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#c0d3df]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
