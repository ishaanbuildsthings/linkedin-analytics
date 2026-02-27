"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { UploadResult } from "@/lib/types";
import { LOADING_MESSAGES } from "@/lib/constants";

interface UploadZoneProps {
  onDataLoaded: (data: UploadResult) => void;
  compact?: boolean;
}

export default function UploadZone({ onDataLoaded, compact }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        setError("That's not an .xlsx or .xls file. Nice try though.");
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const XLSX = await import("xlsx");
        const { detectAndParse } = await import("@/lib/detect-format");
        const buffer = await file.arrayBuffer();
        // Small delay so users can see the fun loading messages
        await new Promise((r) => setTimeout(r, 2000));
        const result = detectAndParse(XLSX, buffer);
        onDataLoaded(result);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Couldn't parse that file. Make sure it's a LinkedIn Creator or Company Page analytics export."
        );
      } finally {
        setLoading(false);
      }
    },
    [onDataLoaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--background)] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)]"
        >
          Upload new data
        </button>
        {error && (
          <p className="font-mono text-xs text-[var(--accent)]">{error}</p>
        )}
        {loading && (
          <p className="animate-pulse-slow font-mono text-xs text-[var(--accent)]">
            {loadingMsg}
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 p-10 text-center transition-all ${
          isDragging
            ? "border-[var(--foreground)] bg-[var(--surface)]"
            : "border-dashed border-[var(--border-light)] hover:border-[var(--foreground)] hover:bg-[var(--surface)]"
        }`}
      >
        {loading ? (
          <div>
            <p className="animate-pulse-slow font-mono text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
              {loadingMsg}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-2 font-mono text-sm font-bold uppercase tracking-wider">
              Drop your .xlsx or .xls here
            </p>
            <p className="font-mono text-[10px] text-[var(--muted)]">
              Your data never leaves your browser.
            </p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-3 font-mono text-xs text-[var(--accent)]">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
