import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function getWonderworldEmotionScore(expressions) {
  const scores = {
    happy: expressions.happy || 0,
    neutral: (expressions.neutral || 0) * 0.42,
    sad: (expressions.sad || 0) * 1.3 + (expressions.fearful || 0) * 1.15,
    angry: (expressions.angry || 0) * 1.35 + (expressions.disgusted || 0) * 1.2,
  };

  const [emotion, score] = Object.entries(scores).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["neutral", 0]
  );

  return { emotion, score, scores };
}

export function useEmotionModel({ enabled, videoRef, currentSceneId }) {
  const [emotionCounts, setEmotionCounts] = useState({
    happy: 0,
    neutral: 0,
    sad: 0,
    angry: 0,
  });
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [emotionConfidence, setEmotionConfidence] = useState(0);
  const [modelsReady, setModelsReady] = useState(false);

  const modelsLoadedRef = useRef(false);
  const detectionIntervalRef = useRef(null);
  const recentExpressionsRef = useRef([]);

  const sampleEmotion = async () => {
    if (!enabled) return false;
    if (!videoRef.current) return false;
    if (!modelsLoadedRef.current) return false;

    let detections = null;
    try {
      detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
        )
        .withFaceExpressions();
    } catch (_) {
      return false;
    }

    if (!detections || !detections.expressions) return false;

    recentExpressionsRef.current = [
      ...recentExpressionsRef.current,
      detections.expressions,
    ].slice(-4);

    const averagedExpressions = recentExpressionsRef.current.reduce(
      (acc, item) => {
        Object.entries(item).forEach(([key, value]) => {
          acc[key] = (acc[key] || 0) + value;
        });
        return acc;
      },
      {}
    );

    Object.keys(averagedExpressions).forEach((key) => {
      averagedExpressions[key] =
        averagedExpressions[key] / recentExpressionsRef.current.length;
    });

    const { emotion: dominantEmotion, score, scores } = getWonderworldEmotionScore(averagedExpressions);
    const totalScore = Object.values(scores).reduce((sum, value) => sum + value, 0) || 1;
    const confidence = Math.min(1, score / totalScore);

    setCurrentEmotion(dominantEmotion);
    setEmotionConfidence(confidence);

    setEmotionCounts((prev) => ({
      ...prev,
      [dominantEmotion]: prev[dominantEmotion] + 1,
    }));

    return true;
  };

  // Load face-api models once
  useEffect(() => {
    async function loadModels() {
      if (modelsLoadedRef.current) return;
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
      setModelsReady(true);
      console.log("[EmotionModel] face-api models loaded");
    }

    loadModels();
  }, [enabled]);

  // Emotion sampling loop
  useEffect(() => {
    if (!enabled) return;
    if (!videoRef.current) return;
    if (!modelsLoadedRef.current || !modelsReady) return;

    detectionIntervalRef.current = setInterval(async () => {
      await sampleEmotion();
    }, 2000);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      recentExpressionsRef.current = [];
    };
  }, [enabled, currentSceneId, modelsReady]);

  return { emotionCounts, sampleEmotion, currentEmotion, emotionConfidence };
}
