"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Trail } from "@/data/catalogue";
import { filterTrails } from "@/lib/search";
import { formatMoney } from "@/lib/format";

export default function TrailSearch({ regionName, trails }: { regionName: string; trails: Trail[] }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery((new URLSearchParams(window.location.search).get("q") ?? "").slice(0, 60));
  }, []);

  function update(next: string) {
    setQuery(next);
    const url = new URL(window.location.href);
    if (next.trim()) url.searchParams.set("q", next.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }

  const matches = filterTrails(trails, query);

  return (
    <>
      <div className="search">
        <label htmlFor="trail-search">Search trails in {regionName}</label>
        <input
          id="trail-search"
          type="search"
          maxLength={60}
          value={query}
          onChange={(e) => update(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && update("")}
        />
        <p className="muted" aria-live="polite">
          {matches.length} of {trails.length} trails
        </p>
      </div>
      {matches.length === 0 ? (
        <div>
          <p className="muted">
            No trails in {regionName} match &quot;{query.trim()}&quot;.
          </p>
          <button onClick={() => update("")}>Clear search</button>
        </div>
      ) : (
        <ul className="grid">
          {matches.map((t) => (
            <li key={t.id} className="card">
              <img src={t.image.src} alt={t.image.alt} width={t.image.width} height={t.image.height} />
              <Link href={`/trails/${t.id}`}>
                <h2>{t.name}</h2>
                <p className="muted">{t.summary}</p>
                <p>
                  {t.distanceKm} km · {t.difficulty} · {formatMoney(t.entryFee.amount, t.entryFee.currency)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
