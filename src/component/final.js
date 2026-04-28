import * as React from 'react';
import { Box, Typography } from '@mui/material';
import './final.css';
import finalurdu from '../assests/finalurdu.mp4';
import learnbg from '../assests/learn_bg.png';
import cartoon from '../assests/final.gif';
import board from '../assests/board.png';
import brown from '../assests/brown_board.png';
import star1 from '../assests/1star.png';
import star2 from '../assests/2star.png';
import star3 from '../assests/3star.png';
import trybutton from '../assests/try.png';
import party from '../assests/partpopper.png';
import click from '../assests/click.png';
import { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import bg from '../assests/backbg.png';
import greenbg from '../assests/greenbg.png';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import amazing from '../assests/amazing.mpeg';
import { finishSession } from "@/lib/analytics/client";
import { consumeWonderworldSessionState } from "@/lib/analytics/sessionState";
import {
  buildWonderworldResultMetrics,
  resolveWonderworldModuleFromRoute,
} from "@/lib/analytics/mappers";
import { useFavoriteCharacter } from "@/hooks/useFavoriteCharacter";

function Final() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const favoriteCharacter = useFavoriteCharacter();
  const audioRef = useRef(null);
  const finalizedRef = useRef(false);
  const [starImg, setStarImg] = React.useState(star1);
  const [finalGifVersion, setFinalGifVersion] = React.useState(0);
  const bubblesLearnBg = "/assets/Bubbles/bubbles_bg_unified.png";
  const bubblesClappingGif = "/assets/Bubbles/bubbles_clapping.gif";
  const mimmiLearnBg = "/assets/Mimmi/mimmi_bg_unified_extended.png";
  const mimmiClappingGif = "/assets/Mimmi/clapping_mimmi.gif";
  const handleBack = () => navigate("/wonderworld");
  const starLayout = {
    width: { lg: "300px", sm: "200px" },
    height: { lg: "220px", sm: "150px" },
    marginLeft: starImg === star2
      ? { lg: "876px", sm: "56.5%" }
      : { lg: "870px", sm: "56%" },
    marginTop: starImg === star1
      ? { lg: "-52.8%", sm: "-68.5%" }
      : starImg === star2
      ? { lg: "-53.5%", sm: "-69%" }
      : { lg: "-49.5%", sm: "-65%" },
  };

  useEffect(() => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;

    let voiceKey = "cookie_voice_tries";
    let selectKey = "cookie_select_tries";
    let recentStarKey = "cookie";
    if (location.state?.from === "findcar") {
      voiceKey = "car_voice_tries";
      selectKey = "car_select_tries";
      recentStarKey = "car";
    } else if (location.state?.from === "findball") {
      voiceKey = "ball_voice_tries";
      selectKey = "ball_select_tries";
      recentStarKey = "ball";
    } else if (location.state?.from === "findshoe") {
      voiceKey = "shoe_voice_tries";
      selectKey = "shoe_select_tries";
      recentStarKey = "shoe";
    }

    const voiceTries = parseInt(localStorage.getItem(voiceKey) || "0", 10);
    const selectTries = parseInt(localStorage.getItem(selectKey) || "0", 10);
    const totalTries = voiceTries + selectTries;
    const successCount = 3; // two voice steps + one selection
    const percent = totalTries > 0 ? Math.round((successCount / totalTries) * 100) : 0;
    let starCount = 1;

    if (percent <= 33) {
      setStarImg(star1);
      starCount = 1;
    } else if (percent <= 66) {
      setStarImg(star2);
      starCount = 2;
    } else {
      setStarImg(star3);
      starCount = 3;
    }

    try {
      const raw = localStorage.getItem("ww_recent_stars");
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "ww_recent_stars",
        JSON.stringify({ ...current, [recentStarKey]: starCount })
      );
    } catch (_) {}

    const moduleKey = resolveWonderworldModuleFromRoute(location.state?.from);
    const storedSession = consumeWonderworldSessionState(moduleKey);

    if (storedSession?.sessionId) {
      const resultMetrics = buildWonderworldResultMetrics(
        voiceTries,
        selectTries,
        starCount
      );

      finishSession({
        sessionId: storedSession.sessionId,
        status: "completed",
        resultMetrics,
        emotionCounts: storedSession.emotionCounts,
        focusMetrics: storedSession.focusMetrics,
      }).catch((error) => {
        console.error("Failed to finish WonderWorld analytics session:", error);
      });
    }
  }, []);

