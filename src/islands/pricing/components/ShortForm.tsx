import { useState, useEffect, useRef } from "react"

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
    Standard: "Standard (5–7 days)",
    "Standard Timeline": "Standard (5–7 days)",
    Priority: "Priority (3–5 days)",
    "Priority Delivery": "Priority (3–5 days)",
    Express: "Express (2–3 days)",
    "Express Delivery": "Express (2–3 days)",
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
            const rawValue = field.items[selections[idx]]
            let displayValue = rawValue

            if (field.unit === "percentage") {
                percentageMultiplier += price / 100
                const hint = DELIVERY_HINTS[rawValue]
                if (hint) {
                    deliveryHint = hint
                    displayValue = hint
                } else if (!deliveryHint) {
                    deliveryHint = "5–7 business days"
                }
                lines.push({ title: field.title, value: displayValue, price })
            } else if (field.unit === "per_minute") {
                perMinuteTotal += price
                lines.push({ title: field.title, value: displayValue, price })
            } else if (field.unit === "per_quantity") {
                const subtotal = price * qty
                fixedTotal += subtotal
                lines.push({ title: field.title, value: displayValue, price: subtotal })
            } else {
                fixedTotal += price
                lines.push({ title: field.title, value: displayValue, price })
            }
        })

        if (!deliveryHint) {
            deliveryHint = "5–7 business days"
        }

        let total = (fixedTotal + perMinuteTotal * (duration / 60)) * percentageMultiplier

        if (qtyField?.discounts) {
            const applicableDiscount = [...qtyField.discounts]
                .sort((a, b) => b.min - a.min)
                .find((d) => qty >= d.min)
            if (applicableDiscount) {
                total = total * (1 - applicableDiscount.percent / 100)
            }
        }

        total = Math.round(total)

        if (onEstimated) {
            onEstimated({
                lines,
                total,
                deliveryHint,
                duration,
                durationTitle,
            })
        }
    }

    const hasPrices = fields.some((f) => f.prices?.some((p) => p != null))

    return (
        <div
            data-calculator-card
            className="w-full max-w-5xl rounded-[28px] border border-[#00A9BD]/30 bg-gradient-to-b from-[#061e27]/95 via-[#04141c]/95 to-[#020b10]/95 px-6 sm:px-8 pt-7 pb-8 sm:pb-9 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.7),0_0_50px_-10px_rgba(0,229,255,0.08)] backdrop-blur-xl"
        >
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
                            <span className="text-[#00E5FF]/70">(seconds)</span>
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
                            className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#051822]"
                            style={{
                                background: `linear-gradient(90deg, #00E5FF ${((duration - 5) / 115) * 100}%, #0a2633 ${((duration - 5) / 115) * 100}%)`,
                            }}
                        />
                        <div className="mt-2 inline-flex items-center rounded-lg border border-[#00E5FF]/25 bg-[#051822] px-3 py-1 text-xs font-semibold text-[#00E5FF] shadow-inner shadow-[#020b10]">
                            {formatter.format(duration)} seconds
                        </div>
                    </div>
                )}

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleEstimate}
                        className="w-full sm:w-auto px-9 py-3.5 rounded-full font-bold text-[15px] whitespace-nowrap text-[#03151c] bg-gradient-to-r from-[#00E5FF] via-[#00DFD8] to-[#00B4D8] shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.65)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
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
                    background: #00E5FF;
                    border-radius: 999px;
                    border: 2px solid #03141c;
                    margin-top: 0;
                    box-shadow: 0 0 12px rgba(0, 229, 255, 0.6);
                    cursor: pointer;
                }
                input[type='range']::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    background: #00E5FF;
                    border-radius: 999px;
                    border: 2px solid #03141c;
                    box-shadow: 0 0 12px rgba(0, 229, 255, 0.6);
                    cursor: pointer;
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

