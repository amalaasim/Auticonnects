import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export function useEmotionModel({ enabled, videoRef, currentSceneId }) {
  const [emotionCounts, setEmotionCounts] = useState({
    happy: 0,
    neutral: 0,
    sad: 0,
    angry: 0,
  });

  const lastSampleRef = useRef(0);
  const modelsLoadedRef = useRef(false);

  const sampleEmotion = async () => {
    if (!enabled) return false;
    if (!videoRef.current) return false;
    if (!modelsLoadedRef.current) return false;

    let detections = null;
    try {
      detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();
    } catch (_) {
      return false;
    }

    if (!detections || !detections.expressions) return false;

    const expressions = detections.expressions;

    const dominantEmotion = Object.entries(expressions).reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ["neutral", 0]
    )[0];

    setEmotionCounts((prev) => ({
      ...prev,
      [dominantEmotion]: prev[dominantEmotion] + 1,
    }));

    return true;
  };

  // Load face-api models once
  useEffect(() => {
    async function loadModels() {
      if (!enabled || modelsLoadedRef.current) return;
      const MODEL_URL = "/models/face-api";

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
      } catch (_) {
        return;
      }

      modelsLoadedRef.current = true;
      console.log("[EmotionModel] face-api models loaded");
    }

    loadModels();
  }, [enabled]);

  // Emotion sampling loop
  useEffect(() => {
    if (!enabled) return;
    if (!videoRef.current) return;
    if (!modelsLoadedRef.current) return;

    let intervalId = null;

    intervalId = setInterval(async () => {
      const now = Date.now();
      if (now - lastSampleRef.current < 10000) return; // 10s sampling

      lastSampleRef.current = now;

      await sampleEmotion();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [enabled, currentSceneId]);

  return { emotionCounts, sampleEmotion };
}
