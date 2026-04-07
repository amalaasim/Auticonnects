import * as React from 'react';
import { Box, Typography } from '@mui/material';
import learnbg from '../assests/learn_bg.png';
import cartoon from '../assests/talking.gif';
import standinglion from '../assests/standinglion-loop.gif';
import board from '../assests/findbg.png';
import { useEffect, useRef } from "react";
import book from '../assests/book.png';
import fball from '../assests/fball.png';
import full from '../assests/fullc.png';
import arrow from '../assests/arrow.png';
import click from '../assests/click.png';
import { useNavigate } from "react-router-dom";
import backbg from '../assests/backbg.png';
import bg from '../assests/greenbg.png';
import voice from '../assests/voice.png';
import i18n from "../i18n";
import yes from '../assests/yes.mpeg';
import no from '../assests/no.mpeg';
import { motion } from "framer-motion";
import findCookie from '../assests/findCookie.mpeg';
import { useTranslation } from "react-i18next";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import findurdu from '../assests/findbiscuiturdu.mp4';
import yesurdu from '../assests/yesbiscuiturdu.ogg';
import nourdu from '../assests/nobiscuiturdu.mp4';
import { useWebEyeGaze } from "../hooks/useWebEyeGaze";
import lookHere from '../assests/look_here.mp4';
import { useEmotionModel } from "../hooks/useEmotionModel";
import { useAttentionMetrics } from "@/hooks/useAttentionMetrics";
import { startSession } from "@/lib/analytics/client";
import {
  ensureWonderworldSessionState,
  updateWonderworldEmotionCounts,
  updateWonderworldFocusMetrics,
} from "@/lib/analytics/sessionState";
function Find() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImageSrc, setSelectedImageSrc] = React.useState(null);
  const [cameraAllowed, setCameraAllowed] = React.useState(true);
  const [cameraPermissionResolved, setCameraPermissionResolved] = React.useState(false);
  const [selectionRecorded, setSelectionRecorded] = React.useState(false);
  const [isLionSpeaking, setIsLionSpeaking] = React.useState(false);

  const audioRef = useRef(null);
  const yesAudioRef = useRef(null);
  const noAudioRef = useRef(null);
  const lookHereAudioRef = useRef(null);
  const notLookingTimeoutRef = useRef(null);
  const notLookingIntervalRef = useRef(null);
  const navigateTimeoutRef = useRef(null);
  const { isLooking, videoRef } = useWebEyeGaze({ enabled: cameraPermissionResolved && cameraAllowed });
  const { emotionCounts, sampleEmotion, currentEmotion, emotionConfidence } = useEmotionModel({
    enabled: cameraPermissionResolved && cameraAllowed,
    videoRef,
    currentSceneId: "find-cookie",
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
  const done = localStorage.getItem("cookie_select_done");
  if (done === "true") {
    setSelectionRecorded(true);
  }
}, []);

useEffect(() => {
  let ignore = false;

  const ensureSession = async () => {
    if (window.sessionStorage.getItem("analytics:wonderworld:cookie")) return;

    try {
      const sessionId = await startSession({
        gameKey: "wonderworld",
        moduleKey: "cookie",
        sourceApp: "main-app",
        language: i18n.language,
      });

      if (!ignore) {
        ensureWonderworldSessionState("cookie", sessionId, i18n.language);
      }
    } catch (error) {
      console.error("Failed to ensure cookie analytics session:", error);
    }
  };

  ensureSession();

  return () => {
    ignore = true;
  };
}, []);

useEffect(() => {
  updateWonderworldEmotionCounts("cookie", emotionCounts);
}, [emotionCounts]);

