import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export function useWebEyeGaze() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLooking, setIsLooking] = useState(false);
  const lastFaceTimeRef = useRef<number | null>(null);
  const watchdogRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const hasFace =
        results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0;

      if (hasFace) {
        lastFaceTimeRef.current = Date.now();
        setIsLooking((prev) => (!prev ? true : prev));
      }
    });

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    Promise.resolve(cameraRef.current.start()).catch((error: unknown) => {
      console.error("Camera start failed:", error);
    });

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      faceMesh.close();
    };
  }, []);

  useEffect(() => {
    watchdogRef.current = setInterval(() => {
      const now = Date.now();
      const timeoutThreshold = 1000;
      const timeSinceLastFace = lastFaceTimeRef.current
        ? now - lastFaceTimeRef.current
        : timeoutThreshold + 1;

      if (timeSinceLastFace > timeoutThreshold) {
        setIsLooking((prev) => (prev ? false : prev));
      }
    }, 500);

    return () => {
      if (watchdogRef.current) {
        clearInterval(watchdogRef.current);
      }
    };
  }, []);

  return { isLooking, videoRef };
}
