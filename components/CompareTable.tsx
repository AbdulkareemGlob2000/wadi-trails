"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseCompareIds, type ComparedTrail } from "@/lib/compare";
import { formatDate, formatMoney } from "@/lib/format";

type State =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "error"; message: string }
  | { kind: "success"; trails: ComparedTrail[] };

const ROWS: { label: string; cell: (t: ComparedTrail) => React.ReactNode }[] = [
  { label: "Region", cell: (t) => t.regionName },
  { label: "Distance", cell: (t) => `${t.distanceKm} km` },
  { label: "Elevation gain", cell: (t) => `${t.elevationGainM} m` },
  { label: "Difficulty", cell: (t) => t.difficulty },
  { label: "Entry fee", cell: (t) => formatMoney(t.entryFee.amount, t.entryFee.currency) },
  { label: "Last surveyed", cell: (t) => formatDate(t.lastSurveyed) },
  {
    label: "Weather now",
    cell: (t) =>
      t.weather ? `${t.weather.tempC}°C, ${t.weather.description}, wind ${t.weather.windKph} km/h` : "Weather unavailable",
  },
];

export default function CompareTable() {
  const [state, setState] = useState<State>({ kind: "loading" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    const ids = parseCompareIds(new URLSearchParams(window.location.search).get("ids"));
    if (!ids) return setState({ kind: "empty" });
    try {
      const res = await fetch(`/api/compare?ids=${encodeURIComponent(ids.join(","))}`);
      const body = await res.json().catch(() => null);
      if (res.status === 400 && body?.error?.code === "COMPARE_BAD_IDS") return setState({ kind: "empty" });
      if (!res.ok || !Array.isArray(body?.trails)) {
        return setState({ kind: "error", message: body?.error?.message ?? "The comparison could not be loaded." });
      }
      setState({ kind: "success", trails: body.trails });
    } catch {
      setState({ kind: "error", message: "The comparison could not be loaded — check your connection." });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return <div aria-live="polite">{renderState()}</div>;

  function renderState() {
  if (state.kind === "loading") return <p className="muted">Loading the comparison…</p>;
  if (state.kind === "empty")
    return (
      <p className="muted">
        Pick two or three trails to compare. <Link href="/favourites">Go to your favourites</Link>
      </p>
    );
  if (state.kind === "error")
    return (
      <div className="state-error">
        <p>Comparison failed: {state.message}</p>
        <button onClick={load}>Retry</button>
      </div>
    );

  return (
    <div className="table-wrap">
      <table className="compare">
        <caption>Comparing {state.trails.length} trails</caption>
        <thead>
          <tr>
            <td />
            {state.trails.map((t) => (
              <th key={t.id} scope="col">
                <Link href={`/trails/${t.id}`}>{t.name}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {state.trails.map((t) => (
                <td key={t.id}>{row.cell(t)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  }
}