const SelectField = ({ title, items, value, onChange }: SelectFieldProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [openUpward, setOpenUpward] = useState(false)
    const [menuMaxHeight, setMenuMaxHeight] = useState<number>(240)
    const containerRef = useRef<HTMLDivElement>(null)

    const updatePlacement = () => {
        if (!containerRef.current) return
        const buttonRect = containerRef.current.getBoundingClientRect()
        const card = containerRef.current.closest("[data-calculator-card]") as HTMLElement | null
        const cardRect = card ? card.getBoundingClientRect() : null

        // Space remaining inside the calculator card boundary
        const spaceBelow = cardRect
            ? cardRect.bottom - buttonRect.bottom - 16
            : window.innerHeight - buttonRect.bottom - 16
        const spaceAbove = cardRect
            ? buttonRect.top - cardRect.top - 16
            : buttonRect.top - 16

        // If space below inside the calculator card cannot fit the menu (< 210px) and space above is larger, open upward
        const shouldOpenUp = spaceBelow < 210 && spaceAbove > spaceBelow
        setOpenUpward(shouldOpenUp)

        const available = shouldOpenUp ? spaceAbove : spaceBelow
        if (available > 0) {
            setMenuMaxHeight(Math.min(240, Math.max(120, Math.floor(available))))
        } else {
            setMenuMaxHeight(240)
        }
    }

    const toggleOpen = () => {
        if (!isOpen) {
            updatePlacement()
        }
        setIsOpen((prev) => !prev)
    }

    useEffect(() => {
        if (!isOpen) return
        updatePlacement()
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        const handleResize = () => updatePlacement()

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("touchstart", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)
        window.addEventListener("resize", handleResize)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("resize", handleResize)
        }
    }, [isOpen])

    return (
        <div ref={containerRef} className={`relative flex flex-col gap-1.5 text-white ${isOpen ? "z-40" : "z-10"}`}>
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-[#A9C1CB]">
                {title}
            </label>
            <button
                type="button"
                onClick={toggleOpen}
                className={`w-full h-11 sm:h-12 rounded-xl border px-3.5 sm:px-4 text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-200 cursor-pointer ${
                    isOpen
                        ? "border-[#00E5FF] bg-[#072430] text-white shadow-[0_0_20px_rgba(0,229,255,0.25)] ring-1 ring-[#00E5FF]/40"
                        : "border-[#00A9BD]/30 bg-[#051822] text-[#E0EEF5] hover:border-[#00E5FF]/60 hover:bg-[#07222e]"
                }`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate">{items[value] ?? "Select"}</span>
                <svg
                    className={`w-4 h-4 text-[#00E5FF] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Dropdown Menu - pure custom DOM for 100% parity across Chrome, Firefox, Safari */}
            {isOpen && (
                <div
                    role="listbox"
                    className={`absolute left-0 right-0 z-50 overflow-y-auto rounded-xl border border-[#00E5FF]/35 bg-[#051822]/98 p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(0,229,255,0.18)] backdrop-blur-xl ${
                        openUpward ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
                    }`}
                    style={{
                        maxHeight: `${menuMaxHeight}px`,
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(0, 229, 255, 0.4) rgba(5, 24, 34, 0.6)",
                    }}
                >
                    {items.map((item, idx) => {
                        const isSelected = idx === value
                        return (
                            <button
                                key={idx}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    onChange(idx)
                                    setIsOpen(false)
                                }}
                                className={`w-full px-3 py-2 rounded-lg text-left text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                                    isSelected
                                        ? "bg-[#00E5FF]/15 text-[#00E5FF] font-bold shadow-[inset_0_0_12px_rgba(0,229,255,0.15)]"
                                        : "text-[#C2D7E0] hover:bg-white/8 hover:text-white"
                                }`}
                            >
                                <span className="truncate">{item}</span>
                                {isSelected && (
                                    <svg
                                        className="w-4 h-4 text-[#00E5FF] shrink-0 ml-2"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