useEffect(() => {
  updateWonderworldFocusMetrics("cookie", getMetrics());

  return () => {
    updateWonderworldFocusMetrics("cookie", getMetrics());
  };
}, [cameraAllowed, isLooking, getMetrics]);

  const recordSelectTry = () => {
  const current = parseInt(localStorage.getItem("cookie_select_tries") || "0", 10);
  localStorage.setItem("cookie_select_tries", String(current + 1));
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

  if (img === full) {
    if (!selectionRecorded) {
      localStorage.setItem("cookie_select_done", "true");
      setSelectionRecorded(true);
    }
    const audio = yesAudioRef.current;
    let didNavigate = false;
    const goNext = () => {
      if (didNavigate) return;
      didNavigate = true;
      navigate("/final", { state: { from: "find" } });
    };

    if (navigateTimeoutRef.current) {
      clearTimeout(navigateTimeoutRef.current);
      navigateTimeoutRef.current = null;
    }

    if (audio) {
      audio.volume = 1;
      playTrackedAudio(audio, {
        onEnded: () => {
          if (navigateTimeoutRef.current) {
            clearTimeout(navigateTimeoutRef.current);
            navigateTimeoutRef.current = null;
          }
          navigateTimeoutRef.current = setTimeout(goNext, 2000);
        },
      });

      const durationMs =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? Math.ceil(audio.duration * 1000)
          : 2000;
      navigateTimeoutRef.current = setTimeout(goNext, durationMs + 2150);
    } else {
      navigateTimeoutRef.current = setTimeout(goNext, 2000);
    }
  } else {
    noAudioRef.current.volume = 1;
    playTrackedAudio(noAudioRef.current);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: "100vh" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>

        {/* overlay */}
        <Box
          sx={{
            backgroundColor: "#0B3D2E",
            width: "100%",
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
              onClick={() => navigate("/learnobject")}
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
              onClick={() => navigate("/learnobject")}
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
                marginTop: { lg: i18n.language === "ur" ? "-8.2%" : "-9%", sm: i18n.language === "ur" ? "-12.7%" : "-13.5%" },
                marginLeft: { lg: "28.5%", sm: "13%" },
                width: { lg: "15%", sm: "20%" },
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                color: "rgba(15,21,27,0.8)",
              }}
            >
              {t("question")}
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
            key={isLionSpeaking ? "talking" : "standing"}
            component="img"
            src={isLionSpeaking ? cartoon : standinglion}
            sx={{
              width: { lg: "402px", sm: "270px" },
              height: { lg: "405px", sm: "290px" },
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
            src={book}
            onClick={() => handleSelect(book)}
            sx={{
                            "&:hover": { transform: "scale(1.18)", boxShadow: "0 10px 25px rgba(0,0,0,0)" }
,
              width: { lg: "132px", sm: "90px" },
              height: { lg: "132px", sm: "90px" },
              marginTop: { lg: "-47%", sm: "-71.5%" },
              marginLeft: { lg: "calc(-36.5% - 25px)", sm: "calc(49.5% - 20px)" },
            }}
          />

          <Box
            component="img"
            src={fball}
            onClick={() => handleSelect(fball)}
            sx={{
                            "&:hover": { transform: "scale(1.18)", boxShadow: "0 10px 25px rgba(0,0,0,0)" },

              width: { lg: "132px", sm: "90px" },
              height: { lg: "132px", sm: "90px" },
              marginTop: { lg: "-47.5%", sm: "-72%" },
              marginLeft: { lg: "2.8%", sm: "4%" },
            }}
          />

          <Box
            component="img"
            src={full}
            onClick={() => handleSelect(full)}
            sx={{
                            "&:hover": { transform: "scale(1.18)", boxShadow: "0 10px 25px rgba(0,0,0,0)" },

              width: { lg: "130px", sm: "80px" },
              height: { lg: "130px", sm: "80px" },
              marginTop: { lg: "-47.5%", sm: "-72%" },
              marginLeft: { lg: "calc(2.4% - 0px)", sm: "calc(4.3% - 0px)" },

            }}
          />
       <Typography
             sx={{
               fontSize: {lg:i18n.language === "ur" ? "40px" :"35px",sm:i18n.language === "ur" ? "25px" : "25px"},
               marginTop: {lg:i18n.language === "ur" ? "calc(-19% - 10px)" : "calc(-18.6% - 10px)",sm:i18n.language === "ur" ? "calc(-30% - 10px)" : "calc(-30% - 10px)"},
               marginLeft: {lg:i18n.language === "ur" ? "calc(53.5% + 40px)" : "calc(53% + 40px)",sm:i18n.language === "ur" ? "calc(53.5% + 40px)" : "calc(52.5% + 40px)"}
,               fontStyle:"normal",
               lineHeight:"90%",
               fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" : 'Chewy',
               letterSpacing:"2px",
               color:"rgba(255, 236, 220, 1)",
opacity:"0.9",
             }}>
             {t("book")}
              </Typography> 
        <Typography
             sx={{
               fontSize: {lg:i18n.language === "ur" ? "40px" :"35px",sm:i18n.language === "ur" ? "25px" : "25px"},
               marginTop: {lg:i18n.language === "ur" ? "calc(-2.69% - 2px)" : "calc(-2.1% - 2px)",sm:i18n.language === "ur" ? "calc(-3.3% - 10px)" : "calc(-2.7% - 10px)"},
               marginLeft:{lg:i18n.language === "ur" ? "calc(65.5% + 45px)" : "calc(63.999% + 45px)",sm:i18n.language === "ur" ? "calc(69.5% + 40px)" : "calc(67% + 40px)"},
               fontStyle:"normal",
               lineHeight:"90%",
               fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy',
               letterSpacing:"2px",
               color:"rgba(255, 236, 220, 1)",
opacity:"0.9",
             }}>
            {t("moon")}
              </Typography> 
               <Typography
             sx={{
               fontSize: {lg:i18n.language === "ur" ? "40px" :"35px",sm:i18n.language === "ur" ? "30px" : "23px"},
              marginTop: {lg:i18n.language === "ur" ? "calc(-1.7% - 3px)" : "calc(-1.89% - 3px)",sm:i18n.language === "ur" ? "calc(-2.9% - 10px)" : "calc(-2.7% - 10px)"},
               marginLeft:{lg:i18n.language === "ur" ? "calc(75.9% + 46px)" : "calc(74.9% + 46px)",sm:i18n.language === "ur" ? "calc(83.9% + 40px)" : "calc(82.2% + 40px)"},
               fontStyle:"normal",
               lineHeight:"90%",
               fontFamily: i18n.language === "ur" ? "Jameelnoorinastaleeq" :'Chewy',
               letterSpacing:"2px",
               color:"rgba(255, 236, 220, 1)",
opacity:"0.9",
             }}>
            {t("cookie")}
              </Typography> 

              {/* focus prompt at bottom */}
              {cameraAllowed && !isLooking && (
  <Box
    sx={{
      position: "absolute",
      bottom: { lg: "30px", sm: "20px" },
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      padding: { lg: "12px 22px", sm: "10px 18px" },
      borderRadius: "18px",
      zIndex: 20,
    }}
  >
    <Typography
      sx={{
        fontSize: { lg: "22px", sm: "18px" },
        fontFamily: "Chewy",
        color: "#FFE1B3",
        textAlign: "center",
      }}
    >
      Let’s look here together 👀
    </Typography>
  </Box>
)}

          {/* arrow */}
          <Box
            component="img"
            src={arrow}
            sx={{
              width: { lg: "200px", sm: "130px" },
              height: { lg: "235px", sm: "160px" },
              marginLeft: { lg: "73%", sm: "70%" },
              marginTop: {lg:"-2%",sm:"-5%"}
            }}
          />

          {selectedImageSrc && (
            <Box
              component="img"
              src={selectedImageSrc}
              sx={{
                width: { lg: "120px", sm: "80px" },
                height: { lg: "112px", sm: "70px" },
                marginLeft: { lg: "62.8%", sm: "66%" },
                marginTop: {lg:"-22.2%",sm:"-27.5%"},
                transform:
                  selectedImageSrc === book
                    ? "translate(43px, 45px)"
                    : selectedImageSrc === fball
                    ? "translate(45px, 40px)"
                    : selectedImageSrc === full
                    ? "translate(45px, 40px)"
                    : "none",
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

export default Find;
