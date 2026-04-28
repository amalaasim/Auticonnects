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
import backNew from '../assests/backnew.png';
import star from '../assests/1star.png';
import star2 from '../assests/2star.png';
import star3 from '../assests/3star.png';
import click from '../assests/click.png';
import end from '../assests/endtatoo.png';
import backbg from '../assests/backbg.png';
import objlearn from '../assests/objlearn.mpeg';
import objecturdu from '../assests/objecturdu.mp4';
import TopBarLogoutIcon from "../components/TopBarLogoutIcon";
import TopBarVolumeIcon from "../components/TopBarVolumeIcon";
import AppGreetingHeader from "../components/AppGreetingHeader";
import learnBg from '../assests/learn_bg.png';
import boardImage from '../assests/board.png';
import brownBoardImage from '../assests/brown_board.png';
import greenBgImage from '../assests/greenbg.png';
import talkingLion from '../assests/talking.gif';
import standingLionLoop from '../assests/standinglion-loop.gif';
import { preloadImageAsset } from "@/lib/preloadImageAsset";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

function Wonderworld() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const introAudioRef = React.useRef(null);
  const bubblesEnglishBg = "/assets/Bubbles/Bubbles_bg_english.png";
  const bubblesStandingGif = "/assets/Bubbles/standing-loop.gif";
  const mimmiUnifiedBg = "/assets/Mimmi/mimmi_bg_unified_extended.png";
  const mimmiHiGif = "/assets/Mimmi/hi_mimmi.gif";
  const [favoriteCharacter, setFavoriteCharacter] = React.useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem("favoriteCharacter") || "";
  });
  const [viewportAspectRatio, setViewportAspectRatio] = React.useState(() => {
    if (typeof window === "undefined") return 16 / 10;
    return window.innerWidth / window.innerHeight;
  });
  const wideLaptopLayout = "@media (min-aspect-ratio: 3/2)";
  const isBubbles = favoriteCharacter === "bubbles";
  const isMimmi = favoriteCharacter === "mimmi" || favoriteCharacter === "mimi";
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
  const starOffsetY = (count) => (count === 3 ? "4.1cqh" : "0cqh");

  React.useEffect(() => {
    const updateAspectRatio = () => {
      setViewportAspectRatio(window.innerWidth / window.innerHeight);
    };

    updateAspectRatio();
    window.addEventListener("resize", updateAspectRatio);
    window.addEventListener("orientationchange", updateAspectRatio);

    return () => {
      window.removeEventListener("resize", updateAspectRatio);
      window.removeEventListener("orientationchange", updateAspectRatio);
    };
  }, []);

  const isMobileOrTablet = typeof window !== "undefined" && window.innerWidth <= 1100;

  const objectClusterBottom =
    viewportAspectRatio <= 4 / 3
      ? (isMobileOrTablet ? "33cqh" : "28cqh")
      : viewportAspectRatio <= 1.45
        ? "32cqh"
        : "28cqh";
  const starClusterTop = viewportAspectRatio > 1.45 ? "13.6cqh" : "11.8cqh";

useEffect(() => {
  if (!user?.id) return;

  let ignore = false;

  const loadFavoriteCharacter = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("favorite_character")
      .eq("user_id", user.id)
      .maybeSingle();

    if (ignore || !data?.favorite_character) return;

    setFavoriteCharacter(data.favorite_character);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("favoriteCharacter", data.favorite_character);
    }
  };

  loadFavoriteCharacter();

  return () => {
    ignore = true;
  };
}, [user?.id]);

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

useEffect(() => {
  const audioSrc = i18n.language === "ur" ? objecturdu : objlearn;
  const audio = new Audio(audioSrc);
  introAudioRef.current = audio;
  audio.volume = 1;

  audio.play().catch(() => {
    const retryId = window.setTimeout(() => {
      if (introAudioRef.current !== audio) return;
      audio.play().catch(() => {});
    }, 800);

    audio.addEventListener(
      "ended",
      () => {
        window.clearTimeout(retryId);
      },
      { once: true }
    );
  });

  return () => {
    if (introAudioRef.current === audio) {
      introAudioRef.current = null;
    }
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (_) {}
  };
}, [i18n.language]);

