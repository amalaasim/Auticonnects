import * as React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { motion } from "framer-motion";

import bg from '../assests/background.png';
import reportNew from '../assests/report-new.png';
import signoutNew from '../assests/signout-new.png';
import settings from '../assests/settings.png';
import cookie from '../assests/cookies.png';
import car from '../assests/car.png';
import shoe from '../assests/shoe.png';
import ball from '../assests/balls.png';
import back from '../assests/back.png';
import star from '../assests/1star.png';
import star2 from '../assests/2star.png';
import star3 from '../assests/3star.png';
import click from '../assests/click.png';
import end from '../assests/endtatoo.png';
import backbg from '../assests/backbg.png';
import TopBarLogoutIcon from "../components/TopBarLogoutIcon";
import TopBarVolumeIcon from "../components/TopBarVolumeIcon";
import AppGreetingHeader from "../components/AppGreetingHeader";

function Wonderworld() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const topBarIcons = [
    { volumeToggle: true, alt: "Volume" },
    { src: reportNew, onClick: () => navigate("/reports") },
    { src: settings, onClick: () => navigate("/settings") },
    { src: signoutNew, logoutMenu: true },
  ];

  // TODO: Replace with DB-backed "most recent stars" once the API is attached.
  const getRecentStars = React.useCallback(() => {
    const fallback = { cookie: 2, car: 3, shoe: 1, ball: 2 };
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem("ww_recent_stars");
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return { ...fallback, ...parsed };
    } catch {
      return fallback;
    }
  }, []);
  const [recentStars, setRecentStars] = React.useState(() => getRecentStars());
  const starFor = (count) => {
    if (count === 1) return star;
    if (count === 2) return star2;
    if (count === 3) return star3;
    return null;
  };
  const starOffsetY = (count) => (count === 3 ? "38px" : "0px");

