import * as React from 'react';
import { Box,Typography } from '@mui/material';
import learnbg from '../assests/learn_bg.png';
import cartoon from '../assests/talking.gif';
import standinglion from '../assests/standinglion-loop.gif';
import board from '../assests/findbg.png';
import car from '../assests/carr.png';
import ball from '../assests/red.png';
import { useEffect, useRef } from "react";
import cookies from '../assests/fullc.png';
import click from '../assests/click.png';
import { useNavigate } from "react-router-dom";
import backbg from '../assests/backbg.png';
import bg from '../assests/greenbg.png';
import voice from '../assests/voice.png';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import i18n from "../i18n";
import yes from '../assests/yesball.mpeg';
import no from '../assests/noball.mpeg';
import findCookie from '../assests/findball.mpeg'
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import findurdu from '../assests/findballurdu.ogg';
import yesurdu from '../assests/yesbiscuiturdu.ogg';
import nourdu from '../assests/noballurdu.ogg';
import { useWebEyeGaze } from "../hooks/useWebEyeGaze";
import lookHere from '../assests/look_here.mp4';
import { useEmotionModel } from "../hooks/useEmotionModel";
import { useAttentionMetrics } from "@/hooks/useAttentionMetrics";
import { startSession } from "@/lib/analytics/client";
import { preloadImageAsset } from "@/lib/preloadImageAsset";
import { useFavoriteCharacter } from "@/hooks/useFavoriteCharacter";
import {
  ensureWonderworldSessionState,
  updateWonderworldEmotionCounts,
  updateWonderworldFocusMetrics,
} from "@/lib/analytics/sessionState";
function Findball() {
  const navigate = useNavigate();
    const {t}=useTranslation();
  const favoriteCharacter = useFavoriteCharacter();
  const bubblesLearnBg = "/assets/Bubbles/bubbles_bg_unified.png";
  const bubblesTalkingGif = "/assets/Bubbles/talking.gif";
  const bubblesStandingGif = "/assets/Bubbles/standing-loop.gif";
  const mimmiLearnBg = "/assets/Mimmi/mimmi_bg_unified_extended.png";
  const mimmiTalkingGif = "/assets/Mimmi/talking_mimmi.gif";
  const mimmiStandingGif = "/assets/Mimmi/standing_mimmi.gif";
  const [selectedImageSrc, setSelectedImageSrc] = React.useState(null);
  const [cameraAllowed, setCameraAllowed] = React.useState(true);
  const [cameraPermissionResolved, setCameraPermissionResolved] = React.useState(false);
  const [selectionRecorded, setSelectionRecorded] = React.useState(false);
  const [isLionSpeaking, setIsLionSpeaking] = React.useState(false);
 const audioRef = useRef(null);
const yesAudioRef = useRef(null);
const noAudioRef = useRef(null);
  const { isLooking, videoRef } = useWebEyeGaze({ enabled: cameraPermissionResolved && cameraAllowed });
  const lookHereAudioRef = useRef(null);
  const notLookingTimeoutRef = useRef(null);
  const notLookingIntervalRef = useRef(null);
  const { emotionCounts, sampleEmotion, currentEmotion, emotionConfidence } = useEmotionModel({
    enabled: cameraPermissionResolved && cameraAllowed,
    videoRef,
    currentSceneId: "find-ball",
  });
  const emotionEmoji = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
  }[currentEmotion] || "😐";
  const emotionColors = {
    happy: { bg: "rgba(34, 197, 94, 0.2)", border: "rgba(34, 197, 94, 0.5)", text: "#dcfce7" },
    sad: { bg: "rgba(59, 130, 246, 0.2)", border: "rgba(59, 130, 246, 0.5)", text: "#dbeafe" },
    angry: { bg: "rgba(239, 68, 68, 0.2)", border: "rgba(239, 68, 68, 0.5)", text: "#fecaca" },
    neutral: { bg: "rgba(107, 114, 128, 0.2)", border: "rgba(107, 114, 128, 0.5)", text: "#e5e7eb" },
  }[currentEmotion] || { bg: "rgba(107, 114, 128, 0.2)", border: "rgba(107, 114, 128, 0.5)", text: "#e5e7eb" };
  const { getMetrics } = useAttentionMetrics({
    enabled: cameraPermissionResolved && cameraAllowed,
    isLooking,
  });

  useEffect(() => {
    preloadImageAsset(cartoon);
    preloadImageAsset(standinglion);
    preloadImageAsset(bubblesTalkingGif);
    preloadImageAsset(bubblesStandingGif);
    preloadImageAsset(bubblesLearnBg);
    preloadImageAsset(mimmiTalkingGif);
    preloadImageAsset(mimmiStandingGif);
    preloadImageAsset(mimmiLearnBg);
  }, [bubblesLearnBg, bubblesStandingGif, bubblesTalkingGif, mimmiLearnBg, mimmiStandingGif, mimmiTalkingGif]);

  const playTrackedAudio = React.useCallback((audio, options = {}) => {
    const { onEnded, onError, resetTime = false } = options;
    if (!audio) return;
    if (resetTime) {
      audio.pause();
      audio.currentTime = 0;
    }
    audio.onended = () => {
      setIsLionSpeaking(false);
      if (onEnded) onEnded();
    };
    setIsLionSpeaking(true);
    audio.play().catch(() => {
      setIsLionSpeaking(false);
      if (onError) onError();
    });
  }, []);

  useEffect(() => {
  let permissionStatus = null;

  const checkCameraPermission = async () => {
    if (!navigator.permissions || !navigator.permissions.query) {
      setCameraPermissionResolved(true);
      return;
    }

    try {
      permissionStatus = await navigator.permissions.query({ name: "camera" });
      setCameraAllowed(permissionStatus.state !== "denied");
      setCameraPermissionResolved(true);
      permissionStatus.onchange = () => {
        setCameraAllowed(permissionStatus.state !== "denied");
      };
    } catch (_) {
      setCameraPermissionResolved(true);
    }
  };

  checkCameraPermission();

  return () => {
    if (permissionStatus) permissionStatus.onchange = null;
  };
}, []);
  useEffect(() => {
  const audio = audioRef.current;
  if (audio) {
    audio.volume = 1;
    playTrackedAudio(audio, {
      resetTime: true,
      onError: () => {
        setTimeout(() => {
          playTrackedAudio(audio);
        }, 1000);
      },
    });
  }
}, [i18n.language, playTrackedAudio]);

