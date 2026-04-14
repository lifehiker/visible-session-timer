import type { TimerConfig, Segment } from "@/types/timer";

/** Format seconds to MM:SS or HH:MM:SS */
export function formatTime(totalSeconds: number): string {
  const absSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) {
    return String(hours).padStart(2, "0") + ":" + mm + ":" + ss;
  }
  return mm + ":" + ss;
}

/** Compute total duration of a timer config in seconds */
export function computeTotalDuration(config: TimerConfig): number {
  if (config.mode === "segments" && config.segments) {
    const segmentTotal = config.segments.reduce((sum, seg) => sum + seg.durationSec, 0);
    return segmentTotal * (config.rounds ?? 1);
  }
  if (config.mode === "countdown") {
    return config.durationSec ?? 0;
  }
  return 0;
}

/** Flatten segments across all rounds */
export function flattenSegments(config: TimerConfig): Array<Segment & { round: number }> {
  if (config.mode !== "segments" || !config.segments) return [];
  const rounds = config.rounds ?? 1;
  const result: Array<Segment & { round: number }> = [];
  for (let r = 1; r <= rounds; r++) {
    for (const seg of config.segments) {
      result.push({ ...seg, round: r });
    }
  }
  return result;
}

/** Serialize TimerConfig to URL search params */
export function serializeConfigToParams(config: TimerConfig): URLSearchParams {
  const params = new URLSearchParams();
  params.set("mode", config.mode);
  if (config.label) params.set("label", config.label);
  if (config.durationSec !== undefined) params.set("dur", String(config.durationSec));
  if (config.rounds !== undefined) params.set("rounds", String(config.rounds));
  params.set("sound", config.soundEnabled ? "1" : "0");
  params.set("flash", config.flashEnabled ? "1" : "0");
  params.set("theme", config.theme);
  if (config.segments && config.segments.length > 0) {
    params.set("segs", JSON.stringify(config.segments));
  }
  return params;
}

/** Parse TimerConfig from URL search params */
export function parseConfigFromParams(
  params: URLSearchParams | Record<string, string>
): Partial<TimerConfig> {
  const get = (key: string) =>
    params instanceof URLSearchParams ? params.get(key) : params[key];
  const config: Partial<TimerConfig> = {
    soundEnabled: get("sound") !== "0",
    flashEnabled: get("flash") !== "0",
    theme: (get("theme") as TimerConfig["theme"]) ?? "dark",
  };
  const mode = get("mode");
  if (mode === "countdown" || mode === "countup" || mode === "segments") {
    config.mode = mode;
  }
  if (get("label")) config.label = get("label") as string;
  if (get("dur")) config.durationSec = parseInt(get("dur") as string, 10);
  if (get("rounds")) config.rounds = parseInt(get("rounds") as string, 10);
  if (get("segs")) {
    try { config.segments = JSON.parse(get("segs") as string); } catch { config.segments = []; }
  }
  return config;
}

/** Default timer config */
export function defaultTimerConfig(): TimerConfig {
  return { mode: "countdown", durationSec: 300, soundEnabled: true, flashEnabled: true, theme: "dark" };
}