useEffect(() => {
  const refreshStars = () => {
    setRecentStars(getRecentStars());
  };

  refreshStars();
  window.addEventListener("focus", refreshStars);
  document.addEventListener("visibilitychange", refreshStars);

  return () => {
    window.removeEventListener("focus", refreshStars);
    document.removeEventListener("visibilitychange", refreshStars);
  };
}, [getRecentStars]);


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
            backgroundImage: `url(${bg})`,
            width: "100vw",
            minHeight: "100vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            position: "relative",
            backgroundPosition: "center",
          }}
        >
          {/* Top bar */}
          <Paper
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: "5%",
              paddingRight: "5%",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(10deg, rgba(5, 8, 7, 0.6) 0%, rgba(11,61,46,0.4) 100%)",
            }}
          >
            <Box component={AppGreetingHeader} sx={{ width: { lg: "17%", md: "25%", sm: "29%", xs: "27%" }, marginTop: { lg: "1.5%", md: "2%", sm: "3%", xs: "43%" } }} />
            <Box sx={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
              {topBarIcons.map((item, i) => (
                item.volumeToggle ? (
                  <TopBarVolumeIcon
                    key={i}
                    alt={item.alt}
                    sx={{
                      width: { lg: "45.23px", md: "25%", sm: "29%", xs: "40px" },
                      height: "45.23px",
                      objectFit: "contain",
                      marginTop: { lg: "16px", md: "19px", sm: "3%", xs: "194px" },
                      opacity: 1,
                      filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                    }}
                  />
                ) : item.logoutMenu ? (
                  <TopBarLogoutIcon
                    key={i}
                    src={item.src}
                    sx={{
                      width: { lg: "45.23px", md: "25%", sm: "29%", xs: "40px" },
                      height: "45.23px",
                      objectFit: "contain",
                      marginTop: { lg: "16px", md: "19px", sm: "3%", xs: "194px" },
                      opacity: 1,
                      filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                    }}
                  />
                ) : (
                  <Box
                    key={i}
                    component="img"
                    onClick={item.onClick}
                    sx={{
                      width: { lg: "45.23px", md: "25%", sm: "29%", xs: "40px" },
                      height: "45.23px",
                      objectFit: "contain",
                      marginTop: { lg: "16px", md: "19px", sm: "3%", xs: "194px" },
                      opacity: 1,
                      filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                      cursor: item.onClick ? "pointer" : "default",
                    }}
                    src={item.src}
                  />
                )
              ))}
            </Box>
          </Paper>

          {/* Select object title */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box component='img' sx={{ marginLeft: {lg:"620px",sm:"32%"}, marginTop: "70px", width: "350px", height: "70px" }} src={backbg} />
            <Typography sx={{
              fontSize: i18n.language === "ur" ? "38px" : "33px",
              marginTop: {lg:i18n.language === "ur" ? "-4.4%" :"-4%",sm:i18n.language === "ur" ? "-8.3%" :"-7%"},
              paddingTop: "0.5%",
              marginLeft: {
                lg: i18n.language === "ur" ? "calc(45% - 5px)" : "45%",
                sm: i18n.language === "ur" ? "calc(39% - 5px)" : "39%",
              },
              fontStyle: "normal",
              lineHeight: "90%",
              fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'chewy',
              letterSpacing: "1px",
              color: "rgb(15, 21, 27,0.8)",
              opacity: "0.9",
            }}>
              {t("selectObjectTitle")}
            </Typography>
          </Box>

          {/* Object selection */}
          <Box sx={{ display: "flex", flexDirection: "row", marginLeft: {lg:"-13%",sm:"-20%"}, marginTop: "1%", gap: {lg:"1.58rem",sm:"0.3rem"} }}>
            <Box sx={{ display: "flex", flexDirection: "column", "&:hover": { transform: "scale(1.08)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }}>
              <Box component='img' onClick={() => navigate("/learnobject")} sx={{ width: { lg: "240.59px",sm:"190px" }, height: {lg:"240px",sm:"200px"}, marginTop: {lg:"50px",sm:"25%"}, marginLeft: {lg:"450px",sm:"150px"}, borderRadius: {lg:"200.58px",sm:"20%"} }} src={cookie} />
              {starFor(recentStars.cookie) && (
                <Box
                  component='img'
                  sx={{
                    width: { lg: "240.59px", sm: "190px" },
                    height: { lg: "240px", sm: "190px" },
                    marginTop: "-130px",
                    marginLeft: { lg: "450px", sm: "150px" },
                    borderRadius: "200.58px",
                    objectFit: "contain",
                    transform: `translateY(${starOffsetY(recentStars.cookie)})`,
                  }}
                  src={starFor(recentStars.cookie)}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box component='img' onClick={() => navigate("/learnobjectcar")} sx={{ width: { lg: "240.59px",sm:"190px" }, height:{lg:"240px",sm:"200px"}, marginTop: {lg:"50px",sm:"45%"}, borderRadius: "200.58px", "&:hover": { transform: "scale(1.12)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={car} />
              {starFor(recentStars.car) && (
                <Box
                  component='img'
                  sx={{
                    width: { lg: "240.59px", sm: "190px" },
                    height: { lg: "240px", sm: "190px" },
                    marginTop: "-130px",
                    borderRadius: "200.58px",
                    objectFit: "contain",
                    transform: `translateY(${starOffsetY(recentStars.car)})`,
                  }}
                  src={starFor(recentStars.car)}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box component='img' onClick={() => navigate("/learnobjshoe")} sx={{ width: { lg: "240.59px",sm:"190px" }, height: {lg:"240px",sm:"200px"}, marginTop: {lg:"50px",sm:"10%"}, borderRadius: "200.58px", transition: "transform 0.3s ease, box-shadow 0.3s ease", "&:hover": { transform: "scale(1.12)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={shoe} />
              {starFor(recentStars.shoe) && (
                <Box
                  component='img'
                  sx={{
                    width: { lg: "240.59px", sm: "190px" },
                    height: { lg: "240px", sm: "190px" },
                    marginTop: "-130px",
                    borderRadius: "200.58px",
                    objectFit: "contain",
                    transform: `translateY(${starOffsetY(recentStars.shoe)})`,
                  }}
                  src={starFor(recentStars.shoe)}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box component='img' onClick={() => navigate("/learnobjball")} sx={{ width: { lg: "230.59px",sm:"160px" }, height: {lg:"240px",sm:"180px"}, marginTop: {lg:"50px",sm:"11%"}, "&:hover": { transform: "scale(1.12)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={ball} />
              {starFor(recentStars.ball) && (
                <Box
                  component='img'
                  sx={{
                    width: { lg: "230.59px", sm: "160px" },
                    height: { lg: "240px", sm: "180px" },
                    marginTop: "-130px",
                    borderRadius: "200.58px",
                    objectFit: "contain",
                    transform: `translateY(${starOffsetY(recentStars.ball)})`,
                  }}
                  src={starFor(recentStars.ball)}
                />
              )}
            </Box>
          </Box>

          {/* Bottom section */}
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "1%", paddingRight: "5%" }}>
            <Box component="img" onClick={() => navigate("/English")} sx={{ width: {lg:"250px",sm:"200px"}, height:{lg:"303px",sm:"300px"}, marginLeft: {lg:"80px",sm:"20px"}, marginTop: i18n.language === "ur" ? "-4.5%" : "-4.5%", transition: "transform 0.3s ease, box-shadow 0.3s ease", "&:hover": { transform: "scale(1.08)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={back} />
            <Typography sx={{ fontSize: i18n.language === "ur" ? "60px" : "65px", marginTop: {lg:"3%",sm:"8%"}, marginLeft: {lg:"-36%",sm:i18n.language === "ur" ? "-50%":"-50%"}, fontStyle: "normal", lineHeight: "90%", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy', letterSpacing: "1px", color: "rgb(15, 21, 27,0.8)", "&:hover": { transform: "scale(1.08)", boxShadow: "0 10px 25px rgba(0,0,0,0)" }, opacity: "0.9" }}>
              {t("back")}
            </Typography>
            <Box component="img" sx={{ width: {lg:"305px",sm:"248px"}, height: "275px", marginLeft: {lg:"500px",sm:"330px"}, marginTop: {lg:"-28px",sm:"-7px"}, objectFit: "contain" }} src={end} />
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default Wonderworld;
