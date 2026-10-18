import * as React from 'react';
import { Box, Typography } from '@mui/material';
import learnbg from '../assests/learn_bg.png';
import board from '../assests/board.png';
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
import { cacheGameImage, getCachedGameImage, loadSavedGameImage } from "@/lib/gameImageStore";
import { preloadImageAsset } from "@/lib/preloadImageAsset";
import { useFavoriteCharacter } from "@/hooks/useFavoriteCharacter";

// Phones held sideways: same breakpoint as the Tailwind "mland" screen.
const phoneLandscape = "@media (orientation: landscape) and (max-height: 500px)";

// Layout mirrors car.js / showball.js so the three "show your own" pages look the same.
export default function Show() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const audioRef = useRef(null);
  const favoriteCharacter = useFavoriteCharacter();
  const bubblesLearnBg = "/assets/Bubbles/bubbles_bg_unified.png";
  const bubblesTalkingGif = "/assets/Bubbles/talking.gif";
  const bubblesStandingGif = "/assets/Bubbles/standing-loop.gif";
  const mimmiLearnBg = "/assets/Mimmi/mimmi_bg_unified_extended.png";
  const mimmiTalkingGif = "/assets/Mimmi/talking_mimmi.gif";
  const mimmiStandingGif = "/assets/Mimmi/standing_mimmi.gif";
  const isBubbles = favoriteCharacter === "bubbles";
  const isMimmi = favoriteCharacter === "mimmi" || favoriteCharacter === "mimi";
  const isAltCharacter = isBubbles || isMimmi;
  const [isLionSpeaking, setIsLionSpeaking] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState(
    () => location.state?.uploadedImage || getCachedGameImage("shoe")
  );

  useEffect(() => {
    preloadImageAsset(newgif);
    preloadImageAsset(standinglion);
    preloadImageAsset(bubblesTalkingGif);
    preloadImageAsset(bubblesStandingGif);
    preloadImageAsset(bubblesLearnBg);
    preloadImageAsset(mimmiTalkingGif);
    preloadImageAsset(mimmiStandingGif);
    preloadImageAsset(mimmiLearnBg);
  }, [bubblesLearnBg, bubblesStandingGif, bubblesTalkingGif, mimmiLearnBg, mimmiStandingGif, mimmiTalkingGif]);

  // Play the narration on entry and animate the mascot while it talks.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handlePlaying = () => setIsLionSpeaking(true);
    const handlePause = () => setIsLionSpeaking(false);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);

    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    setIsPaused(false);
    audio.play().catch(() => {
      setTimeout(() => {
        audio.play().catch(() => console.log("Autoplay blocked"));
      }, 1000);
    });

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
      audio.pause();
    };
  }, [i18n.language]);

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

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPaused(false);
    } else {
      audio.pause();
      setIsPaused(true);
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPaused(false);
    audio.play().catch(() => {});
  };

  const mascotSrc = isBubbles
    ? (isLionSpeaking ? bubblesTalkingGif : bubblesStandingGif)
    : isMimmi
      ? (isLionSpeaking ? mimmiTalkingGif : mimmiStandingGif)
      : (isLionSpeaking ? newgif : standinglion);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: "100vh", backgroundColor: "transparent" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
        <Box
          sx={{
            backgroundColor: "#0B3D2E",
            width: "100vw",
            height: "100vh",
            opacity: "0.9",
            position: "absolute",
            backgroundAttachment: "fixed",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            backgroundImage: `url(${isBubbles ? bubblesLearnBg : isMimmi ? mimmiLearnBg : learnbg})`,
            width: "100vw",
            // Explicit height is required: with only min-height, container-type:size makes every cqh unit resolve to 0.
            height: "100dvh",
            minHeight: "100dvh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            position: "relative",
            backgroundPosition: isMimmi ? "center calc(100% + 10cqh)" : "bottom center",
            overflow: "hidden",
            containerType: "size",
            "@media (min-width: 1200px) and (min-aspect-ratio: 3/2)": {
              backgroundPosition: isMimmi ? "center calc(100% + 12cqh)" : "bottom center",
            },
            "@media (min-width: 1000px) and (max-width: 1100px) and (min-height: 1300px)": {
              backgroundPosition: isMimmi ? "center calc(100% + 09cqh)" : "bottom center",
            },
            "@media (min-width: 1300px) and (max-width: 1400px) and (max-aspect-ratio: 1.4)": {
              backgroundPosition: isMimmi ? "center calc(100% + 09cqh)" : "bottom center",
            },
          }}
        >
          {/* Back */}
          <Box
            onClick={() => navigate("/learnobjshoe")}
            sx={{
              position: "absolute",
              top: "7cqh",
              left: "5cqw",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { transform: "scale(1.08)", transition: "0.2s" },
            }}
          >
            <Box component="img" src={backbg} sx={{ width: "max(8cqw, 12cqh)", height: "max(5.5cqh, 3.5cqw)" }} />
            <Typography
              sx={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                fontSize: "max(1.8cqw, 2.7cqh)",
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                color: "#FFCB8F",
                letterSpacing: "1px",
                lineHeight: "1",
                marginTop: "-2%",
              }}
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: "max(2cqw, 3cqh)", mr: 0.5, stroke: "currentColor", strokeWidth: 0.5 }} />
              {t("back")}
            </Typography>
          </Box>

          {/* Next */}
          <Box
            onClick={() => navigate("/findshoe")}
            sx={{
              position: "absolute",
              top: "7cqh",
              right: "5cqw",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { transform: "scale(1.08)" },
              transition: "all 0.3s ease",
            }}
          >
            <Box component="img" src={backbg} sx={{ width: "max(10cqw, 15cqh)", height: "max(5.5cqh, 3.5cqw)" }} />
            <Typography
              sx={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                fontSize: "max(1.6cqw, 2.4cqh)",
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                color: "#FFCB8F",
                letterSpacing: "0.5px",
                lineHeight: "1",
                marginTop: "-2%",
              }}
            >
              {t("next")}
              <KeyboardArrowRightIcon sx={{ fontSize: "max(1.8cqw, 2.7cqh)", ml: 0.5, stroke: "currentColor", strokeWidth: 0.5 }} />
            </Typography>
          </Box>

          {/* Mascot + speech bubble */}
          <Box
            sx={{
              position: "absolute",
              bottom: isAltCharacter ? "9cqh" : "16cqh",
              left: "3cqw",
              width: isAltCharacter ? "max(32cqw, 48cqh)" : "max(26cqw, 39cqh)",
              zIndex: 5,
              "@media (max-aspect-ratio: 1.55)": {
                left: "-1cqw",
              },
              "@media (min-aspect-ratio: 1.55)": {
                bottom: isAltCharacter ? "11cqh" : "16cqh",
              },
              "@media (min-width: 1000px) and (max-width: 1160px) and (max-height: 780px)": {
                bottom: isAltCharacter ? "10cqh" : "16cqh",
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "max(20cqw, 30cqh)",
                height: "auto",
                bottom: "88%",
                left: "50%",
                zIndex: 6,
                "@media (max-aspect-ratio: 4/3)": {
                  width: "22cqw",
                  left: "40%",
                },
              }}
            >
              <Box
                component="img"
                src={bg}
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  filter: isBubbles
                    ? "hue-rotate(145deg) saturate(1.35) brightness(1.08)"
                    : isMimmi
                      ? "hue-rotate(65deg) saturate(1.18) brightness(1.05)"
                      : "none",
                }}
              />
              <Typography
                sx={{
                  fontSize: i18n.language === "ur" ? "max(3.2cqw, 4.8cqh)" : "max(2.2cqw, 3.3cqh)",
                  position: "absolute",
                  top: "55%",
                  left: "52%",
                  transform: "translate(-50%, -70%)",
                  width: "75%",
                  textAlign: "left",
                  fontStyle: "normal",
                  lineHeight: "1.6",
                  fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                  letterSpacing: "1px",
                  color: "rgb(15, 21, 27,0.8)",
                  opacity: "0.9",
                }}
              >
                {t("your")}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", width: "100%" }}>
              {!isLionSpeaking && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "39.5%",
                    left: "30.5%",
                    width: "39%",
                    height: "12.5%",
                    backgroundColor: "#000",
                    borderRadius: "999px",
                    opacity: 1,
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />
              )}
              <Box
                component="img"
                src={mascotSrc}
                loading="eager"
                decoding="async"
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                  transform: isLionSpeaking
                    ? (isAltCharacter ? "translateY(2cqh) scaleX(1.03)" : "scaleX(1.03)")
                    : "translateY(2cqh) scale(1.05, 1.02)",
                  transformOrigin: "center",
                }}
              />
            </Box>
          </Box>

          {/* Board */}
          <Box
            sx={{
              position: "absolute",
              right: "2cqw",
              bottom: "16cqh",
              width: "max(55cqw, 82cqh)",
              aspectRatio: "658 / 481",
              "@media (min-aspect-ratio: 1.5)": {
                aspectRatio: "658 / 440",
              },
              "@media (max-aspect-ratio: 1.55)": {
                width: "max(65cqw, 92cqh)",
                right: "-2cqw",
                bottom: "14cqh",
              },
              "@media (min-width: 1160px) and (max-width: 1250px) and (min-height: 800px) and (max-height: 900px)": {
                bottom: "12cqh",
              },
              "@media (min-width: 1000px) and (max-width: 1160px) and (max-height: 780px)": {
                bottom: "14cqh",
              },
              "@media (min-width: 1300px) and (max-aspect-ratio: 1.4)": {
                width: "max(55cqw, 82cqh)",
                right: "-1cqw",
                bottom: "12cqh",
              },
              // Phones held sideways: 55cqw makes the board taller than the screen, so cap it. Listed last so it wins.
              [phoneLandscape]: { width: "max(44cqw, 62cqh)", right: "2cqw", bottom: "12cqh" },
              zIndex: 4,
            }}
          >
            <Box component="img" src={board} sx={{ width: "100%", height: "100%", borderRadius: "44.5px", position: "absolute" }} />
            <Typography
              sx={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
                top: "12%",
                fontSize: {
                  lg: i18n.language === "ur" ? "max(4.5cqw, 6.5cqh)" : "max(2.8cqw, 4.2cqh)",
                  sm: i18n.language === "ur" ? "max(3.5cqw, 5cqh)" : "max(2.5cqw, 3.8cqh)",
                },
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "90%",
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                letterSpacing: "1px",
                color: "#824D1F",
                mixBlendMode: "multiply",
                textShadow: "0px -1.19314px 4.77256px #FFCB8F",
                zIndex: 2,
              }}
            >
              {t("sayShoes")}
            </Typography>

            <Box
              sx={{
                position: "absolute",
                width: "78.6%",
                height: "62.3%",
                left: "8.6%",
                top: "22.5%",
                zIndex: 2,
                background: "#863F2C",
                mixBlendMode: "multiply",
                boxShadow: "0px -1.30781px 5.23125px #FFCB8F, inset 0px 5.23125px 5.23125px rgba(0, 0, 0, 0.25)",
                borderRadius: "25.056px",
              }}
            />

            {uploadedImage && (
              <Box
                component="img"
                src={uploadedImage}
                sx={{
                  position: "absolute",
                  left: "12.5%",
                  top: "22.5%",
                  width: "70.7%",
                  height: "62.3%",
                  objectFit: "contain",
                  zIndex: 3,
                }}
              />
            )}

            <Box
              sx={{
                position: "absolute",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "30%",
                left: "47.9%",
                bottom: "10.5%",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            >
              <Box component="img" onClick={handleStop} sx={{ width: "25%", height: "auto", objectFit: "contain", cursor: "pointer", pointerEvents: "auto", "&:hover": { transform: "scale(1.28)" } }} src={stop} />
              <Box component="img" onClick={handlePauseResume} sx={{ width: "33%", height: "auto", objectFit: "contain", cursor: "pointer", pointerEvents: "auto", "&:hover": { transform: "scale(1.28)" } }} src={isPaused ? play : pause} />
              <Box component="img" onClick={handleRestart} sx={{ width: "25%", height: "auto", objectFit: "contain", cursor: "pointer", pointerEvents: "auto", "&:hover": { transform: "scale(1.28)" } }} src={retry} />
            </Box>
          </Box>

          <audio ref={audioRef} src={i18n.language === "ur" ? yoururdu : yourshoe} preload="auto" />
        </Box>
      </Box>
    </motion.div>
  );
}
