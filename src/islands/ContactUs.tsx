import { useEffect, useRef, useState } from "react";
import { SmartImage } from "@/utils/SmartImage.tsx";

const contactImg = "/Shared/contact/a.webp";

export default function ContactUs() {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    for (const [key, val] of formData.entries()) {
      const trimmed = typeof val === "string" ? val.trim() : "";
      if (trimmed) {
        params.set(key, trimmed);
      }
    }

    if (selectedBudget) {
      params.set("budget", selectedBudget);
    }

    const qs = params.toString();
    window.location.href = qs ? `/contact?${qs}` : "/contact";
  };

  return (
    <section className="py-12 px-4 mb-16 sm:py-16 sm:px-6 sm:mb-24 lg:px-16 lg:py-20 lg:mb-40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
        {/* ===== Left: Text + Image ===== */}
        <div
          className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left gap-8 sm:gap-10 lg:gap-12 animate-fade-in"
        >
          {/* Text */}
          <div
            className="text-white space-y-4 sm:space-y-6 w-full max-w-2xl lg:max-w-none"
          >
            <p className="text-[11px] sm:text-sm tracking-widest text-cyan-400 font-semibold uppercase">
              CONTACT US
            </p>

            <h2 className="text-[28px] font-bold leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl">
              Let’s Build Something
              People Actually Watch.
            </h2>

            <p className="text-white/60 text-sm sm:text-base lg:text-lg max-w-[45ch] mx-auto lg:mx-0">
              Tell us what you want to create, a launch video, explainer, social content, animation,
              editing, or design asset. We will review your project and suggest the best direction,
              timeline, and pricing option.
            </p>
          </div>

          {/* Image */}
          <div
            className="relative hidden sm:flex w-full max-w-[700px] justify-center animate-float-slow"
          >
            <SmartImage
              src={contactImg}
              alt="Contact Us"
              width={700}
              height={600}
              loading="lazy"
              decoding="async"
              className=" w-100 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-500"
            />
          </div>
        </div>

        {/* ===== Right: Form ===== */}
        <div
          className="lg:col-span-7 w-full bg-linear-to-b from-[#0a2333] via-[#071924] to-[#04111a] border border-[#00A9BD]/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,169,189,0.25)] animate-slide-up"
        >
          <form
            action="/contact"
            method="GET"
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-6 md:space-y-8 text-white w-full text-left"
          >
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input label="First Name" name="firstName" placeholder="John" />
              <Input label="Last Name" name="lastName" placeholder="Smith" />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input label="Email" type="email" name="email" placeholder="john@company.com" />
              <Input label="Telegram or Whatsapp" type="tel" name="phone" placeholder="+1 (555) 123-4567" />
            </div>

            <Input label="Company Name" name="companyName" placeholder="Your company or brand" />
            <Select
              label="Project Type"
              name="projectType"
              options={[
                "Product Launch Video",
                "Explainer Video",
                "Motion Graphics",
                "Talking Head Editing",
                "Short Form Social Content",
                "Video Ads",
                "2D or 3D Animation",
                "UI or Graphic Design",
                "Brand Identity",
                "Ongoing Monthly Content",
                "Other",
              ]}
            />

            {/* Budget */}
            <div className="space-y-3 pt-2">
              <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1">
                Budget Range
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                {["Under $500", "$500 to $1,500", "$1,500 to $3,000", "$3,000 to $7,500", "$7,500+"].map(
                  (budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() =>
                        setSelectedBudget(selectedBudget === budget ? null : budget)
                      }
                      className={`px-3 py-2 text-[11px] font-medium rounded-full border transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out hover:scale-105 active:scale-95
                      sm:px-4 sm:py-2.5 sm:text-sm flex-1 sm:flex-none whitespace-nowrap cursor-pointer
                      ${
                        selectedBudget === budget
                          ? "bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/40"
                          : "bg-[#04121b]/80 border-[#00A9BD]/20 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-white/80"
                      }`}
                    >
                      {budget}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1">
                Tell us about your project
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="What do you want to create, what is your goal, and do you have any references, deadline, or style in mind?"
                className="bg-[#020b12]/80 border border-[#00A9BD]/20 rounded-xl px-4 py-3 text-sm
                            focus:outline-none focus:border-cyan-400 focus:bg-[#020b12] focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]
                           transition-[background-color,border-color,box-shadow] duration-300 resize-none w-full"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-linear-to-r from-cyan-400 via-[#00E6D7] to-[#00A9BD] text-[#01141c] font-bold rounded-xl
                           py-3.5 text-[15px] cursor-pointer
                           sm:py-4 sm:text-base shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] active:scale-[0.98]"
              >
                Send Project Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ===== Reusable Select (custom glass dropdown — native <select> menus can't be styled) ===== */
interface SelectProps {
  label: string;
  options: string[];
  name: string;
}

function Select({ label, options, name }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    const panel = ref.current!.querySelector<HTMLElement>("[role='listbox']");
    const blockWheel = (e: WheelEvent) => {
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      const atTop = el.scrollTop <= 0 && e.deltaY < 0;
      const atBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
      // Scroll the panel itself when it has room, block the page only at its edges
      if (!atTop && !atBottom) {
        el.scrollTop += e.deltaY;
      }
    };
    panel?.addEventListener("wheel", blockWheel, { passive: false });
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
      panel?.removeEventListener("wheel", blockWheel);
    };
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 relative" ref={ref}>
      <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1">
        {label}
      </label>
      {/* hidden native input so the form still submits projectType */}
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm sm:text-base text-left cursor-pointer
                   bg-[#020b12]/80 border transition-[background-color,border-color,box-shadow] duration-300
                   ${open ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-[#00A9BD]/20"}`}
      >
        <span className={value ? "text-white" : "text-white/40"}>
          {value || `Select ${label}`}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#00E5FF] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[280px] overflow-y-auto rounded-2xl
                     border border-white/10 bg-linear-to-b from-[#0b1f2a]/90 to-[#020915]/90
                     backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.45)] p-1.5 overscroll-contain
                     animate-fade-in"
        >
          {options.map((opt) => {
            const active = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setValue(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm sm:text-[15px] text-left transition-colors duration-150 cursor-pointer
                  ${active
                    ? "bg-cyan-400/15 text-cyan-300"
                    : "text-white/80 hover:bg-white/5 hover:text-white"}`}
              >
                <span>{opt}</span>
                {active && (
                  <svg className="h-4 w-4 shrink-0 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Input({ label, type = "text", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="bg-[#020b12]/80 border border-[#00A9BD]/20 rounded-xl
                   px-4 py-3 text-sm sm:text-base w-full
                   focus:outline-none focus:border-cyan-400 focus:bg-[#020b12] focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]
                   transition-[background-color,border-color,box-shadow] duration-300"
      />
    </div>
  );
}
