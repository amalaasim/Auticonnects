import * as React from 'react';
import { Box, Typography } from '@mui/material';
import learnbg from '../assests/learn_bg.png';
import board from '../assests/board.png';
import brown from '../assests/brown_board.png';
import bg from '../assests/greenbg.png';
import newgif from '../assests/talking.gif';
import standinglion from '../assests/standinglion-loop.gif';
import stop from '../assests/stop.png';
import pause from '../assests/pause.png';
import play from '../assests/play.png';
import retry from '../assests/retry.png';
import click from '../assests/click.png';
import backbg from '../assests/backbg.png';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useLocation } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import yourshoe from '../assests/yourshoe.mpeg';
import yoururdu from '../assests/yourshoeurdu.ogg';
import noSound from '../assests/noshoe.mpeg';
import noUrduSound from '../assests/nourdu.mpeg';
import { cacheGameImage, getCachedGameImage, loadSavedGameImage } from "@/lib/gameImageStore";
import { cleanupWonderworldListening, listenForWonderworldWord } from "@/lib/wonderworldSpeech";
import { preloadImageAsset } from "@/lib/preloadImageAsset";

export default function Show() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const retryListenRef = useRef(null);
  const cancelListenRef = useRef(false);
  const allowListeningRef = useRef(true);
  const startListeningRef = useRef(null);
  const currentAudioRef = useRef(null);
  const isPausedRef = useRef(false);
  const sequenceCancelRef = useRef(false);
const [isLionSpeaking, setIsLionSpeaking] = React.useState(false);
const [isPaused, setIsPaused] = React.useState(false);

useEffect(() => {
  preloadImageAsset(newgif);
  preloadImageAsset(standinglion);
}, []);

const playAndWait = (audio) => {
    return new Promise((resolve) => {
      if (!audio) {
        setIsLionSpeaking(false);
        resolve();
        return;
      }
      setIsLionSpeaking(true);
      audio.onended = () => {
        setIsLionSpeaking(false);
        resolve();
      };
      audio.play().catch(() => {
        setIsLionSpeaking(false);
        setTimeout(() => {
          setIsLionSpeaking(true);
          audio.play().catch(() => console.log("Autoplay blocked"));
        }, 1000);
      });
    });
  };
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const handlePlay = () => setIsLionSpeaking(true);
  const handlePause = () => setIsLionSpeaking(false);
  const handleEnded = () => setIsLionSpeaking(false);

  audio.addEventListener("play", handlePlay);
  audio.addEventListener("playing", handlePlay);
  audio.addEventListener("pause", handlePause);
  audio.addEventListener("ended", handleEnded);

  return () => {
    audio.removeEventListener("play", handlePlay);
    audio.removeEventListener("playing", handlePlay);
    audio.removeEventListener("pause", handlePause);
    audio.removeEventListener("ended", handleEnded);
  };
}, [i18n.language]);
  const [speechVerified, setSpeechVerified] = React.useState(false);
  const [speechStatus, setSpeechStatus] = React.useState("");
  const speechVerifiedRef = useRef(false);
  const [uploadedImage, setUploadedImage] = React.useState(
    () => location.state?.uploadedImage || getCachedGameImage("shoe")
  );

useEffect(() => {
  speechVerifiedRef.current = speechVerified;
}, [speechVerified]);

useEffect(() => {
  if (!speechVerified) return;
  const timeoutId = setTimeout(() => {
    navigate("/findshoe");
  }, 800);

  return () => clearTimeout(timeoutId);
}, [speechVerified, navigate]);

const incrementVoiceTries = () => {
  const current = parseInt(localStorage.getItem("shoe_voice_tries") || "0", 10);
  localStorage.setItem("shoe_voice_tries", String(current + 1));
};

const playMistakeSound = () => {
  const audio = new Audio(i18n.language === "ur" ? noUrduSound : noSound);
  setIsLionSpeaking(true);
  audio.onended = () => setIsLionSpeaking(false);
  audio.onpause = () => setIsLionSpeaking(false);
  audio.play().catch(() => {});
};

