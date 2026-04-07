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

function Final() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const audioRef = useRef(null);
  const finalizedRef = useRef(false);
  const [starImg, setStarImg] = React.useState(star1);
  const [finalGifVersion, setFinalGifVersion] = React.useState(0);
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

          {/* back */}
          <Box sx={{ display: "flex", marginLeft: "-1.7%" }}>
            <Box
              component="img"
              src={bg}
              onClick={handleBack}
              sx={{
                width: { lg: "9%", sm: "18%" },
                marginLeft: { lg: "12%", sm: "10%" },
                height: "10%",
                marginTop: { lg: "45px", sm: "10%" },
                "&:hover": { transform: "scale(1.18)" },
              }}
            />

            <Typography
              onClick={handleBack}
              sx={{
                fontSize: {
                  lg: i18n.language === "ur" ? "37px" : "35px",
                  sm: i18n.language === "ur" ? "35px" : "40px",
                },
                marginTop: { lg: "2.7%", sm: 18n.language === "ur" ? "9.5%":"9.2%" },
                marginLeft: { lg: "-7.95%", sm:18n.language === "ur" ?  "-14.5%":"-16.5%" },
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                color: "rgba(255, 203, 143, 1)",
                cursor: "pointer",
                                "&:hover": { transform: "scale(1.18)" },
              }}
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: 25 }} />
              {t("back")}
            </Typography>
          </Box>

          {/* GOOD */}
          <Box>
            <Box
              component="img"
              src={greenbg}
              sx={{
                width: { lg: "264px", sm: "200px" },
                height: { lg: "130px", sm: "100px" },
                marginTop: { lg: "4%", sm: "20%" },
                marginLeft: { lg: "390px", sm: "15%" },
              }}
            />

            <Typography
              dir={i18n.language === "ur" ? "rtl" : "ltr"}
              sx={{
                fontSize: {
                  lg: i18n.language === "ur" ? "60px" : "35px",
                  sm: i18n.language === "ur" ? "52px" : "30px",
                },
                marginTop: { lg: i18n.language==="ur"?"-8.5%":"-6.5%", sm:18n.language === "ur" ?  "-15.5%":"-10.5%" },
                marginLeft: { lg: i18n.language === "ur" ? "29%" : "29%", sm: i18n.language === "ur" ? "24.5%" : "18%" },
                marginRight: { lg: i18n.language==="ur"?"62%":"0%", sm:  i18n.language==="ur"?"65%":"0%" },
                transform: {
                  lg: i18n.language === "ur" ? "translate(44px, 8px)" : "none",
                  sm: i18n.language === "ur" ? "translate(32px, 6px)" : "none",
                },
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                fontWeight: i18n.language === "ur" ? "600" : "400",
                color: "rgba(15,21,27,0.8)",
              }}
            >
              {t("good")}
            </Typography>
          </Box>

          {/* cartoon */}
          <Box
            component="img"
            src={`${cartoon}?v=${finalGifVersion}`}
            sx={{
              width: { lg: "401px", sm: "290px" },
              height: { lg: "405px", sm: "290px" },
              marginLeft: { lg: "190px", sm: "%" },
              marginTop: { lg: "2px", sm: "-1px" },
            }}
          />

          {/* boards */}
          <Box
            component="img"
            src={board}
            sx={{
              width: { lg: "658px", sm: "60%" },
              height: { lg: "450px", sm: "auto" },
              marginLeft: { lg: "693px", sm: "41%" },
              marginTop: { lg: "-36%", sm: "-50%" },
            }}
          />

          <Box
            component="img"
            src={brown}
            sx={{
              width: { lg: "518px", sm: "44%" },
              height: { lg: "300px", sm: "25%" },
              marginLeft: { lg: "752px", sm: "47.5%" },
              marginTop: { lg: "-39.5%", sm: "-60%" },
            }}
          />

          <Box
            component="img"
            src={starImg}
            className="star-animate"
            sx={{
              width: starLayout.width,
              height: starLayout.height,
              objectFit: "contain",
              marginLeft: starLayout.marginLeft,
              marginTop: starLayout.marginTop,
            }}
          />

          {/* try button */}
          <Box
            onClick={handleTry}
            sx={{
              position: "relative",
              width: { lg: "180px", sm: "150px" },
              height: { lg: "92px", sm: "72px" },
              marginTop: { lg: "calc(-36.5% + 230px)", sm: "calc(-48% + 230px)" },
              marginLeft: { lg: "calc(65.5% - 10px)", sm: "calc(66.2% - 10px)" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: `url(${click}) 12 12, auto`,
              zIndex: 3,
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
                fontSize: {
                  lg: i18n.language === "ur" ? "37px" : "27px",
                  sm: i18n.language === "ur" ? "28px" : "24px",
                },
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                color: "rgba(255, 203, 143, 1)",
                cursor: `url(${click}) 12 12, auto`,
                userSelect: "none",
                zIndex: 1,
              }}
            >
              {t("try")}
            </Typography>
          </Box>


          <Box
            component="img"
            src={party}
            className="party-animate"
            sx={{
              width: { lg: "600px", sm: "380px" },
              height: { lg: "490px", sm: "310px" },
              marginLeft: { lg: "700px", sm: "45%" },
              marginTop: { lg: "calc(-41.5% + 110px)", sm: "calc(-69% + 110px)" },
              pointerEvents: "none",
              position: "relative",
              zIndex: 1,

            }}
          />

        </Box>

<audio
  ref={audioRef}
  src={i18n.language === "ur" ? finalurdu : amazing}
  preload="auto"
/>
      </Box>
    </motion.div>
  );
}

export default Final;
