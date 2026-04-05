import { useCallback, useEffect, useRef } from "react";
import { normalizeFocusMetrics } from "@/lib/analytics/mappers";

interface UseAttentionMetricsInput {
  enabled: boolean;
  isLooking: boolean;
}

export function useAttentionMetrics({ enabled, isLooking }: UseAttentionMetricsInput) {
  const focusTimeRef = useRef(0);
  const distractedTimeRef = useRef(0);
  const distractionCountRef = useRef(0);
  const lastChangeRef = useRef<number | null>(null);
  const previousLookingRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!enabled) {
      focusTimeRef.current = 0;
      distractedTimeRef.current = 0;
      distractionCountRef.current = 0;
      lastChangeRef.current = null;
      previousLookingRef.current = null;
      return;
    }

    const now = Date.now();

    if (lastChangeRef.current == null) {
      lastChangeRef.current = now;
      previousLookingRef.current = isLooking;
      return;
    }

    const previousLooking = previousLookingRef.current;
    const elapsed = now - lastChangeRef.current;

    if (previousLooking === true) {
      focusTimeRef.current += elapsed;
    } else if (previousLooking === false) {
      distractedTimeRef.current += elapsed;
    }

    if (previousLooking === true && isLooking === false) {
      distractionCountRef.current += 1;
    }

    previousLookingRef.current = isLooking;
    lastChangeRef.current = now;
  }, [enabled, isLooking]);

  const getMetrics = useCallback(() => {
    if (!enabled) {
      return normalizeFocusMetrics(0, 0, 0);
    }

    const now = Date.now();
    const lastChange = lastChangeRef.current;
    const previousLooking = previousLookingRef.current;
    let focusTime = focusTimeRef.current;
    let distractedTime = distractedTimeRef.current;

    if (lastChange != null && previousLooking != null) {
      const elapsed = now - lastChange;
      if (previousLooking) {
        focusTime += elapsed;
      } else {
        distractedTime += elapsed;
      }
    }

    return normalizeFocusMetrics(
      focusTime,
      distractedTime,
      distractionCountRef.current
    );
  }, [enabled]);

  return { getMetrics };
}