const listenForShoe = () => {
  return listenForWonderworldWord({
    moduleKey: "shoe",
    language: i18n.language,
    recognitionRef,
    retryListenRef,
    speechVerifiedRef,
    cancelListenRef,
    allowListeningRef,
    startListeningRef,
    setSpeechVerified,
    setSpeechStatus,
    incrementVoiceTries,
    onMistake: playMistakeSound,
  });
};

useEffect(() => {

  const runSequence = async () => {
    try {
      const audio = audioRef.current;
      if (!audio) return;
      sequenceCancelRef.current = false;
      isPausedRef.current = false;
      allowListeningRef.current = true;
      cancelListenRef.current = false;
      setSpeechVerified(false);
      setSpeechStatus("");
      setIsLionSpeaking(false);
      setIsPaused(false);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
      currentAudioRef.current = audio;
      await playAndWait(audio);
      currentAudioRef.current = null;
      if (!cancelListenRef.current && !sequenceCancelRef.current) {
        await listenForShoe();
      }
    } catch (e) {
      console.log("Audio error", e);
    }
  };

  runSequence();

  return () => {
    cleanupWonderworldListening({
      recognitionRef,
      retryListenRef,
      cancelListenRef,
      allowListeningRef,
    });
    setIsLionSpeaking(false);
  };
}, [i18n.language]);

useEffect(() => {
  return () => {
    cleanupWonderworldListening({
      recognitionRef,
      retryListenRef,
      cancelListenRef,
      allowListeningRef,
    });
  };
}, []);

const handlePauseResume = () => {
  if (!isPausedRef.current) {
    isPausedRef.current = true;
    setIsPaused(true);
    allowListeningRef.current = false;
    if (retryListenRef.current) {
      clearTimeout(retryListenRef.current);
      retryListenRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    setIsLionSpeaking(false);
    setSpeechStatus("Paused");
  } else {
    isPausedRef.current = false;
    setIsPaused(false);
    allowListeningRef.current = true;
    if (currentAudioRef.current && currentAudioRef.current.paused) {
      setIsLionSpeaking(true);
      currentAudioRef.current.play().catch(() => {});
    } else if (startListeningRef.current) {
      try {
        startListeningRef.current();
      } catch (_) {}
    }
    setSpeechStatus("");
  }
};

const handleStop = () => {
  sequenceCancelRef.current = true;
  isPausedRef.current = false;
  setIsPaused(false);
  allowListeningRef.current = false;
  cancelListenRef.current = true;
  cleanupWonderworldListening({
    recognitionRef,
    retryListenRef,
    cancelListenRef,
    allowListeningRef,
  });
  if (audioRef.current) {
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } catch (_) {}
  }
  currentAudioRef.current = null;
  setSpeechVerified(false);
  setSpeechStatus("Stopped");
  setIsLionSpeaking(false);
};

const handleRestart = () => {
  handleStop();
  setTimeout(() => {
    const audio = audioRef.current;
    if (!audio) return;
    sequenceCancelRef.current = false;
    isPausedRef.current = false;
    setIsPaused(false);
    allowListeningRef.current = true;
    cancelListenRef.current = false;
    setSpeechVerified(false);
    setSpeechStatus("");
    setIsLionSpeaking(false);
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    currentAudioRef.current = audio;
    playAndWait(audio).then(() => {
      currentAudioRef.current = null;
      if (!cancelListenRef.current && !sequenceCancelRef.current) {
        listenForShoe();
      }
    });
  }, 0);
};

useEffect(() => {
  if (!location.state?.uploadedImage) return;
  setUploadedImage(location.state.uploadedImage);
  cacheGameImage("shoe", location.state.uploadedImage);
}, [location.state]);

