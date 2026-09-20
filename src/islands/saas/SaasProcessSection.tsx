const processSteps = [
  {
    step: "01",
    title: "Product Discovery",
    description:
      "We study your SaaS, audience, positioning, features, competitors, brand direction, references, and the specific goal of the video.",
    deliverable: "Creative brief",
  },
  {
    step: "02",
    title: "Concept & Script",
    description:
      "We define the core narrative, decide what matters most, and write a script that communicates your product clearly without overwhelming the viewer.",
    deliverable: "Final script",
  },
  {
    step: "03",
    title: "Storyboard & Direction",
    description:
      "We map the video scene by scene, defining how UI screens, typography, graphics, transitions, product moments, and key messages will appear.",
    deliverable: "Visual storyboard",
  },
  {
    step: "04",
    title: "UI & Asset Preparation",
    description:
      "We organize and prepare your product screens, brand assets, interface elements, screenshots, graphics, and other visual material required for animation.",
    deliverable: "Production-ready assets",
  },
  {
    step: "05",
    title: "Motion Production",
    description:
      "We bring everything to life with UI animation, motion graphics, typography, transitions, sound design, visual effects, and carefully controlled pacing.",
    deliverable: "First video draft",
  },
  {
    step: "06",
    title: "Refinement & Delivery",
    description:
      "We polish timing, readability, animation, transitions, sound, messaging, and visual details before exporting the final video for your required platforms and formats.",
    deliverable: "Ready-to-launch video",
  },
];

export default function SaasProcessSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2d3dc]">
            OUR PROCESS
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Our Approach to
            <br />
            <span className="text-[#17d6d4]">SaaS Video Production</span>
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#c6d8e2] md:text-base">
            We handle the entire process from understanding your product to delivering the final
            video, with every stage built around clarity, storytelling, and premium execution.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((item) => (
            <article
              key={item.step}
              className="rounded-3xl border border-[#13a8b8]/50 bg-[linear-gradient(160deg,#071c2e,#0a2433)] p-6"
            >
              <span className="text-sm font-bold text-[#35e4d8]">{item.step}</span>
              <h3 className="mt-3 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#c0d3df]">{item.description}</p>
              <div className="mt-5 rounded-2xl bg-white/5 p-3">
                <p className="text-xs font-semibold uppercase text-white">Deliverable</p>
                <p className="mt-1 text-sm text-[#c4d6df]">{item.deliverable}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
