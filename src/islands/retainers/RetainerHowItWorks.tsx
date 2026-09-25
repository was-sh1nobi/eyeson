"use client";

type WorkflowStep = {
  id: number;
  title: string;
  description: string;
  output: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Monthly Planning",
    description:
      "We define your upcoming priorities, campaigns, product updates, platforms, and content requirements.",
    output: "Monthly production plan",
  },
  {
    id: 2,
    title: "Creative Direction",
    description:
      "We develop concepts, hooks, references, scripts, and visual directions for the selected content.",
    output: "Approved creative direction",
  },
  {
    id: 3,
    title: "Production",
    description:
      "Our team handles editing, design, animation, UI motion, sound, and other production requirements.",
    output: "First drafts",
  },
  {
    id: 4,
    title: "Review & Feedback",
    description:
      "Your team reviews the work and sends feedback through a structured revision process.",
    output: "Refined content",
  },
  {
    id: 5,
    title: "Delivery",
    description:
      "Approved content is exported in the required dimensions, formats, and versions.",
    output: "Ready-to-publish assets",
  },
  {
    id: 6,
    title: "Next Production Cycle",
    description:
      "Once one batch is moving toward completion, we prepare the next priorities and keep the pipeline active.",
    output: "Continuous production",
  },
];

export default function RetainerHowItWorks() {
  return (
    <section className="relative w-full overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-20 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <p className="mb-3 text-[11px] tracking-[0.2em] text-[#c2d3dc] sm:text-xs">
            A SIMPLE MONTHLY WORKFLOW
          </p>
          <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            From Monthly Priorities
            <br />
            <span className="text-[#12d4d1]">to Finished Content.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          {workflowSteps.map((step) => (
            <article
              key={step.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#13a8b8]/50 bg-[#0A1D29]/70 p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[#23d8dc]/70"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#1ed7d8]">
                  0{step.id}
                </span>
                <div className="h-px flex-1 mx-3 bg-linear-to-r from-[#1ed7d8]/40 to-transparent" />
              </div>
              <h3 className="text-lg font-bold text-white md:text-xl">
                {step.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#c4d6df]">
                {step.description}
              </p>
              <p className="mt-5 rounded-lg border border-[#1ed7d8]/30 bg-[#1ed7d8]/5 px-3 py-2 text-xs font-semibold text-[#35e4d8]">
                Output: {step.output}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
