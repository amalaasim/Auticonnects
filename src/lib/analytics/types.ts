export type GameKey = "wonderworld" | "garden_story" | "sheru_bot";

export type ModuleKey =
  | "cookie"
  | "car"
  | "shoe"
  | "ball"
  | "garden_story"
  | "sheru_bot";

export type SessionStatus = "completed" | "abandoned";

export interface SessionResultMetrics {
  voice_tries?: number | null;
  select_tries?: number | null;
  total_tries?: number | null;
  star_count?: number | null;
  completion_percent?: number | null;
  score_percent?: number | null;
  engagement_level?: string | null;
  gaze_reminders?: number | null;
}

export interface SessionEmotionMetric {
  emotion: string;
  sample_count: number;
}

export interface SessionFocusMetric {
  focus_time_ms: number;
  distracted_time_ms: number;
  distraction_count: number;
  focus_ratio: number;
}

export interface StartSessionInput {
  gameKey: GameKey;
  moduleKey: ModuleKey;
  sourceApp: string;
  language?: string | null;
  startedAt?: string;
}

export interface FinishSessionInput {
  sessionId: string;
  endedAt?: string;
  status: SessionStatus;
  resultMetrics?: SessionResultMetrics;
  emotionCounts?: Record<string, number>;
  focusMetrics?: SessionFocusMetric | null;
}

export interface AnalyticsSessionRecord {
  id: string;
  user_id: string;
  game_key: GameKey;
  module_key: ModuleKey;
  source_app: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  language: string | null;
  status: SessionStatus;
  voice_tries: number | null;
  select_tries: number | null;
  total_tries: number | null;
  star_count: number | null;
  completion_percent: number | null;
  score_percent: number | null;
  engagement_level: string | null;
  gaze_reminders: number | null;
}
