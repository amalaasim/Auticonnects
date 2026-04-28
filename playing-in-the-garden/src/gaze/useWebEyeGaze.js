import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export function useWebEyeGaze({ enabled = true } = {}) {
  // We will expose this ref and attach it to a real <video> element
  const videoRef = useRef(null);
  const [isLooking, setIsLooking] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const lastFaceTimeRef = useRef(null);
  const watchdogRef = useRef(null);
  const cameraRef = useRef(null);
  const cameraStateIntervalRef = useRef(null);

  const updateCameraAvailability = () => {
    const video = videoRef.current;
    const stream = video?.srcObject;
    const tracks =
      stream && typeof stream.getVideoTracks === "function"
        ? stream.getVideoTracks()
        : [];
    const hasLiveTrack = tracks.some(
      (track) => track.readyState === "live" && !track.muted
    );
    const isVideoActive =
      Boolean(video) &&
      !video.paused &&
      video.readyState >= 2 &&
      video.videoWidth > 0 &&
      video.videoHeight > 0;

    const isAvailable = hasLiveTrack && isVideoActive;
    setCameraAvailable(isAvailable);
    if (!isAvailable) {
      setIsLooking(false);
    }

    return isAvailable;
  };

  useEffect(() => {
    if (!enabled) return;
    // 1. Safety check: If the user didn't attach the ref to a video, abort.
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    let removeTrackListeners = [];

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

      cameraRef.current
        .start()
        .then(() => {
          const stream = videoRef.current?.srcObject;
          const tracks =
            stream && typeof stream.getVideoTracks === "function"
              ? stream.getVideoTracks()
              : [];

          removeTrackListeners = tracks.flatMap((track) => {
            const listener = () => updateCameraAvailability();
            track.addEventListener("ended", listener);
            track.addEventListener("mute", listener);
            track.addEventListener("unmute", listener);
            return [
              () => track.removeEventListener("ended", listener),
              () => track.removeEventListener("mute", listener),
              () => track.removeEventListener("unmute", listener),
            ];
          });

          updateCameraAvailability();
          cameraStateIntervalRef.current = window.setInterval(
            updateCameraAvailability,
            1000
          );
          setCameraPermissionDenied(false);
        })
        .catch(() => {
          setCameraAvailable(false);
          setCameraPermissionDenied(true);
          setIsLooking(false);
        });
    }

    return () => {
      // Cleanup to prevent memory leaks or double-initialization
      removeTrackListeners.forEach((remove) => remove());
      if (cameraStateIntervalRef.current) {
        clearInterval(cameraStateIntervalRef.current);
        cameraStateIntervalRef.current = null;
      }
      if (cameraRef.current) cameraRef.current.stop();
      if (faceMesh) faceMesh.close();
      setCameraAvailable(false);
      setIsLooking(false);
    };
  }, [enabled]); // Run once on mount

  // 3. Watchdog Timer (Heartbeat)
  useEffect(() => {
    if (!enabled || !cameraAvailable) return;

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
  }, [cameraAvailable, enabled]);

  return { isLooking, videoRef, cameraAvailable, cameraPermissionDenied };
}
