import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export function useWebEyeGaze({ enabled = true } = {}) {
  // We will expose this ref and attach it to a real <video> element
  const videoRef = useRef(null);
  const [isLooking, setIsLooking] = useState(false);
  const lastFaceTimeRef = useRef(null);
  const watchdogRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setIsLooking(false);
      return;
    }
    // 1. Safety check: If the user didn't attach the ref to a video, abort.
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
      // DEBUG: Uncomment this line to see if Mediapipe is actually running
      // console.log("Face detected:", results.multiFaceLandmarks.length > 0);
      
      const hasFace =
        results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0;

      if (hasFace) {
        lastFaceTimeRef.current = Date.now();
        setIsLooking((prev) => (!prev ? true : prev));
      }
    });

    // 2. Initialize Camera with the DOM element
    if (videoRef.current) {
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await faceMesh.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      Promise.resolve(cameraRef.current.start()).catch(() => {});
    }

    return () => {
      // Cleanup to prevent memory leaks or double-initialization
      if (cameraRef.current) cameraRef.current.stop();
      if (faceMesh) faceMesh.close();
    };
  }, [enabled]);

  // 3. Watchdog Timer (Heartbeat)
  useEffect(() => {
    if (!enabled) {
      setIsLooking(false);
      return;
    }
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

    return () => clearInterval(watchdogRef.current);
  }, [enabled]);

  return { isLooking, videoRef };
}
