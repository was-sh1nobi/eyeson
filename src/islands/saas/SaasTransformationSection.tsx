import PrimaryButton from "@/components/Shared/PrimaryButton";

export default function SaasTransformationSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 lg:px-20">
      <div className="relative mx-auto max-w-5xl rounded-3xl border border-[#00A9BD]/40 bg-[radial-gradient(circle_at_50%_0%,rgba(17,180,185,0.18),transparent_65%)] p-8 text-center md:p-16">
        <h2 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">
          From Complex Software to
          <br />
          A Product Story That Sells
        </h2>
        <div className="mx-auto mt-8 max-w-3xl space-y-5 text-sm leading-7 text-[#c4d6df] md:text-base">
          <p>You know your product inside out. Your audience does not.</p>
          <p>
            We take the features, workflows, ideas, and technical details behind your SaaS and turn
            them into a focused visual story people can understand without effort.
          </p>
          <p>
            The interface becomes easier to follow. The benefits become easier to remember. The
            product becomes easier to want.
          </p>
          <p>
            Because great SaaS marketing is not about explaining everything. It is about making the
            right things instantly clear.
          </p>
        </div>
        <div className="mt-10 flex justify-center">
          <PrimaryButton text="Start Your SaaS Video" href="/contact" width="16rem" height="52px" />
        </div>
      </div>
    </section>
  );
}
