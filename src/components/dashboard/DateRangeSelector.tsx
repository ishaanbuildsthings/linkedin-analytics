"use client";

import type { DateRange } from "@/lib/types";

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  availableRanges: DateRange[];
  dataDays: number;
  customStart?: string;
  customEnd?: string;
  onCustomChange?: (start: string, end: string) => void;
  dataStartDate?: string;
  dataEndDate?: string;
}

const allOptions: { value: DateRange; label: string; shortLabel: string }[] = [
  { value: "week", label: "Past week", shortLabel: "Week" },
  { value: "month", label: "Past month", shortLabel: "Month" },
  { value: "3months", label: "Past 3 months", shortLabel: "3 mo" },
  { value: "year", label: "Past year", shortLabel: "Year" },
];

export default function DateRangeSelector({
  value,
  onChange,
  availableRanges,
  dataDays,
  customStart,
  customEnd,
  onCustomChange,
  dataStartDate,
  dataEndDate,
}: DateRangeSelectorProps) {
  const options = allOptions.filter((opt) =>
    availableRanges.includes(opt.value)
  );

  const isCustom = value === "custom";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-xs ${
              value === opt.value
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "border border-[var(--border-light)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span className="sm:hidden">{opt.shortLabel}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        ))}
        {onCustomChange && (
          <button
            onClick={() => onChange("custom")}
            className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-xs ${
              isCustom
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "border border-[var(--border-light)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span className="sm:hidden">Custom</span>
            <span className="hidden sm:inline">Custom range</span>
          </button>
        )}
      </div>

      {/* Custom date picker */}
      {isCustom && onCustomChange && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={customStart || ""}
            min={dataStartDate}
            max={customEnd || dataEndDate}
            onChange={(e) => {
              onCustomChange(e.target.value, customEnd || dataEndDate || "");
            }}
            className="rounded-md border border-[var(--border-light)] bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] sm:text-xs"
          />
          <span className="font-mono text-[11px] text-[var(--muted)]">to</span>
          <input
            type="date"
            value={customEnd || ""}
            min={customStart || dataStartDate}
            max={dataEndDate}
            onChange={(e) => {
              onCustomChange(customStart || dataStartDate || "", e.target.value);
            }}
            className="rounded-md border border-[var(--border-light)] bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--foreground)] outline-none focus:border-[var(--foreground)] sm:text-xs"
          />
        </div>
      )}

      {dataDays <= 90 && !isCustom && (
        <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">
          ({dataDays} days of data)
        </p>
      )}
      {dataDays <= 14 && (
        <p className="mt-2 font-mono text-[11px] text-[var(--amber)]">
          Tip: Select &quot;Past 365 days&quot; in LinkedIn before exporting to get more data.
        </p>
      )}
    </div>
  );
}
