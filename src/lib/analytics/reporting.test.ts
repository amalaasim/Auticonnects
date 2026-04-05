import {
  aggregateDailySessionTime,
  aggregateWeeklyEmotions,
  buildFocusPatternRows,
  buildModuleProgressRows,
} from "./reporting";

const sessions = [
  {
    id: "1",
    user_id: "u1",
    game_key: "wonderworld",
    module_key: "cookie",
    source_app: "main-app",
    started_at: "2026-04-01T10:00:00.000Z",
    ended_at: "2026-04-01T10:10:00.000Z",
    duration_seconds: 600,
    language: "en",
    status: "completed",
    voice_tries: 1,
    select_tries: 1,
    total_tries: 2,
    star_count: 3,
    completion_percent: 100,
    score_percent: null,
    engagement_level: null,
    gaze_reminders: null,
  },
  {
    id: "2",
    user_id: "u1",
    game_key: "garden_story",
    module_key: "garden_story",
    source_app: "garden-story",
    started_at: "2026-04-02T10:00:00.000Z",
    ended_at: "2026-04-02T10:20:00.000Z",
    duration_seconds: 1200,
    language: "en",
    status: "completed",
    voice_tries: null,
    select_tries: null,
    total_tries: null,
    star_count: null,
    completion_percent: null,
    score_percent: 80,
    engagement_level: "High",
    gaze_reminders: 1,
  },
];

describe("reporting aggregations", () => {
  it("aggregates daily session time", () => {
    const rows = aggregateDailySessionTime(sessions as any, 3, new Date("2026-04-02T12:00:00.000Z"));
    expect(rows.map((row) => row.durationSeconds)).toEqual([0, 600, 1200]);
  });

  it("aggregates weekly emotions across eligible sessions", () => {
    const rows = aggregateWeeklyEmotions(
      [
        { session_id: "1", emotion: "happy", sample_count: 2 },
        { session_id: "2", emotion: "neutral", sample_count: 3 },
      ],
      sessions as any,
      new Date("2026-04-02T12:00:00.000Z")
    );

    expect(rows).toEqual([
      { emotion: "neutral", sampleCount: 3, percentage: 60 },
      { emotion: "happy", sampleCount: 2, percentage: 40 },
    ]);
  });

  it("builds focus pattern rows by session", () => {
    const rows = buildFocusPatternRows(sessions as any, [
      {
        session_id: "2",
        focus_time_ms: 10000,
        distracted_time_ms: 5000,
        distraction_count: 1,
        focus_ratio: 0.6667,
      },
    ]);

    expect(rows[0].sessionId).toBe("2");
    expect(rows[0].focus?.focus_time_ms).toBe(10000);
  });

  it("builds module progress using best score and last played", () => {
    const rows = buildModuleProgressRows(sessions as any);
    expect(rows).toEqual([
      {
        moduleKey: "ball",
        completed: false,
        bestScore: null,
        lastPlayed: null,
      },
      {
        moduleKey: "car",
        completed: false,
        bestScore: null,
        lastPlayed: null,
      },
      {
        moduleKey: "cookie",
        completed: true,
        bestScore: 3,
        lastPlayed: "2026-04-01T10:10:00.000Z",
      },
      {
        moduleKey: "garden_story",
        completed: true,
        bestScore: 80,
        lastPlayed: "2026-04-02T10:20:00.000Z",
      },
      {
        moduleKey: "shoe",
        completed: false,
        bestScore: null,
        lastPlayed: null,
      },
    ]);
  });
});
