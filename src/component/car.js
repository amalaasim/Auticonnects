import * as React from 'react';
import { Box,Typography } from '@mui/material';
import learnbg from '../assests/learn_bg.png';
import board from '../assests/board.png';
import brown from '../assests/brown_board.png';
import bg from '../assests/greenbg.png';
import newgif from '../assests/finalgif.gif';
import standinglion from '../assests/standinglion.gif';
import { useEffect, useRef } from "react";
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
import yourcar from '../assests/yourcar.mpeg';
import yourcarurdu from '../assests/yourcarurdu.ogg';
import { cacheGameImage, getCachedGameImage, loadSavedGameImage } from "@/lib/gameImageStore";
import { listenForWonderworldWord, stopWonderworldListening } from "@/lib/wonderworldSpeech";
export default function Car() {
  const navigate = useNavigate();
  const {t}=useTranslation();
  const location = useLocation();
const audioRef = useRef(null);
const recognitionRef = useRef(null);
const retryListenRef = useRef(null);
const cancelListenRef = useRef(false);
const allowListeningRef = useRef(true);
const [speechVerified, setSpeechVerified] = React.useState(false);
const [speechStatus, setSpeechStatus] = React.useState("");
const [isLionSpeaking, setIsLionSpeaking] = React.useState(false);
const speechVerifiedRef = useRef(false);
const [uploadedImage, setUploadedImage] = React.useState(
  () => location.state?.uploadedImage || getCachedGameImage("car")
);
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

useEffect(() => {
  speechVerifiedRef.current = speechVerified;
}, [speechVerified]);

useEffect(() => {
  if (!speechVerified) return;
  const timeoutId = setTimeout(() => {
    navigate("/findcar");
  }, 800);

  return () => clearTimeout(timeoutId);
}, [speechVerified, navigate]);

const incrementVoiceTries = () => {
  const current = parseInt(localStorage.getItem("car_voice_tries") || "0", 10);
  localStorage.setItem("car_voice_tries", String(current + 1));
};

const listenForCar = () =>
  listenForWonderworldWord({
    moduleKey: "car",
    language: i18n.language,
    recognitionRef,
    retryListenRef,
    speechVerifiedRef,
    cancelListenRef,
    allowListeningRef,
    setSpeechVerified,
    setSpeechStatus,
    incrementVoiceTries,
  });

useEffect(() => {

  const runSequence = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    allowListeningRef.current = true;
    cancelListenRef.current = false;
    setSpeechVerified(false);
    setSpeechStatus("");
    setIsLionSpeaking(false);
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    await playAndWait(audio);
    if (!cancelListenRef.current) {
      await listenForCar();
    }
  };

  runSequence();

  return () => {
    stopWonderworldListening({
      recognitionRef,
      retryListenRef,
      cancelListenRef,
      allowListeningRef,
    });
    if (audioRef.current) audioRef.current.onended = null;
    setIsLionSpeaking(false);
  };
}, [i18n.language]);

useEffect(() => {
  return () => {
    stopWonderworldListening({
      recognitionRef,
      retryListenRef,
      cancelListenRef,
      allowListeningRef,
    });
  };
}, []);
useEffect(() => {
  if (!location.state?.uploadedImage) return;
  setUploadedImage(location.state.uploadedImage);
  cacheGameImage("car", location.state.uploadedImage);
}, [location.state]);

useEffect(() => {
  let ignore = false;

  const hydrateSavedImage = async () => {
    try {
      const savedImage = await loadSavedGameImage("car");
      if (!ignore && savedImage) {
        setUploadedImage(savedImage);
      }
    } catch (error) {
      console.error("Failed to load car image:", error);
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
                onClick={() => navigate("/learnobjectcar")}
                sx={{
                  width: { lg: "40%", sm: "35%" },height:{ lg: "50%", sm: "40%" },
                  marginTop: {lg:"45px",sm:"65px"},
                  "&:hover": { transform: "scale(1.18)" },
                }}
              />

              <Typography
                onClick={() => navigate("/learnobjectcar")}
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
                onClick={() => navigate("/findcar")}
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
                  navigate("/findcar");
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
                  lg: i18n.language === "ur" ? "46px" : "33px",
                  sm: i18n.language === "ur" ? "40px" : "30px",
                },
                marginTop: {lg: i18n.language === "ur" ? "-8.3%" :"-9%",sm: i18n.language === "ur" ? "-14.8%" :"-15.5%"},
                marginLeft:{lg: i18n.language === "ur" ? "24.5%" :"26%",sm: i18n.language === "ur" ? "17%" :"18%"},
                width:{lg:i18n.language==="ur"?"15%":"10%",sm:i18n.language==="ur"?"25%":"20%"},
                fontFamily:
                  i18n.language === "ur"
                    ? "JameelNooriNastaleeq"
                    : "Chewy",
                color: "rgb(15,21,27,0.8)",
              }}
            >
              {t("yourcar")}
            </Typography>

            <Box component="img" src={isLionSpeaking ? newgif : standinglion} sx={{ width:{lg:"350px",sm:"56%"}, ml: {lg:"150px",sm:"-10%"} }} />
          </Box>

          <Box component="img" src={board} sx={{ width: {lg:"659px",sm:"52%"}, ml: {lg:"723px",sm:"45%"}, mt: {lg:"-38%",sm:"-57%"} }} />

          <Typography
            sx={{
              fontSize: {
                lg: i18n.language === "ur" ? "62px" : "40px",
                sm: i18n.language === "ur" ? "34px" : "30px",
              },
              marginLeft: {lg: i18n.language === "ur" ? "60%" :"880px",sm: i18n.language === "ur" ? "62%" :"53%"},
              marginTop: {lg: i18n.language === "ur" ? "-33%" :"-32%",sm: i18n.language === "ur" ? "-45%" :"-44%"},
              marginBottom:"1%",
              fontFamily:
                i18n.language === "ur"
                  ? "JameelNooriNastaleeq"
                  : "Chewy",
              color: "rgba(130, 77, 31, 1)",
            }}
          >
            {t("saycar")}
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
                  ? "تصدیق ہوگئی: گاڑی ✅"
                  : "Verified: car ✅"
                : i18n.language === "ur"
                  ? "آگے جانے کے لیے گاڑی بولیں"
                  : "Say “car” to continue"}
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
          <audio ref={audioRef}   src={i18n.language === "ur" ? yourcarurdu : yourcar}
 preload="auto" />
        </Box>
      </Box>
    </motion.div>
  );
}
