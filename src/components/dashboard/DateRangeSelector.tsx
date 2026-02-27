"use client";

import type { DateRange } from "@/lib/types";

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  availableRanges: DateRange[];
  dataDays: number;
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
}: DateRangeSelectorProps) {
  const options = allOptions.filter((opt) =>
    availableRanges.includes(opt.value)
  );

  return (
    <div>
      <div className="flex items-center gap-1.5 sm:gap-2">
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
      </div>
      {dataDays <= 90 && (
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
