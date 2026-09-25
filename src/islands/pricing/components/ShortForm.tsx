import { useState } from "react"

type Field = {
    title: string
    items: string[]
    prices?: number[]
    unit?: "fixed" | "per_minute" | "percentage" | "per_quantity"
    quantityValues?: number[]
    discounts?: { min: number; percent: number }[]
}

type SummaryLine = {
    title: string
    value: string
    price: number
}

type Props = {
    packageName: string
    fields: Field[]
    durationTitle?: string
    initialDuration?: number
    onEstimated?: (summary: { lines: SummaryLine[]; total: number; deliveryHint: string; duration: number; durationTitle?: string }) => void
}

const DELIVERY_HINTS: Record<string, string> = {
    Standard: "Delivery: 5–7 business days",
    "Standard Timeline": "Delivery: 5–7 business days",
    Priority: "Delivery: 3–5 business days",
    "Priority Delivery": "Delivery: 3–5 business days",
    Express: "Delivery: 2–3 business days",
    "Express Delivery": "Delivery: 2–3 business days",
}

export const ShortForm = ({
    packageName,
    fields,
    durationTitle,
    initialDuration = 60,
    onEstimated,
}: Props) => {
    const [duration, setDuration] = useState(initialDuration)
    const [selections, setSelections] = useState<number[]>(() => fields.map(() => 0))
    const formatter = new Intl.NumberFormat("en-US")
    const visibleFields = fields.filter((f) => f.items.length > 0)

    const handleSelectChange = (fieldIdx: number, optionIdx: number) => {
        setSelections((prev) => {
            const next = [...prev]
            next[fieldIdx] = optionIdx
            return next
        })
    }

    const handleEstimate = () => {
        let fixedTotal = 0
        let perMinuteTotal = 0
        let percentageMultiplier = 1
        const qtyField = visibleFields.find((f) => f.quantityValues)
        const qtyIdx = qtyField ? visibleFields.indexOf(qtyField) : -1
        const qty = qtyIdx >= 0 ? (qtyField?.quantityValues?.[selections[qtyIdx]] ?? 1) : 1
        let deliveryHint = ""
        const lines: SummaryLine[] = []

        visibleFields.forEach((field, idx) => {
            const price = field.prices?.[selections[idx]] ?? 0
            const value = field.items[selections[idx]]

            if (field.unit === "percentage") {
                percentageMultiplier += price / 100
                if (price > 0) {
                    const hint = DELIVERY_HINTS[value]
                    if (hint) deliveryHint = hint
                } else if (!deliveryHint) {
                    deliveryHint = DELIVERY_HINTS[value] ?? ""
                }
            } else if (field.unit === "per_minute") {
                perMinuteTotal += price
            } else if (field.unit === "per_quantity") {
                let discount = 0
                if (qtyField?.discounts) {
                    const sorted = [...qtyField.discounts].sort((a, b) => b.min - a.min)
                    const rule = sorted.find((d) => qty >= d.min)
                    discount = rule?.percent ?? 0
                }
                const linePrice = Math.round(price * qty * (1 - discount / 100))
                fixedTotal += linePrice
                lines.push({ title: field.title, value, price: linePrice })
            } else {
                fixedTotal += price
                if (price > 0) {
                    lines.push({ title: field.title, value, price })
                }
            }
        })

        const minutes = durationTitle ? duration / 60 : 1
        const minuteLinePrice = Math.round(perMinuteTotal * minutes)
        if (minuteLinePrice > 0 && durationTitle) {
            const minuteField = visibleFields.find((f) => f.unit === "per_minute")
            lines.unshift({
                title: minuteField?.title ?? "Base Price",
                value: `${formatter.format(minutes)} min`,
                price: minuteLinePrice,
            })
        }

        const total = Math.round((fixedTotal + minuteLinePrice) * percentageMultiplier)
        const pricedLines = lines.filter((l) => l.price > 0)
        if (!deliveryHint) deliveryHint = "Delivery: 5–7 business days"

        onEstimated?.({ lines: pricedLines, total, deliveryHint, duration, durationTitle })
    }

    const hasPrices = fields.some((f) => f.prices?.some((p) => p != null))

    return (
        <div className="w-full max-w-5xl rounded-[26px] border border-[#175361] bg-[#0C232B]/90 px-8 py-7 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleFields.map((field, idx) => (
                    <SelectField
                        key={idx}
                        title={field.title}
                        items={field.items}
                        value={selections[idx]}
                        onChange={(optionIdx) => handleSelectChange(idx, optionIdx)}
                    />
                ))}
            </div>

            <div
                className={`mt-8 flex flex-col gap-4 md:flex-row md:items-center ${
                    durationTitle ? "md:justify-between" : "md:justify-center"
                }`}
            >
                {durationTitle && (
                    <div className="w-full md:max-w-[70%]">
                        <div className="flex items-center gap-1 text-sm font-semibold text-[#D9E6ED]">
                            <span>{durationTitle}</span>
                            <span className="text-[#5C7C88]">(seconds)</span>
                        </div>
                        <input
                            type="range"
                            min={5}
                            max={120}
                            value={duration}
                            onChange={(event) => setDuration(Number(event.target.value))}
                            onWheel={(event) => {
                                ;(event.currentTarget as HTMLInputElement).blur()
                            }}
                            className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#122b35]"
                            style={{
                                background: `linear-gradient(90deg, #1AD1BC ${((duration - 5) / 115) * 100}%, #16353F ${((duration - 5) / 115) * 100}%)`,
                            }}
                        />
                        <div className="mt-2 inline-flex rounded-md bg-[#0F2D37] px-3 py-1 text-xs font-medium text-[#A9C1CB] shadow-inner shadow-[#0a1f26]">
                            {formatter.format(duration)} seconds
                        </div>
                    </div>
                )}

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <button
                        onClick={handleEstimate}
                        className="h-11 w-full cursor-pointer rounded-lg bg-linear-to-r from-[#1AD1BC] to-[#0989A5] px-6 text-sm font-semibold text-white select-none shadow-[0_10px_25px_-12px_rgba(26,209,188,0.8)] transition duration-200 hover:-translate-y-px hover:brightness-125 hover:shadow-[0_10px_30px_-10px_rgba(26,209,188,0.9)] active:translate-y-0 active:brightness-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1AD1BC]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C232B] sm:w-auto"
                    >
                        {hasPrices ? "Estimate Your Project" : "Get Started"}
                    </button>
                </div>
            </div>

            <style>{`
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: #5acfb3;
                    border-radius: 999px;
                    border: 2px solid #0f2d37;
                    margin-top: 0;
                    box-shadow: 0 0 0 4px rgba(90, 207, 179, 0.2);
                }
                input[type='range']::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    background: #5acfb3;
                    border-radius: 999px;
                    border: 2px solid #0f2d37;
                    box-shadow: 0 0 0 4px rgba(90, 207, 179, 0.2);
                }
            `}</style>
        </div>
    )
}

type SelectFieldProps = {
    title: string
    items: string[]
    value: number
    onChange: (optionIdx: number) => void
}

const SelectField = ({ title, items, value, onChange }: SelectFieldProps) => (
    <div className="flex flex-col gap-2 text-white">
        <p className="text-sm font-semibold text-[#D9E6ED]">{title}</p>
        <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            onWheel={(event) => {
                ;(event.currentTarget as HTMLSelectElement).blur()
            }}
            className="h-11 rounded-lg border border-[#1A4C59] bg-[#0F2D37] px-3 text-sm font-medium text-[#D9E6ED] shadow-inner shadow-[#0a1f26] outline-none transition focus:border-[#2AB0A2] focus:shadow-[0_0_0_3px_rgba(42,176,162,0.2)]"
        >
            {items.map((item, idx) => (
                <option key={idx} value={idx}>
                    {item}
                </option>
            ))}
        </select>
    </div>
)
