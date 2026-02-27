"use client";

import { useState, useCallback } from "react";
import Dashboard from "@/components/dashboard/Dashboard";
import CompanyDashboard from "@/components/company-dashboard/CompanyDashboard";
import UploadZone from "@/components/upload/UploadZone";
import type { LinkedInData, UploadResult } from "@/lib/types";
import { GITHUB_URL } from "@/lib/constants";
import ExportCallout from "@/components/upload/ExportCallout";
import demoData from "@/data/ishaan.json";

const LINKEDIN_ANALYTICS_URL =
  "https://www.linkedin.com/analytics/creator/content/";

export default function Home() {
  const [data, setData] = useState<UploadResult | null>(null);
  const [exiting, setExiting] = useState(false);

  const handleUpload = (result: UploadResult) => {
    setData(result);
  };

  const handleReset = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setData(null);
      setExiting(false);
    }, 300);
  }, []);

  if (data) {
    return (
      <div className={`min-h-screen bg-[var(--background)] ${exiting ? "animate-fade-out-down" : ""}`}>
        <header className="border-b border-[var(--border-light)] px-4 py-3 sm:px-6 sm:py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
            <button
              onClick={handleReset}
              className="font-mono text-xs font-bold tracking-wider hover:text-[var(--accent)] sm:text-sm"
            >
              areyouviral
            </button>
            <span className="font-mono text-[10px] text-[var(--muted)] sm:text-xs">
              Made by{" "}
              <a
                href="https://ishaan.ag"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--foreground)] underline decoration-[var(--border-light)] underline-offset-4 transition-colors hover:decoration-[var(--foreground)]"
              >
                Ishaan
              </a>
              <span className="hidden sm:inline">{" "}❤️</span>
            </span>
            <button
              onClick={handleReset}
              className="border border-[var(--foreground)] bg-[var(--foreground)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--background)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] sm:px-4 sm:py-2 sm:text-xs"
            >
              Upload new data
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">
          {data.type === "creator" ? (
            <Dashboard data={data.data} />
          ) : (
            <CompanyDashboard data={data.data} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen animate-fade-in-up flex-col bg-[var(--background)] sm:h-screen sm:overflow-hidden">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:py-0">
        {/* Headline */}
        <h1 className="mb-4 max-w-3xl text-center font-mono text-5xl font-black uppercase leading-tight tracking-tight sm:text-7xl">
          How <span className="fire-text">viral</span> are you, really?
        </h1>

        {/* Subtitle */}
        <p className="mb-2 max-w-lg text-center text-lg text-[var(--muted)]">
          Upload your LinkedIn analytics export — personal or company page
          — to see top posts, engagement metrics, and more.
        </p>

        {/* Upload zone */}
        <div className="mb-3 mt-8 w-full max-w-xl">
          <UploadZone onDataLoaded={handleUpload} />
        </div>
        <button
          onClick={() => handleUpload({ type: "creator", data: demoData as LinkedInData })}
          className="mb-6 font-mono text-xs text-[var(--muted)] underline decoration-[var(--border-light)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
        >
          or try with sample data
        </button>

        {/* Steps */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:gap-8">
          {/* Step 01 — with Export button callout */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black">01</span>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider">
                  Export your analytics
                </p>
                <a
                  href={LINKEDIN_ANALYTICS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#0077B5] underline underline-offset-4 hover:decoration-2"
                >
                  Open LinkedIn &rarr;
                </a>
              </div>
            </div>
            <ExportCallout />
          </div>

          {/* Step 02 */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-black">02</span>
            <p className="font-mono text-xs font-bold uppercase tracking-wider">
              Drop the file above
            </p>
          </div>

          {/* Step 03 */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-black">03</span>
            <p className="font-mono text-xs font-bold uppercase tracking-wider">
              See your real numbers
            </p>
          </div>
        </div>
      </main>

      <footer className="shrink-0 pb-4 pt-2 text-center">
        <p className="font-mono text-xs text-[var(--muted)]">
          Made by{" "}
          <a
            href="https://ishaan.ag"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[var(--foreground)] underline decoration-[var(--border-light)] underline-offset-4 transition-colors hover:decoration-[var(--foreground)]"
          >
            Ishaan
          </a>
          {" "}❤️ · {" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--border-light)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
          >
            Source code
          </a>
        </p>
      </footer>
    </div>
  );
}