useEffect(() => {
  const nextAssets = [
    learnBg,
    boardImage,
    brownBoardImage,
    greenBgImage,
    bubblesEnglishBg,
    bubblesStandingGif,
    mimmiUnifiedBg,
    mimmiHiGif,
    talkingLion,
    standingLionLoop,
    cookie,
    car,
    shoe,
    ball,
    backbg,
    star,
    star2,
    star3,
  ];

  const preload = () => {
    nextAssets.forEach((asset) => {
      void preloadImageAsset(asset);
    });
  };

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(preload, { timeout: 1000 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(preload, 200);
  return () => window.clearTimeout(timeoutId);
}, []);


  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100vh", minHeight: "100vh", backgroundColor: "transparent" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
        <Box
          sx={{
            backgroundImage: `url(${isBubbles ? bubblesEnglishBg : isMimmi ? mimmiUnifiedBg : bg})`,
            width: "100vw",
            height: "100vh",
            minHeight: "100vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            position: "relative",
            backgroundPosition: isBubbles || isMimmi ? "center calc(100% + 4cqh)" : "bottom center",
            containerType: "size",
          }}
        >
          {/* Top bar */}
          <Paper
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "5%",
              paddingRight: "5%",
              paddingTop: { lg: "28px", md: "28px", sm: "32px", xs: "40px" },
              paddingBottom: "8px",
              height: "10vh",
              border: "none",
              background: "linear-gradient(180deg, rgba(0, 0, 0, 0.656) 26.91%, rgba(0, 0, 0, 0) 100%)",
              boxShadow: "none",
            }}
          >
            <Box component={AppGreetingHeader} sx={{ width: { lg: "17%", md: "25%", sm: "29%", xs: "27%" }, marginTop: 0 }} />
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
                      marginTop: 0,
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
                      marginTop: 0,
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
                      marginTop: 0,
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

          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "19cqh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative", width: "27cqw", height: "7cqh", [wideLaptopLayout]: { width: "24cqw" } }}>
              <Box component='img' sx={{ width: "27cqw", height: "7cqh", [wideLaptopLayout]: { width: "24cqw" } }} src={backbg} />
              <Typography sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: i18n.language === "ur" ? "3.8cqh" : "3.3cqh",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "147%",
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'chewy',
                letterSpacing: "0.01em",
                color: "#48270C",
                textAlign: "center",
                mixBlendMode: "multiply",
                textShadow: "0px -2.0958px 8.38321px #FFCB8F",
              }}>
                {t("selectObjectTitle")}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: objectClusterBottom,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >

            {/* Object selection */}
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "85cqw", transform: "translateY(-10cqh)" }}>
            <Box sx={{ position: "relative", width: "18cqw", height: "18cqw", overflow: "visible", "&:hover": { transform: "scale(1.08)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }}>
              <Box component='img' onClick={() => navigate("/learnobject")} sx={{ width: "18cqw", height: "18cqw", borderRadius: "20%" }} src={cookie} />
              {starFor(recentStars.cookie) && (
                <Box
                  component='img'
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: starClusterTop,
                    width: "18cqw",
                    height: "18cqw",
                    borderRadius: "20%",
                    objectFit: "contain",
                    transform: `translateY(${starOffsetY(recentStars.cookie)})`,
                  }}
                  src={starFor(recentStars.cookie)}
                />
              )}
            </Box>

            <Box sx={{ position: "relative", width: "18cqw", height: "18cqw", overflow: "visible" }}>
              <Box component='img' onClick={() => navigate("/learnobjectcar")} sx={{ width: "18cqw", height:"18cqw", borderRadius: "20%", "&:hover": { transform: "scale(1.12)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={car} />
              {starFor(recentStars.car) && (
                <Box
                  component='img'
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: starClusterTop,
                    width: "18cqw",
                    height: "18cqw",
                    borderRadius: "20%",
                    objectFit: "contain",
                    transform: `translateY(${starOffsetY(recentStars.car)})`,
                  }}
                  src={starFor(recentStars.car)}
                />
              )}
            </Box>

            <Box sx={{ position: "relative", width: "18cqw", height: "18cqw", overflow: "visible" }}>
              <Box component='img' onClick={() => navigate("/learnobjshoe")} sx={{ width: "18cqw", height: "18cqw", borderRadius: "20%", transition: "transform 0.3s ease, box-shadow 0.3s ease", "&:hover": { transform: "scale(1.12)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={shoe} />
              {starFor(recentStars.shoe) && (
                <Box
                  component='img'
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: starClusterTop,
                    width: "18cqw",
                    height: "18cqw",
                    borderRadius: "20%",
                    objectFit: "contain",
                    transform: `translateY(${starOffsetY(recentStars.shoe)})`,
                  }}
                  src={starFor(recentStars.shoe)}
                />
              )}
            </Box>

            <Box sx={{ position: "relative", width: "18cqw", height: "18cqw", overflow: "visible" }}>
              <Box component='img' onClick={() => navigate("/learnobjball")} sx={{ width: "18cqw", height: "18cqw", "&:hover": { transform: "scale(1.12)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={ball} />
              {starFor(recentStars.ball) && (
                <Box
                  component='img'
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: starClusterTop,
                    width: "18cqw",
                    height: "18cqw",
                    borderRadius: "20%",
                    objectFit: "contain",
                    transform: `translateY(${starOffsetY(recentStars.ball)})`,
                  }}
                  src={starFor(recentStars.ball)}
                />
              )}
            </Box>
          </Box>
          </Box>

          {/* Bottom section */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: { lg: "-8px", sm: "-4px" },
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingLeft: "1%",
              paddingRight: "5%",
            }}
          >
            <Box
              component="img"
              onClick={() => navigate("/English")}
              sx={{
                position: "absolute",
                left: "-3%",
                bottom: "0",
                width: "30cqw",
                height: "30cqh",
                objectFit: "contain",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": { transform: "scale(1.08)", boxShadow: "0 10px 25px rgba(0,0,0,0)" },
              }}
              src={backNew}
            />
            <Box
              component="img"
              sx={{
                position: "absolute",
                right: isBubbles || isMimmi ? "-1%" : "-3%",
                bottom: isBubbles || isMimmi ? "-20cqh" : "0",
                width: "30cqw",
                height: isBubbles || isMimmi ? "56cqh" : "30cqh",
                objectFit: "contain",
              }}
              src={isBubbles ? bubblesStandingGif : isMimmi ? mimmiHiGif : end}
            />
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default Wonderworld;
