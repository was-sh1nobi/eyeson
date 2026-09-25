import { useState } from "react";
import { SmartImage } from "@/utils/SmartImage.tsx";

const contactImg = "/Shared/contact/a.webp";

export default function ContactUs() {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

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
              className="rounded-2xl sm:rounded-3xl w-100 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-500"
            />
          </div>
        </div>

        {/* ===== Right: Form ===== */}
        <div
          className="lg:col-span-7 w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl animate-slide-up"
        >
          <form className="space-y-5 sm:space-y-6 md:space-y-8 text-white w-full text-left">
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input label="First Name" />
              <Input label="Last Name" />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input label="Email" type="email" />
              <Input label="Telegram or Whatsapp" type="tel" />
            </div>

            <Input label="Company Name" />
            <Select label="Project Type" options={["Product Launch Video", "Explainer Video", "Motion Graphics", "Talking Head Editing", "Short Form Social Content", "Video Ads", "2D or 3D Animation", "UI or Graphic Design", "Brand Identity", "Ongoing Monthly Content", "Other"]} />

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
                      onClick={() => setSelectedBudget(budget)}
                      className={`px-3 py-2 text-[11px] font-medium rounded-full border transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out hover:scale-105 active:scale-95
                      sm:px-4 sm:py-2.5 sm:text-sm flex-1 sm:flex-none whitespace-nowrap cursor-pointer
                      ${
                        selectedBudget === budget
                          ? "bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/40"
                          : "bg-white/5 border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-white/80"
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
                rows={4}
                placeholder="What do you want to create, what is your goal, and do you have any references, deadline, or style in mind?"
                className="bg-[#040e14]/50 border border-white/10 rounded-xl px-4 py-3 text-sm
                            focus:outline-none focus:border-cyan-400/50 focus:bg-white/5 focus:shadow-[0_0_20px_rgba(34,211,238,0.15)]
                           transition-[background-color,border-color,box-shadow] duration-300 resize-none w-full"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold rounded-xl
                           py-3.5 text-[15px] cursor-pointer
                           sm:py-4 sm:text-base shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-[0.98]"
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

/* ===== Reusable Select ===== */
function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1">
        {label}
      </label>
      <select
        defaultValue=""
        className="bg-[#040e14]/50 border border-white/10 rounded-xl
                   px-4 py-3 text-sm sm:text-base w-full
                   focus:outline-none focus:border-cyan-400/50 focus:bg-white/5
                   transition-colors duration-300 text-white"
      >
        <option value="" disabled className="text-gray-400">
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-white bg-[#040e14]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <label className="text-xs sm:text-sm text-gray-400 font-medium ml-1">
        {label}
      </label>
      <input
        type={type}
        className="bg-[#040e14]/50 border border-white/10 rounded-xl
                   px-4 py-3 text-sm sm:text-base w-full
                   focus:outline-none focus:border-cyan-400/50 focus:bg-white/5 focus:shadow-[0_0_20px_rgba(34,211,238,0.15)]
                   transition-[background-color,border-color,box-shadow] duration-300"
      />
    </div>
  );
}
