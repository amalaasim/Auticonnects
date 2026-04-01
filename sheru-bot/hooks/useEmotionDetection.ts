import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { assetUrl } from "../utils/assetUrls";

interface EmotionCounts {
  happy: number;
  neutral: number;
  sad: number;
  angry: number;
  surprised: number;
  fearful: number;
  disgusted: number;
}

interface EmotionDetectionReturn {
  currentEmotion: string;
  emotionCounts: EmotionCounts;
  emotionConfidence: number;
  sessionData: SessionData;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  emotionHistory: Array<{
    timestamp: number;
    emotion: string;
    confidence: number;
  }>;
  totalSamples: number;
}

export function useEmotionDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  enabled: boolean
): EmotionDetectionReturn {
  const [currentEmotion, setCurrentEmotion] = useState<string>("neutral");
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [emotionCounts, setEmotionCounts] = useState<EmotionCounts>({
    happy: 0,
    neutral: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    fearful: 0,
    disgusted: 0,
  });

  const modelsLoadedRef = useRef(false);
  const sessionDataRef = useRef<SessionData>({
    sessionId: `session_${Date.now()}`,
    startTime: Date.now(),
    emotionHistory: [],
    totalSamples: 0,
  });
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load face-api models once
  useEffect(() => {
    async function loadModels() {
      try {
        const MODEL_URL = assetUrl("/models/face-api");
        console.log("[EmotionDetection] Loading face-api models...");

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        modelsLoadedRef.current = true;
        console.log("[EmotionDetection] ✅ Models loaded successfully");
      } catch (error) {
        console.error("[EmotionDetection] ❌ Failed to load models:", error);
      }
    }

    loadModels();
  }, []);

  // Emotion detection loop
  useEffect(() => {
    if (!enabled) {
      console.log("[EmotionDetection] Disabled");
      return;
    }

    if (!videoRef.current) {
      console.log("[EmotionDetection] Video ref not available");
      return;
    }

    if (!modelsLoadedRef.current) {
      console.log("[EmotionDetection] Models not loaded yet");
      return;
    }

    console.log("[EmotionDetection] Starting emotion detection...");

    // Detect emotions every 2 seconds
    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      try {
        const detections = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
          )
          .withFaceExpressions();

        if (!detections || !detections.expressions) {
          console.log("[EmotionDetection] No face detected");
          return;
        }

        const expressions = detections.expressions;

        // Find dominant emotion
        const emotionEntries = Object.entries(expressions);
        const [dominantEmotion, confidence] = emotionEntries.reduce(
          (max, curr) => (curr[1] > max[1] ? curr : max),
          ["neutral", 0]
        );

        // Update current emotion
        setCurrentEmotion(dominantEmotion);
        setEmotionConfidence(confidence as number);

        // Update emotion counts
        setEmotionCounts((prev) => ({
          ...prev,
          [dominantEmotion]: prev[dominantEmotion] + 1,
        }));

        // Save to session history
        sessionDataRef.current.emotionHistory.push({
          timestamp: Date.now(),
          emotion: dominantEmotion,
          confidence: confidence as number,
        });
        sessionDataRef.current.totalSamples += 1;

        console.log(`[EmotionDetection] 😊 Detected: ${dominantEmotion} (${(confidence * 100).toFixed(1)}%)`);
      } catch (error) {
        console.error("[EmotionDetection] Detection error:", error);
      }
    }, 2000); // Every 2 seconds

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      console.log("[EmotionDetection] Stopped");
    };
  }, [enabled, videoRef]);

  return {
    currentEmotion,
    emotionConfidence,
    emotionCounts,
    sessionData: sessionDataRef.current,
  };
}
