import type { ModuleKey, SessionFocusMetric } from "./types";

const STORAGE_PREFIX = "analytics:wonderworld";

interface StoredWonderworldSession {
  sessionId: string;
  moduleKey: ModuleKey;
  startedAt: string;
  language: string | null;
  emotionCounts: Record<string, number>;
  focusMetrics: SessionFocusMetric | null;
}

function getStorageKey(moduleKey: ModuleKey) {
  return `${STORAGE_PREFIX}:${moduleKey}`;
}

export function getWonderworldSessionState(moduleKey: ModuleKey): StoredWonderworldSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(getStorageKey(moduleKey));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setWonderworldSessionState(
  moduleKey: ModuleKey,
  value: StoredWonderworldSession
) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(getStorageKey(moduleKey), JSON.stringify(value));
}

export function clearWonderworldSessionState(moduleKey: ModuleKey) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(getStorageKey(moduleKey));
}

export function ensureWonderworldSessionState(
  moduleKey: ModuleKey,
  sessionId: string,
  language: string | null
) {
  const existing = getWonderworldSessionState(moduleKey);
  if (existing) return existing;

  const next: StoredWonderworldSession = {
    sessionId,
    moduleKey,
    startedAt: new Date().toISOString(),
    language,
    emotionCounts: {},
    focusMetrics: null,
  };

  setWonderworldSessionState(moduleKey, next);
  return next;
}

export function updateWonderworldEmotionCounts(
  moduleKey: ModuleKey,
  emotionCounts: Record<string, number>
) {
  const existing = getWonderworldSessionState(moduleKey);
  if (!existing) return;

  setWonderworldSessionState(moduleKey, {
    ...existing,
    emotionCounts,
  });
}

export function updateWonderworldFocusMetrics(
  moduleKey: ModuleKey,
  focusMetrics: SessionFocusMetric
) {
  const existing = getWonderworldSessionState(moduleKey);
  if (!existing) return;

  setWonderworldSessionState(moduleKey, {
    ...existing,
    focusMetrics,
  });
}

export function consumeWonderworldSessionState(moduleKey: ModuleKey) {
  const existing = getWonderworldSessionState(moduleKey);
  if (!existing) return null;
  clearWonderworldSessionState(moduleKey);
  return existing;
}
