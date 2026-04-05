import * as React from 'react';
import { Box,Typography } from '@mui/material';
import learnbg from '../assests/learn_bg.png';
import board from '../assests/board.png';
import brown from '../assests/brown_board.png';
import bg from '../assests/greenbg.png';
import { useEffect, useRef } from "react";
import newgif from '../assests/finalgif.gif';
import standinglion from '../assests/standinglion.gif';
import stop from '../assests/stop.png';
import pause from '../assests/pause.png';
import retry from '../assests/retry.png';
import click from '../assests/click.png';
import backbg from '../assests/backbg.png';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate,useLocation } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import yourball from '../assests/yourball.mpeg';
import yoururdu from '../assests/yourballurdu.ogg';
import { cacheGameImage, getCachedGameImage, loadSavedGameImage } from "@/lib/gameImageStore";

export default function Ball() {
  const navigate = useNavigate();
  const {t}=useTranslation();
  const location = useLocation();
const audioRef = useRef(null);
const recognitionRef = useRef(null);
const retryListenRef = useRef(null);
const [isLionSpeaking, setIsLionSpeaking] = React.useState(false);
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
        audio.play().catch(() => console.log("Autoplay blocked"));
      }, 1000);
    });
  });
};
const [speechVerified, setSpeechVerified] = React.useState(false);
const [speechStatus, setSpeechStatus] = React.useState("");
const speechVerifiedRef = useRef(false);
const [uploadedImage, setUploadedImage] = React.useState(
  () => location.state?.uploadedImage || getCachedGameImage("ball")
);
const handleNext = () => {
  if (!speechVerified) return;
  navigate("/findball");
};

useEffect(() => {
  speechVerifiedRef.current = speechVerified;
}, [speechVerified]);

useEffect(() => {
  if (!speechVerified) return;
  const timeoutId = setTimeout(() => {
    navigate("/findball");
  }, 800);

  return () => clearTimeout(timeoutId);
}, [speechVerified, navigate]);

const incrementVoiceTries = () => {
  const current = parseInt(localStorage.getItem("ball_voice_tries") || "0", 10);
  localStorage.setItem("ball_voice_tries", String(current + 1));
};

