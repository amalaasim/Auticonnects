import * as React from 'react';
import { Box, Typography } from '@mui/material';
import learnbg from '../assests/learn_bg.png';
import board from '../assests/board.png';
import brown from '../assests/brown_board.png';
import bg from '../assests/greenbg.png';
import newgif from '../assests/gifnew.gif';
import stop from '../assests/stop.png';
import pause from '../assests/pause.png';
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

export default function Show() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const audioRef = useRef(null);

 useEffect(() => {
  const audio = audioRef.current;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    audio.play().catch(() => {
      setTimeout(() => {
        audio.play().catch(() => console.log("Autoplay blocked"));
      }, 1000);
    });
  }
}, [i18n.language]);

  const uploadedImage =
    location.state?.uploadedImage || localStorage.getItem("uploadedShoe");

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: "100vh" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
        <Box
          sx={{
            backgroundColor: "#0B3D2E",
            width: "100%",
            height: "733px",
            opacity: "0.9",
            position: "absolute",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            backgroundImage: `url(${learnbg})`,
            width: "100%",
            height: "733px",
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
                onClick={() => navigate("/findshoe")}
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
                marginLeft:{lg: i18n.language === "ur" ? "24.1%" :"26%",sm: i18n.language === "ur" ? "17%" :"18%"},
                width:{lg:"15%",sm:"30%"},
                fontFamily:
                  i18n.language === "ur"
                    ? "JameelNooriNastaleeq"
                    : "Chewy",
                color: "rgb(15,21,27,0.8)",
              }}
            >
              {t("your")}
            </Typography>

            <Box component="img" src={newgif} sx={{ width:{lg:"500px",sm:"56%"}, ml: {lg:"150px",sm:"-10%"} }} />
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
        <Box component='img' sx={{ width: {lg:"50px",sm:"27px"}, height: {lg:"50px",sm:"27px"}, marginLeft: {lg: i18n.language === "ur" ? "62.5%" :"940px",sm:"64%"}, marginTop: {lg: i18n.language === "ur" ? "-6%" :"-5.5%",sm:"-11%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={stop} />
        <Box component='img' sx={{ width: {lg: i18n.language === "ur" ? "60px" :"65px",sm:"35px"}, height: {lg: i18n.language === "ur" ? "60px" :"65px",sm:"35px"}, marginLeft: {lg: i18n.language === "ur" ? "67%" :"1000px",sm:"69%"}, marginTop: {lg: i18n.language === "ur" ? "-9%" :"-8.5%",sm:"-17.5%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={pause} />
        <Box component='img' sx={{ width: {lg:"50px",sm:"27px"}, height: {lg:"50px",sm:"27px"}, marginLeft: {lg: i18n.language === "ur" ? "72%" :"1075px",sm:"74.5%"}, marginTop: {lg: i18n.language === "ur" ? "-12.3%" :"-11.5%",sm:"-23.5%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={retry} />
<audio
  ref={audioRef}
  src={i18n.language === "ur" ? yoururdu : yourshoe}
  preload="auto"
/>        </Box>
      </Box>
    </motion.div>
  );
}