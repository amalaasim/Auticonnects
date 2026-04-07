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
import arrow from '../assests/larrow.png';
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
import {
  ensureWonderworldSessionState,
  updateWonderworldEmotionCounts,
  updateWonderworldFocusMetrics,
} from "@/lib/analytics/sessionState";
function Findball() {
  const navigate = useNavigate();
    const {t}=useTranslation();
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
  }, []);

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
  if (cameraPermissionResolved && cameraAllowed && !isLooking) return;
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
      style={{ minHeight: "100vh", width: "100vw", overflow: "hidden" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>

        {/* overlay */}
        <Box
          sx={{
            backgroundColor: "#0B3D2E",
            width: "100vw",
            height: "100vh",
            opacity: "0.9",
            position: "absolute",
            pointerEvents: "none",
          }}
        />

        {/* main bg */}
        <Box
          sx={{
            backgroundImage: `url(${learnbg})`,
            width: "100vw",
            minHeight: "100vh",
            height: "100vh",
            borderRadius: "0px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            backgroundPosition: "center",
          }}
        >

          {/* gaze + emotion debug status */}
{cameraAllowed && (
  <Box
    sx={{
      position: "absolute",
      top: "12px",
      right: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      zIndex: 50,
    }}
  >
    <Box
      sx={{
        backgroundColor: isLooking
          ? "rgba(0, 150, 0, 0.7)"
          : "rgba(150, 0, 0, 0.7)",
        padding: "6px 12px",
        borderRadius: "12px",
      }}
    >
      <Typography
        sx={{
          fontSize: "14px",
          fontFamily: "Chewy",
          color: "#fff",
        }}
      >
        {isLooking ? "Looking 👀" : "Not looking 🙈"}
      </Typography>
    </Box>

    <Box
      sx={{
        backgroundColor: emotionColors.bg,
        border: `1px solid ${emotionColors.border}`,
        backdropFilter: "blur(8px)",
        padding: "10px 14px",
        borderRadius: "16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Typography sx={{ fontSize: "26px", lineHeight: 1 }}>
          {emotionEmoji}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontFamily: "Chewy",
              color: emotionColors.text,
              textTransform: "capitalize",
              lineHeight: 1.1,
            }}
          >
            {currentEmotion}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontFamily: "Chewy",
              color: emotionColors.text,
              opacity: 0.8,
              lineHeight: 1.1,
            }}
          >
            {Math.round((emotionConfidence || 0) * 100)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
)}

          {/* back */}
          <Box sx={{ display: "flex", pl: "9%" }}>
            <Box
              onClick={() => navigate("/showball")}
              component="img"
              src={backbg}
              sx={{
                width: { lg: "9%", sm: "18%" },
                height:{lg:"auto",sm:"18%"},
                marginTop: { lg: "45px", sm: "10%" },
                "&:hover": { transform: "scale(1.18)" }
              }}
            />

            <Typography
              onClick={() => navigate("/showball")}
              sx={{
                fontSize: { lg: "35px", sm: "28px" },
                marginTop: { lg: "3.05%", sm: "10%" },
                marginLeft: { lg: "-8%", sm: "-16%" },
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                color: "rgba(255, 203, 143, 1)",
                              "&:hover": { transform: "scale(1.18)", boxShadow: "0 10px 25px rgba(0,0,0,0)" }

              }}
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: 25 }} />
              {t("back")}
            </Typography>
          </Box>

          {/* question */}
          <Box>
            <Box
              component="img"
              src={bg}
              sx={{
                width: { lg: "264px", sm: "200px" },
                height: { lg: "143px", sm: "110px" },
                marginTop: { lg: "4%", sm: "20%" },
                marginLeft: { lg: "390px", sm: "10%" },
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  lg: i18n.language === "ur" ? "48px" : "34px",
                  sm: i18n.language === "ur" ? "38px" : "26px",
                },
                marginTop: { lg: "-9%", sm: "-13.5%" },
                marginLeft: { lg: "28.5%", sm: "13%" },
                width: { lg: "15%", sm: "20%" },
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                color: "rgba(15,21,27,0.8)",
              }}
            >
              {t("questionBall")}
            </Typography>

            <Box
              component="img"
              src={voice}
              sx={{
                width: { lg: "40px", sm: "40px" },
                marginLeft: { lg: "560px", sm: "26%" },
                marginTop: {lg:i18n.language==="ur"?"0%":"-5%",sm:i18n.language==="ur"?"-2%":"-10%",}
              }}
            />
          </Box>

          {/* cartoon */}
          <Box
            component="img"
            src={isLionSpeaking ? cartoon : standinglion}
            loading="eager"
            decoding="async"
            sx={{
              width: { lg: "402px", sm: "270px" },
              height: { lg: "402px", sm: "290px" },
              marginLeft: { lg: "190px", sm: "-3%" },
              marginTop: { lg: "-40px", sm: "-28px" },
              borderRadius: "200px",
              objectFit: "contain",
              transform: isLionSpeaking ? "translateY(-14px)" : "none",
            }}
          />

          {/* board */}
          <Box
            component="img"
            src={board}
            sx={{
              width: { lg: "659px", sm: "60%" },
              height: { lg: "551px", sm: "auto" },
              marginLeft: { lg: "663px", sm: "40%" },
              marginTop: { lg: "-35.5%", sm: "-50%" },
              borderRadius: "44px",
            }}
          />

          {/* options */}
          <Box
            component="img"
            src={ball}
            onClick={() => handleSelect(ball)}
            sx={{
              width: { lg: "132px", sm: "90px" },
              height: { lg: "132px", sm: "90px" },
              marginTop: { lg: "-47%", sm: "-71.5%" },
              marginLeft: { lg: "calc(-36.5% - 30px)", sm: "49.5%" },
                            "&:hover": { transform: "scale(1.18)", boxShadow: "0 10px 25px rgba(0,0,0,0)" }

            }}
          />

          <Box
            component="img"
            src={car}
            onClick={() => handleSelect(car)}
            sx={{
              width: { lg: "132px", sm: "90px" },
              height: { lg: "132px", sm: "90px" },
              marginTop: { lg: "-47.5%", sm: "-72%" },
              marginLeft: { lg: "calc(2.5% + 5px)", sm: "4%" },
                            "&:hover": { transform: "scale(1.18)", boxShadow: "0 10px 25px rgba(0,0,0,0)" }

            }}
          />

          <Box
            component="img"
            src={cookies}
            onClick={() => handleSelect(cookies)}
            sx={{
              width: { lg: "120px", sm: "80px" },
              height: { lg: "120px", sm: "80px" },
              marginTop: { lg: "-47.5%", sm: "-72%" },
              marginLeft: { lg: "calc(3% + 5px)", sm: "4.3%" },
                            "&:hover": { transform: "scale(1.18)", boxShadow: "0 10px 25px rgba(0,0,0,0)" }

            }}
          />
       <Typography
             sx={{
               fontSize: {lg:i18n.language === "ur" ? "40px" :"35px",sm:i18n.language === "ur" ? "25px" : "25px"},
               marginTop: {lg:i18n.language === "ur" ? "calc(-19% - 1px)" :"calc(-18.6% - 10px)",sm:i18n.language === "ur" ? "-30%" : "-30%"},
               marginLeft: {lg:i18n.language === "ur" ? "calc(53.5% + 40px)" : "calc(53.3% + 40px)",sm:i18n.language === "ur" ? "53.5%" : "52.5%"}
,               fontStyle:"normal",
               lineHeight:"90%",
               fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" : 'Chewy',
               letterSpacing:"2px",
               color:"rgba(255, 236, 220, 1)",
opacity:"0.9",
             }}>
             {t("ball")}
              </Typography> 
               <Typography
             sx={{
               fontSize: {lg:i18n.language === "ur" ? "40px" :"35px",sm:i18n.language === "ur" ? "25px" : "25px"},
               marginTop: {lg:i18n.language === "ur" ? "-2.69%" :"-2.1%",sm:i18n.language === "ur" ? "-3.3%" : "-2.7%"},
               marginLeft:{lg:i18n.language === "ur" ? "calc(65.5% + 40px)" : "calc(64.999% + 40px)",sm:i18n.language === "ur" ? "69.5%" : "67%"},
               fontStyle:"normal",
               lineHeight:"90%",
               fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy',
               letterSpacing:"2px",
               color:"rgba(255, 236, 220, 1)",
opacity:"0.9",
             }}>
            {t("car")}
              </Typography> 
               <Typography
             sx={{
               fontSize: {lg:i18n.language === "ur" ? "40px" :"35px",sm:i18n.language === "ur" ? "30px" : "23px"},
              marginTop: {lg:i18n.language === "ur" ? "calc(-1.7% - 2px)" :"calc(-1.89% - 2px)",sm:i18n.language === "ur" ? "-2.9%" : "-2.7%"},
               marginLeft:{lg:i18n.language === "ur" ? "calc(75.9% + 50px)" : "calc(74.6% + 50px)",sm:i18n.language === "ur" ? "83.9%" : "82.2%"},
               fontStyle:"normal",
               lineHeight:"90%",
               fontFamily: i18n.language === "ur" ? "Jameelnoorinastaleeq" :'Chewy',
               letterSpacing:"2px",
               color:"rgba(255, 236, 220, 1)",
opacity:"0.9",
             }}>
            {t("cookie")}
              </Typography> 
          {/* arrow */}
          <Box
            component="img"
            src={arrow}
            sx={{
              width: { lg: "317px", sm: "200px" },
              height: { lg: "377px", sm: "240px" },
              marginLeft: { lg: "48%", sm: "50%" },
              marginTop: {lg:"-8%",sm:"-11%"}
            }}
          />

          {selectedImageSrc && (
            <Box
              component="img"
              src={selectedImageSrc}
              sx={{
                width: { lg: selectedImageSrc === ball ? "112px" : "120px", sm: selectedImageSrc === ball ? "74px" : "80px" },
                height: { lg: selectedImageSrc === ball ? "112px" : "112px", sm: selectedImageSrc === ball ? "74px" : "70px" },
                marginLeft: { lg: "calc(62.8% + 45px)", sm: "66%" },
                marginTop: selectedImageSrc === cookies
                  ? { lg: "calc(-22.2% - 55px)", sm: "calc(-27.5% - 22px)" }
                  : selectedImageSrc === ball
                  ? { lg: "calc(-22.2% - 35px)", sm: "calc(-27.5% - 5px)" }
                  : { lg: "calc(-22.2% - 30px)", sm: "-27.5%" },
                objectFit: "contain"
              }}
            />
          )}

         
          <audio
  ref={audioRef}
  src={i18n.language === "ur" ? findurdu : findCookie}
  preload="auto"
/>

<audio
  ref={yesAudioRef}
  src={i18n.language === "ur" ? yesurdu : yes}
  preload="auto"
/>

<audio
  ref={noAudioRef}
  src={i18n.language === "ur" ? nourdu : no}
  preload="auto"
/>

<audio
  ref={lookHereAudioRef}
  src={lookHere}
  preload="auto"
/>

{cameraAllowed && (
  <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    style={{
      position: "absolute",
      width: "1px",
      height: "1px",
      opacity: 0,
      pointerEvents: "none",
    }}
  />
)}
        </Box>
      </Box>
    </motion.div>
  );
}

export default Findball;