useEffect(() => {
  const listenForBall = () =>
    new Promise((resolve, reject) => {
      const targetWord = i18n.language === "ur" ? "gaind" : "ball";
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechStatus("Speech recognition not supported on this device.");
        reject(new Error("SpeechRecognition not supported"));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 5;
      recognition.continuous = false;

      const startListening = () => {
        if (retryListenRef.current) {
          clearTimeout(retryListenRef.current);
          retryListenRef.current = null;
        }
        setSpeechVerified(false);
        setSpeechStatus(`Listening… say “${targetWord}”`);
        try {
          recognition.start();
        } catch (_) {}
      };

      recognition.onresult = (event) => {
        const transcripts = Array.from(event.results || []).flatMap((result) =>
          Array.from(result || []).map((item) => item.transcript.toLowerCase())
        );
        const transcript = transcripts[0] || "";
        const variants = [
          "ball",
          "bal",
          "boll",
          "bawl",
          "bol",
          "baal",
          "gaind",
          "gaen",
          "gain",
          "gand",
          "gaindh",
          "gainda",
          "gaynd",
          "gayn",
          "ghaind",
          "ghaenda",
          "گیند",
          "گیندا",
        ];
        const matches = transcripts.some((value) => {
          const normalized = value.replace(/[\s\-_.']/g, "");
          const words = value
            .split(/\s+/)
            .map((word) => word.replace(/[^a-z\u0600-\u06ff]/gi, "").toLowerCase())
            .filter(Boolean);

          if (variants.some((v) => normalized.includes(v) || words.includes(v))) {
            return true;
          }

          return words.some((word) => {
            if (word.length > 7) return false;
            if (/^ba/.test(word)) return true;
            if (/^bo/.test(word)) return true;
            if (/^gai/.test(word)) return true;
            if (/^gay/.test(word)) return true;
            if (/^gha/.test(word)) return true;
            if (/^گی/.test(word)) return true;
            return false;
          });
        });
        incrementVoiceTries();
        setSpeechStatus(`Heard: ${transcript}`);
        if (matches) {
          setSpeechVerified(true);
          speechVerifiedRef.current = true;
          setSpeechStatus(`Great! You said ${targetWord}.`);
          if (retryListenRef.current) {
            clearTimeout(retryListenRef.current);
            retryListenRef.current = null;
          }
          recognition.stop();
          resolve();
        } else {
          setSpeechVerified(false);
          speechVerifiedRef.current = false;
          setSpeechStatus(`Try again: say “${targetWord}”.`);
        }
      };

      recognition.onerror = () => {
        setSpeechStatus("Couldn't hear you. Try again.");
      };

      recognition.onend = () => {
        if (!speechVerifiedRef.current) {
          retryListenRef.current = setTimeout(startListening, 800);
        }
      };

      recognitionRef.current = recognition;
      startListening();
    });

  const runSequence = async () => {
    try {
      const audio = audioRef.current;
      if (!audio) return;
      setSpeechVerified(false);
      setSpeechStatus("");
      setIsLionSpeaking(false);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
      await playAndWait(audio);
      await listenForBall();
    } catch (e) {
      console.log("Audio error", e);
    }
  };

  runSequence();

  return () => {
    if (retryListenRef.current) {
      clearTimeout(retryListenRef.current);
      retryListenRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch (_) {}
    setIsLionSpeaking(false);
  };
}, [i18n.language]);

useEffect(() => {
  return () => {
    if (retryListenRef.current) {
      clearTimeout(retryListenRef.current);
      retryListenRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
  };
}, []);
useEffect(() => {
  if (!location.state?.uploadedImage) return;
  setUploadedImage(location.state.uploadedImage);
  cacheGameImage("ball", location.state.uploadedImage);
}, [location.state]);

useEffect(() => {
  let ignore = false;

  const hydrateSavedImage = async () => {
    try {
      const savedImage = await loadSavedGameImage("ball");
      if (!ignore && savedImage) {
        setUploadedImage(savedImage);
      }
    } catch (error) {
      console.error("Failed to load ball image:", error);
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
                onClick={() => navigate("/learnobjball")}
                sx={{
                  width: { lg: "40%", sm: "35%" },height:{ lg: "50%", sm: "40%" },
                  marginTop: {lg:"45px",sm:"65px"},
                  "&:hover": { transform: "scale(1.18)" },
                }}
              />

              <Typography
                onClick={() => navigate("/learnobjball")}
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
                onClick={handleNext}
                sx={{
                  width: { lg: "40%", sm: "35%" },
                height: { lg: "50%", sm: "40%" },
                   marginTop: {lg:"45px",sm:"65px"},
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />

              <Typography
                onClick={handleNext}
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
                  lg: i18n.language === "ur" ? "46px" : "33px",
                  sm: i18n.language === "ur" ? "40px" : "30px",
                },
                marginTop: {lg: i18n.language === "ur" ? "-8.3%" :"-9%",sm: i18n.language === "ur" ? "-14.8%" :"-15.5%"},
                marginLeft:{lg: i18n.language === "ur" ? "25.1%" :"26%",sm: i18n.language === "ur" ? "19%" :"18%"},
                width:{
                  lg: i18n.language === "ur" ? "20%" : "10%",
                  sm: i18n.language === "ur" ? "35%" : "20%",
                },
                whiteSpace: i18n.language === "ur" ? "nowrap" : "normal",
                fontFamily:
                  i18n.language === "ur"
                    ? "JameelNooriNastaleeq"
                    : "Chewy",
                color: "rgb(15,21,27,0.8)",
              }}
            >
              {t("yourball")}
            </Typography>

            <Box component="img" src={isLionSpeaking ? newgif : standinglion} sx={{ width:{lg:"390px",sm:"56%"}, ml: {lg:"150px",sm:"-10%"},mt:{lg:"-2%",sm:"0%"} }} />
          </Box>

          <Box component="img" src={board} sx={{ width: {lg:"659px",sm:"52%"}, ml: {lg:"723px",sm:"45%"}, mt: {lg:"-41%",sm:"-57%"} }} />

          <Typography
            sx={{
              fontSize: {
                lg: i18n.language === "ur" ? "62px" : "40px",
                sm: i18n.language === "ur" ? "34px" : "30px",
              },
              marginLeft: {lg: i18n.language === "ur" ? "60%" :"880px",sm: i18n.language === "ur" ? "62%" :"53%"},
              marginTop: {lg: i18n.language === "ur" ? "-35%" :"-33%",sm: i18n.language === "ur" ? "-45%" :"-44%"},
              marginBottom:"1%",
              fontFamily:
                i18n.language === "ur"
                  ? "JameelNooriNastaleeq"
                  : "Chewy",
              color: "rgba(130, 77, 31, 1)",
            }}
          >
            {t("sayBall")}
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
                  ? "تصدیق ہوگئی: گیند ✅"
                  : "Verified: ball ✅"
                : i18n.language === "ur"
                  ? "آگے جانے کے لیے گیند بولیں"
                  : "Say “ball” to continue"}
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
        <Box component='img' sx={{ width: {lg:"50px",sm:"27px"}, height: {lg:"50px",sm:"27px"}, marginLeft: {lg: i18n.language === "ur" ? "62.5%" :"940px",sm:"64%"}, marginTop: {lg: i18n.language === "ur" ? "-6%" :"-5.5%",sm:"-11%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={stop} />
        <Box component='img' sx={{ width: {lg: i18n.language === "ur" ? "60px" :"65px",sm:"35px"}, height: {lg: i18n.language === "ur" ? "60px" :"65px",sm:"35px"}, marginLeft: {lg: i18n.language === "ur" ? "67%" :"1000px",sm:"69%"}, marginTop: {lg: i18n.language === "ur" ? "-9%" :"-8.5%",sm:"-17.5%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={pause} />
        <Box component='img' sx={{ width: {lg:"50px",sm:"27px"}, height: {lg:"50px",sm:"27px"}, marginLeft: {lg: i18n.language === "ur" ? "72%" :"1075px",sm:"74.5%"}, marginTop: {lg: i18n.language === "ur" ? "-12.3%" :"-11.5%",sm:"-23.5%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={retry} />
<audio
  ref={audioRef}
  src={i18n.language === "ur" ? yoururdu : yourball}
  preload="auto"
/>        </Box>
      </Box>
    </motion.div>
  );
}
