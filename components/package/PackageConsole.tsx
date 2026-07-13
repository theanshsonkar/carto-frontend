"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeRepo, PRESET_REPOS } from "./passport-data";

/**
 * PackageConsole — just the drop zone. Submitting routes to the dedicated,
 * shareable passport page at /r?repo=owner/name, which plays the scan and
 * reveals the Wrapped card. Keeping the result on its own URL is the whole
 * point — that link is the shareable artifact.
 */
export function PackageConsole() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function go(raw: string) {
    const repo = normalizeRepo(raw);
    if (!repo) {
      setError("Enter a GitHub URL or owner/repo, e.g. vercel/next.js");
      return;
    }
    router.push(`/r?repo=${encodeURIComponent(repo)}`);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(url);
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-14 flex-1 items-stretch border border-ink bg-panel shadow-hard transition-shadow focus-within:shadow-hard-lg">
            <span aria-hidden className="flex items-center border-r border-line px-4 font-mono text-[0.8rem] text-ink-3">
              github.com/
            </span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="vercel/next.js"
              aria-label="Public GitHub repository"
              className="min-w-0 flex-1 bg-transparent px-4 font-mono text-[0.9rem] text-ink outline-none placeholder:text-ink-3"
            />
          </div>
          <button type="submit" className="btn-primary h-14 shrink-0">
            Package this repo →
          </button>
        </div>

        {error ? (
          <p className="mt-2 font-mono text-[0.72rem] text-signal">{error}</p>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[0.72rem] text-ink-3">
            <span>try:</span>
            {PRESET_REPOS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => go(r)}
                className="border border-line bg-panel px-2 py-1 text-ink-2 transition-colors hover:border-ink hover:text-ink"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