useEffect(() => {
  const done = localStorage.getItem("ball_select_done");
  if (done === "true") {
    setSelectionRecorded(true);
  }
}, []);

useEffect(() => {
  let ignore = false;

  const ensureSession = async () => {
    if (window.sessionStorage.getItem("analytics:wonderworld:ball")) return;

    try {
      const sessionId = await startSession({
        gameKey: "wonderworld",
        moduleKey: "ball",
        sourceApp: "main-app",
        language: i18n.language,
      });

      if (!ignore) {
        ensureWonderworldSessionState("ball", sessionId, i18n.language);
      }
    } catch (error) {
      console.error("Failed to ensure ball analytics session:", error);
    }
  };

  ensureSession();

  return () => {
    ignore = true;
  };
}, []);

useEffect(() => {
  updateWonderworldEmotionCounts("ball", emotionCounts);
}, [emotionCounts]);

useEffect(() => {
  updateWonderworldFocusMetrics("ball", getMetrics());

  return () => {
    updateWonderworldFocusMetrics("ball", getMetrics());
  };
}, [cameraAllowed, isLooking, getMetrics]);

  const recordSelectTry = () => {
  const current = parseInt(localStorage.getItem("ball_select_tries") || "0", 10);
  localStorage.setItem("ball_select_tries", String(current + 1));
};


  useEffect(() => {
  const playLookHere = () => {
    const audio = lookHereAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = 1;
    audio.play().catch(() => {});
  };

  if (!cameraPermissionResolved || !cameraAllowed) return;

  if (isLooking) {
    if (notLookingTimeoutRef.current) {
      clearTimeout(notLookingTimeoutRef.current);
      notLookingTimeoutRef.current = null;
    }
    if (notLookingIntervalRef.current) {
      clearInterval(notLookingIntervalRef.current);
      notLookingIntervalRef.current = null;
    }
    return;
  }

  if (notLookingTimeoutRef.current) return;

  notLookingTimeoutRef.current = setTimeout(() => {
    if (!cameraAllowed || isLooking) return;
    playLookHere();
    if (!notLookingIntervalRef.current) {
      notLookingIntervalRef.current = setInterval(() => {
        if (!cameraAllowed || isLooking) {
          clearInterval(notLookingIntervalRef.current);
          notLookingIntervalRef.current = null;
          return;
        }
        playLookHere();
      }, 20000);
    }
  }, 20000);

  return () => {
    if (notLookingTimeoutRef.current) {
      clearTimeout(notLookingTimeoutRef.current);
      notLookingTimeoutRef.current = null;
    }
    if (notLookingIntervalRef.current) {
      clearInterval(notLookingIntervalRef.current);
      notLookingIntervalRef.current = null;
    }
  };
}, [isLooking, cameraAllowed]);
  const handleSelect = async (img) => {
  if (cameraPermissionResolved && cameraAllowed) {
    sampleEmotion().catch(() => {});
  }
  if (!selectionRecorded) {
    recordSelectTry();
  }
  setSelectedImageSrc(img);

  if (img === ball) {
    if (!selectionRecorded) {
      localStorage.setItem("ball_select_done", "true");
      setSelectionRecorded(true);
    }
    // Ball selected → play YES audio then navigate after 2 sec
    yesAudioRef.current.volume = 1;
    playTrackedAudio(yesAudioRef.current, {
      onError: () => console.log("Yes autoplay blocked"),
    });
    setTimeout(() => {
      navigate("/final", { state: { from: "findball" } });
    }, 5000);
  } else {
    // Car or Cookie selected → play NO audio
    noAudioRef.current.volume = 1;
    playTrackedAudio(noAudioRef.current, {
      onError: () => console.log("No autoplay blocked"),
    });
  }
};
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: "100vh", backgroundColor: "transparent" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
        <Box sx={{ backgroundColor: "#0B3D2E", width: "100vw", height: "100vh", opacity: "0.9", position: "absolute", backgroundAttachment: "fixed", pointerEvents: "none" }} />

        <Box sx={{ backgroundImage: `url(${favoriteCharacter === "bubbles" ? bubblesLearnBg : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? mimmiLearnBg : learnbg})`, width: "100vw", minHeight: "100vh", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundAttachment: "fixed", position: "relative", backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 10cqh)" : "bottom center", overflow: "hidden", containerType: "size", "@media (min-width: 1200px) and (min-aspect-ratio: 3/2)": { backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 12cqh)" : "bottom center" }, "@media (min-width: 1000px) and (max-width: 1100px) and (min-height: 1300px)": { backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 09cqh)" : "bottom center" }, "@media (min-width: 1300px) and (max-width: 1400px) and (max-aspect-ratio: 1.4)": { backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 09cqh)" : "bottom center" } }}>
          {cameraAllowed && (
            <Box sx={{ position: "absolute", top: "1.5cqh", right: "1.5cqw", display: "flex", flexDirection: "column", gap: "0.8cqh", zIndex: 50 }}>
              <Box sx={{ backgroundColor: isLooking ? "rgba(0, 150, 0, 0.7)" : "rgba(150, 0, 0, 0.7)", padding: "0.7cqh 1cqw", borderRadius: "1.5cqh" }}>
                <Typography sx={{ fontSize: "max(1cqw, 1.5cqh)", fontFamily: "Chewy", color: "#fff" }}>{isLooking ? "Looking" : "Not looking"}</Typography>
              </Box>
              <Box sx={{ backgroundColor: emotionColors.bg, border: `1px solid ${emotionColors.border}`, backdropFilter: "blur(8px)", padding: "1cqh 1cqw", borderRadius: "1.8cqh" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.7cqw" }}>
                  <Typography sx={{ fontSize: "max(1.8cqw, 2.7cqh)", lineHeight: 1 }}>{emotionEmoji}</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontSize: "max(1cqw, 1.5cqh)", fontFamily: "Chewy", color: emotionColors.text, textTransform: "capitalize", lineHeight: 1.1 }}>{currentEmotion}</Typography>
                    <Typography sx={{ fontSize: "max(0.8cqw, 1.2cqh)", fontFamily: "Chewy", color: emotionColors.text, opacity: 0.8, lineHeight: 1.1 }}>{Math.round((emotionConfidence || 0) * 100)}%</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          <Box onClick={() => navigate("/showball")} sx={{ position: "absolute", top: "5cqh", left: "5cqw", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { transform: "scale(1.08)", transition: "0.2s" } }}>
            <Box component="img" src={backbg} sx={{ width: "max(8cqw, 12cqh)", height: "max(5.5cqh, 3.5cqw)" }} />
            <Typography sx={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", fontSize: "max(1.8cqw, 2.7cqh)", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy", color: "#FFCB8F", letterSpacing: "1px", lineHeight: "1", marginTop: "-2%" }}>
              <KeyboardArrowLeftIcon sx={{ fontSize: "max(2cqw, 3cqh)", mr: 0.5, stroke: "currentColor", strokeWidth: 0.5 }} />
              {t("back")}
            </Typography>
          </Box>

          <Box sx={{ position: "absolute", bottom: favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "9cqh" : "16cqh", left: "3cqw", width: favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "max(32cqw, 48cqh)" : "max(26cqw, 39cqh)", zIndex: 5, "@media (max-aspect-ratio: 1.55)": { left: "-1cqw" }, "@media (min-aspect-ratio: 1.55)": { bottom: favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "11cqh" : "16cqh" }, "@media (min-width: 1000px) and (max-width: 1160px) and (max-height: 780px)": { bottom: favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "10cqh" : "16cqh" } }}>
            <Box sx={{ position: "absolute", width: "max(20cqw, 30cqh)", height: "auto", bottom: "88%", left: "50%", zIndex: 6, "@media (max-aspect-ratio: 4/3)": { width: "22cqw", left: "40%" } }}>
              <Box component="img" src={bg} sx={{ width: "100%", height: "auto", display: "block", filter: favoriteCharacter === "bubbles" ? "hue-rotate(145deg) saturate(1.35) brightness(1.08)" : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "hue-rotate(65deg) saturate(1.18) brightness(1.05)" : "none" }} />
              <Typography sx={{ fontSize: i18n.language === "ur" ? "max(3.2cqw, 4.8cqh)" : "max(2.2cqw, 3.3cqh)", position: "absolute", top: "54%", left: "52%", transform: "translate(-50%, -70%)", width: "75%", textAlign: "left", fontStyle: "normal", lineHeight: "1.35", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy", letterSpacing: "1px", color: "rgb(15, 21, 27,0.8)", opacity: "0.9" }}>
                {t("questionBall")}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", width: "100%" }}>
              {!isLionSpeaking && <Box sx={{ position: "absolute", top: "39.5%", left: "30.5%", width: "39%", height: "12.5%", backgroundColor: "#000", borderRadius: "999px", opacity: 1, zIndex: 0, pointerEvents: "none" }} />}
              <Box component="img" src={favoriteCharacter === "bubbles" ? (isLionSpeaking ? bubblesTalkingGif : bubblesStandingGif) : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? (isLionSpeaking ? mimmiTalkingGif : mimmiStandingGif) : (isLionSpeaking ? cartoon : standinglion)} loading="eager" decoding="async" sx={{ width: "100%", height: "auto", objectFit: "contain", display: "block", position: "relative", zIndex: 1, transform: isLionSpeaking ? (favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "translateY(2cqh) scaleX(1.03)" : "scaleX(1.03)") : "translateY(2cqh) scale(1.05, 1.02)", transformOrigin: "center" }} />
            </Box>
          </Box>

          <Box sx={{ position: "absolute", right: "2cqw", bottom: "16cqh", width: "max(55cqw, 82cqh)", aspectRatio: "1024 / 796", "@media (max-aspect-ratio: 1.55)": { width: "max(65cqw, 92cqh)", right: "1cqw", bottom: "14cqh" }, "@media (min-width: 1160px) and (max-width: 1250px) and (min-height: 800px) and (max-height: 900px)": { bottom: "12cqh" }, "@media (min-width: 1000px) and (max-width: 1160px) and (max-height: 780px)": { bottom: "14cqh" }, "@media (min-width: 1300px) and (max-aspect-ratio: 1.4)": { width: "max(55cqw, 82cqh)", right: "2cqw", bottom: "12cqh" }, containerType: "size", zIndex: 4 }}>
            <Box component="img" src={board} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: "44px" }} />

            <Box component="img" src={ball} onClick={() => handleSelect(ball)} sx={{ position: "absolute", left: "16.5%", top: "21%", width: "20%", height: "auto", cursor: "pointer", zIndex: 5, "&:hover": { transform: "scale(1.12)" } }} />
            <Box component="img" src={car} onClick={() => handleSelect(car)} sx={{ position: "absolute", left: "42.5%", top: "20.5%", width: "20%", height: "auto", cursor: "pointer", zIndex: 5, "&:hover": { transform: "scale(1.12)" } }} />
            <Box component="img" src={cookies} onClick={() => handleSelect(cookies)} sx={{ position: "absolute", left: "69.2%", top: "24%", width: "17%", height: "auto", cursor: "pointer", zIndex: 5, "&:hover": { transform: "scale(1.12)" } }} />

            {[
              { text: t("ball"), left: "26.5%" },
              { text: t("car"), left: "52.5%" },
              { text: t("cookie"), left: "76.8%" },
            ].map((item) => (
              <Typography key={item.left} sx={{ position: "absolute", top: "50.5%", left: item.left, transform: "translateX(-50%)", fontSize: i18n.language === "ur" ? "6.8cqh" : "5.2cqh", fontStyle: "normal", lineHeight: "90%", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy", letterSpacing: "2px", color: "rgba(255, 236, 220, 1)", opacity: "0.9", zIndex: 5, pointerEvents: "none", whiteSpace: "nowrap" }}>
                {item.text}
              </Typography>
            ))}

            {selectedImageSrc && (
              <Box component="img" src={selectedImageSrc} sx={{ position: "absolute", left: "53%", top: "74%", width: selectedImageSrc === cookies ? "17%" : "16%", height: "auto", transform: "translate(-50%, -50%)", objectFit: "contain", zIndex: 6 }} />
            )}
          </Box>

          {cameraAllowed && !isLooking && (
            <Box sx={{ position: "absolute", bottom: "2cqh", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(0, 0, 0, 0.55)", padding: "max(0.8cqw, 1.2cqh) max(1.4cqw, 2.1cqh)", borderRadius: "max(1.2cqw, 1.8cqh)", zIndex: 20 }}>
              <Typography sx={{ fontSize: "max(1.3cqw, 2cqh)", fontFamily: "Chewy", color: "#FFE1B3", textAlign: "center" }}>Let's look here together</Typography>
            </Box>
          )}

          <audio ref={audioRef} src={i18n.language === "ur" ? findurdu : findCookie} preload="auto" />
          <audio ref={yesAudioRef} src={i18n.language === "ur" ? yesurdu : yes} preload="auto" />
          <audio ref={noAudioRef} src={i18n.language === "ur" ? nourdu : no} preload="auto" />
          <audio ref={lookHereAudioRef} src={lookHere} preload="auto" />

          {cameraAllowed && <video ref={videoRef} autoPlay muted playsInline style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }} />}
        </Box>
      </Box>
    </motion.div>
  );
}

export default Findball;
