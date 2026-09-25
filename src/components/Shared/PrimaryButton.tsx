'use client';

type PrimaryButtonProps = {
  text?: string;
  href?: string;
  width?: string;
  height?: string;
  className?: string;
};

export default function PrimaryButton({
  text = "Get a free sample",
  href = "#",
  width = "auto",
  height = "auto",
  className = "",
}: PrimaryButtonProps) {
  return (
    <div
      className={`group relative inline-flex transition-transform duration-200 ease-out hover:scale-105 active:scale-95 rounded-[var(--radius-full)] p-[var(--primitive-border-width-medium)] ${className}`}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 rounded-[var(--radius-full)] opacity-80 shadow-[var(--button-shadow)] transition-[opacity,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-default)] group-hover:opacity-100 group-hover:shadow-[var(--button-shadow-hover)] group-active:shadow-[0_0_8px_var(--color-primary)]"
        style={{ backgroundImage: "var(--button-primary-border-gradient)" }}
      />

      <a
        href={href}
        className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[var(--radius-full)] px-6 py-2.5 text-sm md:text-lg text-white font-medium shadow-inner"
        style={{ backgroundImage: "var(--button-primary-bg)" }}
      >
        <div
          className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[var(--duration-emphasis)] ease-[var(--ease-default)] group-hover:translate-x-[150%] skew-x-[-20deg]"
        />

        <span className="relative z-20 drop-shadow-md">
          {text}
        </span>
      </a>
    </div>
  );
}