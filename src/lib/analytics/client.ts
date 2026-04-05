import { supabase } from "../../integrations/supabase/client";
import type { FinishSessionInput, StartSessionInput } from "./types";

async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function startSession(input: StartSessionInput) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot start analytics session without an authenticated user.");
  }

  const payload = {
    user_id: userId,
    game_key: input.gameKey,
    module_key: input.moduleKey,
    source_app: input.sourceApp,
    language: input.language ?? null,
    started_at: input.startedAt ?? new Date().toISOString(),
    status: "completed" as const,
  };

  const { data, error } = await supabase
    .from("game_sessions")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw error;

  return data.id as string;
}

export async function finishSession(input: FinishSessionInput) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Cannot finish analytics session without an authenticated user.");
  }

  const endedAtIso = input.endedAt ?? new Date().toISOString();

  const { data: existingSession, error: fetchError } = await supabase
    .from("game_sessions")
    .select("started_at")
    .eq("id", input.sessionId)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw fetchError;

  const durationSeconds = Math.max(
    0,
    Math.round(
      (new Date(endedAtIso).getTime() - new Date(existingSession.started_at).getTime()) / 1000
    )
  );

  const { error: updateError } = await supabase
    .from("game_sessions")
    .update({
      ended_at: endedAtIso,
      duration_seconds: durationSeconds,
      status: input.status,
      ...input.resultMetrics,
    })
    .eq("id", input.sessionId)
    .eq("user_id", userId);

  if (updateError) throw updateError;

  const emotionRows = Object.entries(input.emotionCounts || {})
    .filter(([, sampleCount]) => Number(sampleCount) > 0)
    .map(([emotion, sample_count]) => ({
      session_id: input.sessionId,
      user_id: userId,
      emotion,
      sample_count,
    }));

  if (emotionRows.length) {
    const { error: emotionError } = await supabase
      .from("session_emotion_metrics")
      .upsert(emotionRows, { onConflict: "session_id,emotion" });

    if (emotionError) throw emotionError;
  }

  if (input.focusMetrics) {
    const { error: focusError } = await supabase
      .from("session_focus_metrics")
      .upsert(
        {
          session_id: input.sessionId,
          user_id: userId,
          ...input.focusMetrics,
        },
        { onConflict: "session_id" }
      );

    if (focusError) throw focusError;
  }
}
