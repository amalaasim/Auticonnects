import type { AnalyticsSessionRecord } from "./types";

const REPORT_MODULE_KEYS = ["ball", "car", "cookie", "garden_story", "shoe"] as const;

export interface EmotionMetricRow {
  session_id: string;
  emotion: string;
  sample_count: number;
  created_at?: string;
}

export interface FocusMetricRow {
  session_id: string;
  focus_time_ms: number;
  distracted_time_ms: number;
  distraction_count: number;
  focus_ratio: number;
}

function toLocalDayKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLastNDates(days: number, now = new Date()) {
  const dates: string[] = [];
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  for (let index = days - 1; index >= 0; index -= 1) {
    const next = new Date(cursor);
    next.setDate(cursor.getDate() - index);
    dates.push(toLocalDayKey(next));
  }

  return dates;
}

export function aggregateDailySessionTime(
  sessions: AnalyticsSessionRecord[],
  days = 7,
  now = new Date()
) {
  const buckets = new Map(getLastNDates(days, now).map((date) => [date, 0]));

  sessions.forEach((session) => {
    if (!session.ended_at || session.duration_seconds == null) return;
    const dayKey = toLocalDayKey(session.ended_at);
    if (!buckets.has(dayKey)) return;
    buckets.set(dayKey, (buckets.get(dayKey) || 0) + session.duration_seconds);
  });

  return Array.from(buckets.entries()).map(([date, durationSeconds]) => ({
    date,
    durationSeconds,
  }));
}

export function aggregateWeeklyEmotions(
  emotionRows: EmotionMetricRow[],
  sessions: AnalyticsSessionRecord[],
  now = new Date()
) {
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const eligibleSessionIds = new Set(
    sessions
      .filter((session) => session.ended_at && new Date(session.ended_at) >= sevenDaysAgo)
      .map((session) => session.id)
  );

  const totals = new Map<string, number>();

  emotionRows.forEach((row) => {
    if (!eligibleSessionIds.has(row.session_id)) return;
    totals.set(row.emotion, (totals.get(row.emotion) || 0) + row.sample_count);
  });

  const totalSamples = Array.from(totals.values()).reduce((sum, value) => sum + value, 0);

  return Array.from(totals.entries())
    .map(([emotion, sampleCount]) => ({
      emotion,
      sampleCount,
      percentage: totalSamples > 0 ? Number(((sampleCount / totalSamples) * 100).toFixed(1)) : 0,
    }))
    .sort((left, right) => right.sampleCount - left.sampleCount);
}

export function buildFocusPatternRows(
  sessions: AnalyticsSessionRecord[],
  focusRows: FocusMetricRow[]
) {
  const focusBySessionId = new Map(focusRows.map((row) => [row.session_id, row]));

  return sessions
    .filter((session) => session.ended_at)
    .map((session) => ({
      sessionId: session.id,
      endedAt: session.ended_at as string,
      gameKey: session.game_key,
      moduleKey: session.module_key,
      durationSeconds: session.duration_seconds ?? 0,
      focus: focusBySessionId.get(session.id) || null,
    }))
    .filter(
      (row) =>
        row.focus &&
        (
          row.focus.focus_time_ms > 0 ||
          row.focus.distracted_time_ms > 0 ||
          row.focus.distraction_count > 0 ||
          row.focus.focus_ratio > 0
        )
    )
    .sort((left, right) => new Date(right.endedAt).getTime() - new Date(left.endedAt).getTime());
}

export function buildModuleProgressRows(sessions: AnalyticsSessionRecord[]) {
  const rows = new Map<string, {
    moduleKey: string;
    completed: boolean;
    bestScore: number | null;
    lastPlayed: string | null;
  }>();

  sessions.forEach((session) => {
    if (!REPORT_MODULE_KEYS.includes(session.module_key as (typeof REPORT_MODULE_KEYS)[number])) {
      return;
    }

    const existing = rows.get(session.module_key) || {
      moduleKey: session.module_key,
      completed: false,
      bestScore: null,
      lastPlayed: null,
    };

    const rawScore = session.star_count ?? session.score_percent ?? null;
    const bestScore =
      rawScore == null
        ? existing.bestScore
        : existing.bestScore == null
          ? rawScore
          : Math.max(existing.bestScore, rawScore);

    const lastPlayed =
      !session.ended_at
        ? existing.lastPlayed
        : !existing.lastPlayed
          ? session.ended_at
          : new Date(session.ended_at) > new Date(existing.lastPlayed)
            ? session.ended_at
            : existing.lastPlayed;

    rows.set(session.module_key, {
      moduleKey: session.module_key,
      completed: existing.completed || session.status === "completed",
      bestScore,
      lastPlayed,
    });
  });

  REPORT_MODULE_KEYS.forEach((moduleKey) => {
    if (rows.has(moduleKey)) return;

    rows.set(moduleKey, {
      moduleKey,
      completed: false,
      bestScore: null,
      lastPlayed: null,
    });
  });

  return Array.from(rows.values()).sort((left, right) =>
    left.moduleKey.localeCompare(right.moduleKey)
  );
}
