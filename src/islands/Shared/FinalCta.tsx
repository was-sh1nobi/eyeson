import PrimaryButton from "../../components/Shared/PrimaryButton";
import SecondaryButton from "../../components/Shared/SecondaryButton";

type FinalCtaProps = {
  kicker: string;
  title: string;
  description: string;
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
};

export default function FinalCta({
  kicker,
  title,
  description,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: FinalCtaProps) {
  return (
    <section className="relative w-full overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-20 lg:pb-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#00A9BD]/40 px-6 py-12 text-center shadow-[0_0_40px_rgba(0,168,182,0.15)] md:px-12 md:py-16 animate-fade-in">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(17,180,185,0.18),transparent_65%)]" />
        <p className="text-[11px] tracking-[0.2em] text-[#c2d3dc] sm:text-xs">{kicker}</p>
        <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#c4d6df] md:text-base md:leading-8">{description}</p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PrimaryButton
            text={primaryText}
            href={primaryHref}
            width="16rem"
            height="52px"
          />
          <SecondaryButton
            text={secondaryText}
            href={secondaryHref}
            width="16rem"
            height="52px"
          />
        </div>
      </div>
    </section>
  );
}