useEffect(() => {
  const audio = audioRef.current;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;

    audio.play().catch(() => {
      setTimeout(() => audio.play().catch(() => {}), 1000);
    });
  }
}, [i18n.language]);

  useEffect(() => {
    const restartTimer = window.setInterval(() => {
      setFinalGifVersion((current) => current + 1);
    }, 4900);

    return () => {
      window.clearInterval(restartTimer);
    };
  }, []);


  const handleTry = () => {
    if (location.state?.from === "find") navigate("/learnobject");
    else if (location.state?.from === "findcar") navigate("/learnobjectcar");
    else if (location.state?.from === "findball") navigate("/learnobjball");
    else if (location.state?.from === "findshoe") navigate("/learnobjshoe");
    else navigate("/gameselection");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100dvh", minHeight: "100dvh", backgroundColor: "transparent" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
        <Box
          sx={{
            backgroundColor: "#0B3D2E",
            width: "100vw",
            height: "100dvh",
            opacity: "0.9",
            position: "absolute",
            backgroundAttachment: "fixed",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            backgroundImage: `url(${favoriteCharacter === "bubbles" ? bubblesLearnBg : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? mimmiLearnBg : learnbg})`,
            width: "100vw",
            height: "100dvh",
            minHeight: "100dvh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            position: "relative",
            backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 10cqh)" : "bottom center",
            overflow: "hidden",
            containerType: "size",
            "@media (min-width: 1200px) and (min-aspect-ratio: 3/2)": {
              backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 12cqh)" : "bottom center",
            },
            "@media (min-width: 1000px) and (max-width: 1100px) and (min-height: 1300px)": {
              backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 09cqh)" : "bottom center",
            },
            "@media (min-width: 1300px) and (max-width: 1400px) and (max-aspect-ratio: 1.4)": {
              backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 09cqh)" : "bottom center",
            },
          }}
        >
          <Box
            onClick={handleBack}
            sx={{
              position: "absolute",
              top: "5cqh",
              left: "5cqw",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { transform: "scale(1.08)", transition: "0.2s" },
            }}
          >
            <Box component="img" src={bg} sx={{ width: "max(8cqw, 12cqh)", height: "max(5.5cqh, 3.5cqw)" }} />
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

          <Box
            sx={{
              position: "absolute",
              bottom: "11cqh",
              left: "2cqw",
              width: "max(30cqw, 44cqh)",
              zIndex: 5,
              "@media (max-aspect-ratio: 1.55)": {
                bottom: "9cqh",
                left: "-1cqw",
              },
              "@media (min-width: 1000px) and (max-width: 1160px) and (max-height: 780px)": {
                bottom: "11cqh",
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "max(18.5cqw, 27.75cqh)",
                height: "auto",
                bottom: "94%",
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
                src={greenbg}
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  filter:
                    favoriteCharacter === "bubbles"
                      ? "hue-rotate(145deg) saturate(1.35) brightness(1.08)"
                      : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi"
                        ? "hue-rotate(65deg) saturate(1.18) brightness(1.05)"
                      : "none",
                }}
              />
              <Typography
                dir={i18n.language === "ur" ? "rtl" : "ltr"}
                sx={{
                  fontSize: i18n.language === "ur" ? "max(4cqw, 6cqh)" : "max(2.2cqw, 3.3cqh)",
                  position: "absolute",
                  top: "55%",
                  left: "52%",
                  transform: "translate(-50%, -70%)",
                  width: "75%",
                  textAlign: "left",
                  fontStyle: "normal",
                  lineHeight: "1.35",
                  fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                  fontWeight: i18n.language === "ur" ? 600 : 400,
                  letterSpacing: "1px",
                  color: "#fff",
                  opacity: "0.9",
                }}
              >
                {t("good")}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", width: "100%" }}>
              <Box
                component="img"
                src={favoriteCharacter === "bubbles" ? bubblesClappingGif : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? mimmiClappingGif : `${cartoon}?v=${finalGifVersion}`}
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                  transform: "translateY(2cqh) scale(1.05, 1.02)",
                  transformOrigin: "center",
                }}
              />
            </Box>
          </Box>

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
              containerType: "size",
              zIndex: 4,
            }}
          >
            <Box component="img" src={board} sx={{ width: "100%", height: "100%", borderRadius: "44.5px", position: "absolute" }} />

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

            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: starImg === star1 ? "36%" : starImg === star3 ? "43%" : "39%",
                transform: "translate(-50%, -50%)",
                width: starImg === star3 ? "50%" : "45%",
                height: "auto",
                zIndex: 4,
              }}
            >
              <Box
                component="img"
                src={starImg}
                className="star-animate"
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>

            <Box
              onClick={handleTry}
              sx={{
                position: "absolute",
                left: "50%",
                top: "61%",
                transform: "translateX(-50%)",
                width: "30%",
                height: "14%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: `url(${click}) 12 12, auto`,
                containerType: "size",
                zIndex: 6,
                "&:hover": { transform: "translateX(-50%) scale(1.08)" },
              }}
            >
              <Box
                component="img"
                src={trybutton}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
              />
              <Typography
                sx={{
                  position: "relative",
                  fontSize: i18n.language === "ur" ? "max(22px, 42cqh)" : "max(18px, 32cqh)",
                  fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                  color: "#FFCB8F",
                  cursor: `url(${click}) 12 12, auto`,
                  userSelect: "none",
                  lineHeight: 1,
                  zIndex: 1,
                }}
              >
                {t("try")}
              </Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "40%",
                transform: "translate(-50%, -50%)",
                width: "92%",
                height: "auto",
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              <Box
                component="img"
                src={party}
                className="party-animate"
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Box>

        <audio ref={audioRef} src={i18n.language === "ur" ? finalurdu : amazing} preload="auto" />
      </Box>
    </motion.div>
  );
}

export default Final;
