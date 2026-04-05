import type { ModuleKey, SessionFocusMetric, SessionResultMetrics } from "./types";

export function buildWonderworldResultMetrics(
  voiceTries: number,
  selectTries: number,
  starCount: number
): SessionResultMetrics {
  const totalTries = voiceTries + selectTries;
  const successCount = 3;
  const completionPercent =
    totalTries > 0 ? Math.round((successCount / totalTries) * 100) : 0;

  return {
    voice_tries: voiceTries,
    select_tries: selectTries,
    total_tries: totalTries,
    star_count: starCount,
    completion_percent: completionPercent,
  };
}

export function resolveWonderworldModuleFromRoute(from?: string): ModuleKey {
  switch (from) {
    case "findcar":
      return "car";
    case "findball":
      return "ball";
    case "findshoe":
      return "shoe";
    case "find":
    default:
      return "cookie";
  }
}

export function calculateFocusRatio(focusTimeMs: number, distractedTimeMs: number) {
  const total = focusTimeMs + distractedTimeMs;
  if (total <= 0) return 0;
  return Number((focusTimeMs / total).toFixed(4));
}

export function normalizeFocusMetrics(
  focusTimeMs = 0,
  distractedTimeMs = 0,
  distractionCount = 0
): SessionFocusMetric {
  return {
    focus_time_ms: Math.max(0, Math.round(focusTimeMs)),
    distracted_time_ms: Math.max(0, Math.round(distractedTimeMs)),
    distraction_count: Math.max(0, Math.round(distractionCount)),
    focus_ratio: calculateFocusRatio(focusTimeMs, distractedTimeMs),
  };
}
