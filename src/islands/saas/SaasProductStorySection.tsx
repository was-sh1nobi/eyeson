const categories = [
  "AI & Automation",
  "B2B SaaS",
  "Fintech",
  "Developer Tools",
  "Productivity Software",
  "Marketplaces",
  "Mobile Apps",
  "Cybersecurity",
  "Data Platforms",
  "Sales Software",
  "Marketing Technology",
  "HR & Recruiting",
  "Ecommerce Software",
  "Web3 Platforms",
  "Enterprise Software",
  "Consumer Apps",
];

export default function SaasProductStorySection() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2d3dc]">
            NO GENERIC SAAS VIDEOS
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Every Product Has
            <br />
            <span className="text-[#17d6d4]">a Different Story</span>
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-7 text-[#c4d6df] md:text-base">
            <p>
              An AI agent should not be presented like a fintech dashboard. A developer tool should
              not be marketed like a consumer app. And a complex B2B platform should not be explained
              the same way as a simple productivity product.
            </p>
            <p>
              That is why we do not force every client into the same visual formula. We build the
              concept, pacing, visual language, UI presentation, messaging, and storytelling around
              your specific product and audience.
            </p>
            <p>
              Your video should feel like an extension of your software—not another agency template.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 pb-20 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Built for Modern
            <br />
            <span className="text-[#17d6d4]">Software Companies</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-[#c6d8e2] md:text-base">
            We work across the products shaping the next generation of software and digital
            experiences.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#d5e3e8]"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
