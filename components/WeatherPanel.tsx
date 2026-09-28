"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDate, formatTime } from "@/lib/format";

type Weather = { tempC: number; description: string; windKph: number; observedAt: string };
type State =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "error"; message: string }
  | { kind: "success"; weather: Weather };

export default function WeatherPanel({ lat, lon }: { lat: number; lon: number }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const body = await res.json();
      if (!res.ok) {
        setState({ kind: "error", message: body?.error?.message ?? "Weather could not be loaded." });
      } else if (!body || typeof body.tempC !== "number") {
        setState({ kind: "empty" });
      } else {
        setState({ kind: "success", weather: body });
      }
    } catch {
      setState({ kind: "error", message: "Weather could not be loaded — check your connection." });
    }
  }, [lat, lon]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="panel" aria-live="polite">
      <h2>Weather at the trailhead</h2>
      {state.kind === "loading" && <p className="muted">Checking the current weather at the trailhead…</p>}
      {state.kind === "empty" && (
        <p className="muted">No weather reading is available for this spot right now. Try again later.</p>
      )}
      {state.kind === "error" && (
        <div className="state-error">
          <p>Weather failed to load: {state.message}</p>
          <button onClick={load}>Retry</button>
        </div>
      )}
      {state.kind === "success" && (
        <p>
          {state.weather.tempC}°C, {state.weather.description}, wind {state.weather.windKph} km/h
          <span className="muted">
            {" "}
            — observed {formatDate(state.weather.observedAt)} {formatTime(state.weather.observedAt)} UTC
          </span>
        </p>
      )}
    </section>
  );
}
