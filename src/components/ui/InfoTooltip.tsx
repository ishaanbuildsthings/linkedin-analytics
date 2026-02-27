"use client";

import { useState } from "react";

export default function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[9px] leading-none text-[var(--muted)] transition-colors hover:bg-[var(--border-light)] hover:text-[var(--foreground)]"
        aria-label="More info"
      >
        i
      </button>
      {show && (
        <span className="absolute bottom-full right-0 z-50 mb-2 w-max max-w-[200px] rounded-md bg-[var(--foreground)] px-3 py-1.5 font-mono text-[10px] leading-snug text-[var(--background)] shadow-lg">
          {text}
          <span className="absolute right-3 top-full border-4 border-transparent border-t-[var(--foreground)]" />
        </span>
      )}
    </span>
  );
}
