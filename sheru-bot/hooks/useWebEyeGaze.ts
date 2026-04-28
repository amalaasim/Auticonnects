import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { assetUrl } from "../utils/assetUrls";

export function useWebEyeGaze() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);
  const modelsLoadedRef = useRef(false);
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadModels = async () => {
      try {
        const modelUrl = assetUrl("/models/face-api");
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
        if (!cancelled) {
          modelsLoadedRef.current = true;
        }
      } catch (error) {
        console.error("[EyeGaze] Failed to load face-api model:", error);
        if (!cancelled) {
          setCameraAvailable(false);
        }
      }
    };

    void loadModels();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraAvailable(false);
      return;
    }

    let cancelled = false;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (cancelled || !videoRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraAvailable(true);
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;

        await videoRef.current.play().catch(() => undefined);
      } catch (error) {
        console.error("[EyeGaze] Camera start failed:", error);
        if (mountedRef.current) {
          setIsLooking(false);
          setCameraAvailable(false);
        }
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    detectionIntervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || !modelsLoadedRef.current) return;
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        return;
      }

      try {
        const detection = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.35 })
        );

        if (!mountedRef.current) return;
        setIsLooking(Boolean(detection));
      } catch (error) {
        console.error("[EyeGaze] Detection error:", error);
        if (mountedRef.current) {
          setIsLooking(false);
        }
      }
    }, 700);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, []);

  return { isLooking, videoRef, cameraAvailable };
}
