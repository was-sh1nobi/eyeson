'use client';

type SecondaryButtonProps = {
  text: string;
  href?: string;
  width?: string;
  height?: string;
  className?: string;
  textClassName? : string;
};

export default function SecondaryButton({
  text,
  href = "#",
  width = "auto",
  height = "auto",
  className = "",
    textClassName = "",
}: SecondaryButtonProps) {
  return (
    <div
      className={`group relative inline-flex transition-transform duration-200 ease-out hover:scale-105 active:scale-95 rounded-[var(--radius-full)] p-[1.5px] ${className}`}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 rounded-[var(--radius-full)] opacity-75 shadow-[var(--button-shadow)] transition-[opacity,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-default)] group-hover:opacity-100 group-hover:shadow-[var(--button-shadow-hover)] group-active:shadow-[0_0_6px_rgba(0,169,189,0.4)]"
        style={{ backgroundImage: "var(--button-primary-border-gradient)" }}
      />

      <a
        href={href}
        className={`relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-(--radius-full) px-6 py-2.5 text-lg md:text-lg text-white/90 font-medium transition-colors duration-(--duration-normal) ease-(--ease-default) group-hover:text-white ${textClassName}`}
        style={{ backgroundImage: "var(--button-secondary-bg)" }}
      >
        <div
          className="absolute inset-0 translate-x-[-150%] bg-linear-to-r from-transparent via-cyan-300/10 to-transparent skew-x-[-25deg] transition-transform duration-(--duration-emphasis) ease-(--ease-default) group-hover:translate-x-[150%]"
        />

        <span className="relative z-20 transition-transform duration-(--duration-normal) ease-(--ease-default) group-hover:scale-[1.02]">
          {text}
        </span>
      </a>
    </div>
  );
}