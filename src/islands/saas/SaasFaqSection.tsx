import PrimaryButton from "@/components/Shared/PrimaryButton";

const faqs = [
  {
    question: "What is the difference between a SaaS trailer and a product explainer?",
    answer:
      "A SaaS trailer is usually shorter, faster, and more cinematic. Its main goal is to create excitement, communicate the core value quickly, and make the product feel premium. A product explainer goes deeper into the problem, solution, features, workflow, and benefits, giving viewers a clearer understanding of how the software works.",
  },
  {
    question: "How long should my SaaS video be?",
    answer:
      "It depends on the goal. Most SaaS trailers work best between 30–60 seconds, while product explainers are typically around 60–90 seconds. Product demos or more detailed walkthroughs can be longer when the product requires additional explanation. We help determine the right length based on your audience, platform, and message.",
  },
  {
    question: "Do you help with the script and concept?",
    answer:
      "Yes. We can handle the entire creative process from the initial concept to the final video. We study your product, audience, positioning, features, and goals before developing the core idea, structure, messaging, script, and visual direction.",
  },
  {
    question: "What do you need from us to get started?",
    answer:
      "Usually, we need access to your website or product, brand guidelines if available, logo files, UI designs or screenshots, key features, target audience, and any visual references you like. If you do not have everything prepared, we can still guide the project and identify exactly what is needed during the discovery stage.",
  },
  {
    question: "Can you animate our actual product UI?",
    answer:
      "Yes. UI animation is one of the core parts of our SaaS video production. We can animate dashboards, mobile apps, websites, product screens, workflows, interactions, charts, notifications, menus, and other interface elements to make the product feel smooth, intuitive, and premium.",
  },
  {
    question: "Can you create the video if our product is not fully launched yet?",
    answer:
      "Yes. We can work with Figma designs, prototypes, screenshots, mockups, early product builds, and design files to create a polished product video before the final software is publicly available. This is especially useful for launches, fundraising, waitlists, and pre-release campaigns.",
  },
  {
    question: "Do you provide voiceover and sound design?",
    answer:
      "Yes. Depending on the project, we can include professional AI or human voiceover, sound effects, music, transitions, and complete sound design to make the final video feel more immersive and polished. Videos can also be created without voiceover when a typography and UI-driven approach works better.",
  },
  {
    question: "How does the revision process work?",
    answer:
      "We share the video during key production stages so feedback can be incorporated efficiently. Revisions can include adjustments to pacing, animation, typography, UI presentation, messaging, transitions, sound, and other production details depending on the scope of the project. Our goal is to make sure the final video feels aligned with both your product and your brand.",
  },
  {
    question: "Can you create multiple versions for different platforms?",
    answer:
      "Yes. We can prepare different formats, durations, and variations for your website, LinkedIn, X, Instagram, TikTok, YouTube, Meta Ads, presentations, and other platforms. We can also create shorter cutdowns from the main video for advertising and social campaigns.",
  },
  {
    question: "How much does a SaaS trailer or explainer cost?",
    answer:
      "Pricing depends on the video length, animation complexity, UI requirements, visual style, voiceover, number of scenes, and overall production scope. Once we understand your product and what you want to create, we can recommend the right production package and provide a clear quote before the project begins.",
  },
];

export default function SaasFaqSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2d3dc]">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Everything You Need to Know
            <br />
            <span className="text-[#17d6d4]">
              Before Starting Your SaaS Video
            </span>
          </h2>
          <p className="mt-6 text-sm leading-7 text-[#c6d8e2] md:text-base">
            From timelines and pricing to scripts, UI files, revisions, and deliverables, here are
            the most common questions we get about SaaS trailers and product explainer videos.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <article
              key={faq.question}
              className="rounded-3xl border border-white/10 bg-[#0B1F2A]/80 p-6"
            >
              <h3 className="text-lg font-bold text-white md:text-xl">
                {String(index + 1).padStart(2, "0")}. {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#c4d6df]">{faq.answer}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <PrimaryButton text="Get a Project Quote." href="/contact" width="16rem" height="52px" />
        </div>
      </div>
    </section>
  );
}
