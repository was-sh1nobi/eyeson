export const MotionCard = () => {
    return (
        <div className="w-full max-w-5xl rounded-[26px] border border-[#175361] bg-[#0C232B]/90 px-8 py-7 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur-md text-white">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center">
                <Field label="Design Type" options={["Poster", "Social Post", "Intro/Outro", "Logo Reveal"]} />
                <Field label="Project Complexity" options={["Basic", "Medium", "Advanced"]} />
                <Field label="Number of Variations" options={["+1", "+2", "+3", "+4"]} />
                <Field label="Deadline" options={["Express Delivery", "48h", "72h", "Flexible"]} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <Field label="Industry" options={["Beauty", "Tech", "Finance", "Lifestyle"]} />
                <button className="h-11 cursor-pointer rounded-lg bg-linear-to-r from-[#1AD1BC] to-[#0989A5] px-6 text-sm font-semibold text-white select-none shadow-[0_10px_25px_-12px_rgba(26,209,188,0.8)] transition duration-200 hover:-translate-y-px hover:brightness-125 hover:shadow-[0_10px_30px_-10px_rgba(26,209,188,0.9)] active:translate-y-0 active:brightness-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1AD1BC]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C232B]">
                    Estimate Your Project
                </button>
            </div>
        </div>
    )
}

type FieldProps = {
    label: string;
    options: string[];
}

const Field = ({label, options}: FieldProps) => (
    <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[#D9E6ED]">{label}</p>
        <select
            onWheel={(event) => {
                ;(event.currentTarget as HTMLSelectElement).blur()
            }}
            className="h-11 rounded-lg border border-[#1A4C59] bg-[#0F2D37] px-3 text-sm font-medium text-[#D9E6ED] shadow-inner shadow-[#0a1f26] outline-none transition focus:border-[#2AB0A2] focus:shadow-[0_0_0_3px_rgba(42,176,162,0.2)]"
        >
            {options.map((option) => (
                <option key={option}>{option}</option>
            ))}
        </select>
    </div>
)