useEffect(() => {
  let ignore = false;

  const hydrateSavedImage = async () => {
    try {
      const savedImage = await loadSavedGameImage("shoe");
      if (!ignore && savedImage) {
        setUploadedImage(savedImage);
      }
    } catch (error) {
      console.error("Failed to load shoe image:", error);
    }
  };

  hydrateSavedImage();

  return () => {
    ignore = true;
  };
}, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: "100vh", width: "100vw", overflow: "hidden" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
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

        <Box
          sx={{
            backgroundImage: `url(${learnbg})`,
            width: "100vw",
            minHeight: "100vh",
            height: "100vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            backgroundPosition: "center",
          }}
        >
          {/* TOP NAV */}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: "10%" }}>
            <Box sx={{ display: "flex" }}>
              <Box
                component="img"
                src={backbg}
                onClick={() => navigate("/learnobjshoe")}
                sx={{
                  width: { lg: "40%", sm: "35%" },height:{ lg: "50%", sm: "40%" },
                  marginTop: {lg:"45px",sm:"65px"},
                  "&:hover": { transform: "scale(1.18)" },
                }}
              />

              <Typography
                onClick={() => navigate("/learnobjshoe")}
                sx={{
                  fontSize: {
                    lg: i18n.language === "ur" ? "42px" : "35px",
                    sm: i18n.language === "ur" ? "32px" : "25px",
                  },
                  marginTop: {lg:"0%",sm:"9.5%"},
                 "&:hover": { transform: "scale(1.18)" },
                  paddingTop: "14%",
                  marginLeft: {lg:i18n.language === "ur" ? "-36%" : "-38%",sm:i18n.language === "ur" ? "-33%" : "-33%"},
                  fontFamily:
                    i18n.language === "ur"
                      ? "JameelNooriNastaleeq"
                      : "Chewy",
                  color: "rgba(255, 203, 143, 1)",
                  cursor: "pointer",
                }}
              >
                <KeyboardArrowLeftIcon sx={{ fontSize: 25 }} />
                {t("back")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex" }}>
              <Box
                component="img"
                src={backbg}
                onClick={() => navigate("/findshoe")}
                sx={{
                  width: { lg: "40%", sm: "35%" },
                height: { lg: "50%", sm: "40%" },
                   marginTop: {lg:"45px",sm:"65px"},
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />

              <Typography
                onClick={() => {
                  if (!speechVerified) return;
                  navigate("/findshoe");
                }}
                               sx={{
                  fontSize: {
                    lg: i18n.language === "ur" ? "42px" : "35px",
                    sm: i18n.language === "ur" ? "32px" : "25px",
                  },
                  marginTop: {lg:"0%",sm:"9.5%"},
                 "&:hover": { transform: "scale(1.18)" },
                  paddingTop: "14%",
                  marginLeft: {lg:i18n.language === "ur" ? "-36%" : "-33.5%",sm:i18n.language === "ur" ? "-27%" : "-28%"},
                  fontFamily:
                    i18n.language === "ur"
                      ? "JameelNooriNastaleeq"
                      : "Chewy",
                  color: "rgba(255, 203, 143, 1)",
                  cursor: "pointer",
                }}
              >
                {t("next")}
                <KeyboardArrowRightIcon sx={{ fontSize: 25 }} />
              </Typography>
            </Box>
          </Box>

          {/* CENTER */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box component="img" src={bg} sx={{ width: {lg: i18n.language === "ur" ? "250px" :"280px",sm:"220px"}, ml: {lg:"350px",sm:"110px"}, mt: {lg: i18n.language === "ur" ? "7%" :"5%",sm:"18%"} }} />

            <Typography
              sx={{
                fontSize: {
                  lg: i18n.language === "ur" ? "37px" : "33px",
                  sm: i18n.language === "ur" ? "31px" : "30px",
                },
                marginTop: {lg: i18n.language === "ur" ? "-8.3%" :"-9%",sm: i18n.language === "ur" ? "-14.8%" :"-15.5%"},
                marginLeft:{lg: i18n.language === "ur" ? "calc(24.1% + 20px)" :"26%",sm: i18n.language === "ur" ? "calc(17% + 20px)" :"18%"},
                width:{
                  lg: i18n.language === "ur" ? "22%" : "15%",
                  sm: i18n.language === "ur" ? "42%" : "30%",
                },
                whiteSpace: i18n.language === "ur" ? "nowrap" : "normal",
                fontFamily:
                  i18n.language === "ur"
                    ? "JameelNooriNastaleeq"
                    : "Chewy",
                color: "rgb(15,21,27,0.8)",
              }}
            >
              {t("your")}
            </Typography>

            <Box component="img" src={isLionSpeaking ? newgif : standinglion} loading="eager" decoding="async" sx={{ width:{lg:"390px",sm:"56%"}, ml: {lg:"150px",sm:"-10%"} }} />
          </Box>

          <Box component="img" src={board} sx={{ width: {lg:"659px",sm:"52%"}, ml: {lg:"723px",sm:"45%"}, mt: {lg:"-43%",sm:"-57%"} }} />

          <Typography
            sx={{
              fontSize: {
                lg: i18n.language === "ur" ? "62px" : "40px",
                sm: i18n.language === "ur" ? "34px" : "30px",
              },
              marginLeft: {lg: i18n.language === "ur" ? "60%" :"880px",sm: i18n.language === "ur" ? "62%" :"53%"},
              marginTop: {lg: i18n.language === "ur" ? "-35%" :"-34%",sm: i18n.language === "ur" ? "-45%" :"-44%"},
              marginBottom:"1%",
              fontFamily:
                i18n.language === "ur"
                  ? "JameelNooriNastaleeq"
                  : "Chewy",
              color: "rgba(130, 77, 31, 1)",
            }}
          >
            {t("sayShoes")}
          </Typography>

          <Box component="img" src={brown} sx={{ width:{lg:"518px",sm:"35%"},height:{lg:"250px",sm:"20%"}, ml: {lg:"780px",sm:"53%"} }} />

          {uploadedImage && (
            <Box
              component="img"
              src={uploadedImage}
              sx={{ width: {lg:"200px",sm:"100px"}, height: {lg:"180px",sm:"100px"}, ml:{lg:"935px",sm:"64%"}, mt: {lg:"-19%",sm:"-23%"} }}
            />
          )}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: { lg: "22px", sm: "12px" },
              backgroundColor: "rgba(0,0,0,0.55)",
              padding: "8px 14px",
              borderRadius: "14px",
              zIndex: 10,
            }}
          >
            <Typography
              sx={{
                fontSize: { lg: "16px", sm: "14px" },
                fontFamily: "Chewy",
                color: speechVerified ? "#B9FFB3" : "#FFE1B3",
              }}
            >
              {speechVerified
                ? i18n.language === "ur"
                  ? "تصدیق ہوگئی: جوتے ✅"
                  : "Verified: shoes ✅"
                : i18n.language === "ur"
                  ? "آگے جانے کے لیے جوتے بولیں"
                  : "Say “shoes” to continue"}
            </Typography>
            {speechStatus && (
              <Typography
                sx={{
                  fontSize: { lg: "12px", sm: "11px" },
                  fontFamily: "Chewy",
                  color: "#fff",
                  opacity: 0.9,
                  marginTop: "4px",
                }}
              >
                {speechStatus}
              </Typography>
            )}
          </Box>
        <Box component='img' onClick={handleStop} sx={{ width: {lg:"50px",sm:"27px"}, height: {lg:"50px",sm:"27px"}, marginLeft: {lg: i18n.language === "ur" ? "65.5%" :"980px",sm:"68%"}, marginTop: {lg: i18n.language === "ur" ? "-6%" :"-5.5%",sm:"-11%"}, cursor: "pointer", position: "relative", zIndex: 10, pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={stop} />
        <Box component='img' onClick={handlePauseResume} sx={{ width: {lg: i18n.language === "ur" ? "60px" :"65px",sm:"35px"}, height: {lg: i18n.language === "ur" ? "60px" :"65px",sm:"35px"}, marginLeft: {lg: i18n.language === "ur" ? "70%" :"1040px",sm:"73%"}, marginTop: {lg: i18n.language === "ur" ? "-9%" :"-8.5%",sm:"-17.5%"}, cursor: "pointer", position: "relative", zIndex: 10, pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={isPaused ? play : pause} />
        <Box component='img' onClick={handleRestart} sx={{ width: {lg:"50px",sm:"27px"}, height: {lg:"50px",sm:"27px"}, marginLeft: {lg: i18n.language === "ur" ? "75%" :"1115px",sm:"78.5%"}, marginTop: {lg: i18n.language === "ur" ? "-12.3%" :"-11.5%",sm:"-23.5%"}, cursor: "pointer", position: "relative", zIndex: 10, pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={retry} />
<audio
  ref={audioRef}
  src={i18n.language === "ur" ? yoururdu : yourshoe}
  preload="auto"
/>        </Box>
      </Box>
    </motion.div>
  );
}
