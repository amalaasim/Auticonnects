import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import bg from '../assests/english_bg.png';
import reportNew from '../assests/report-new.png';
import signoutNew from '../assests/signout-new.png';
import settings from '../assests/settings.png';
import game from '../assests/wonderworld_game.png';
import storyland from '../assests/storyland.png';
import back from '../assests/chat_bg.png';
import click from '../assests/click.png';
import { useNavigate } from "react-router-dom";
import cartoon from '../assests/standinglion-loop.gif';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import TopBarLogoutIcon from "../components/TopBarLogoutIcon";
import TopBarVolumeIcon from "../components/TopBarVolumeIcon";
import AppGreetingHeader from "../components/AppGreetingHeader";
import { preloadImageAsset } from "@/lib/preloadImageAsset";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ✅ Import Framer Motion
import { motion } from "framer-motion";

export default function English() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const bubblesEnglishBg = "/assets/Bubbles/Bubbles_bg_english.png";
  const mimmiUnifiedBg = "/assets/Mimmi/mimmi_bg_unified_extended.png";
  const bubblesStandingGif = "/assets/Bubbles/standing-loop.gif";
  const mimmiHiGif = "/assets/Mimmi/hi_mimmi.gif";
  const bubblesBotBg = "/assets/Bubbles/bubbles_bot_bg.png";
  const mimmiBotBg = "/assets/Mimmi/mimmi_bot_bg.png";
  const [favoriteCharacter, setFavoriteCharacter] = React.useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem("favoriteCharacter") || "";
  });
  const isUrdu = i18n.language === "ur";
  const stackedLayout = "@media (max-aspect-ratio: 4/3)";
  const tabletLandscapeLayout = "@media (min-aspect-ratio: 4/3) and (max-aspect-ratio: 3/2)";
  const laptopWideLayout = "@media (min-width: 1200px) and (min-aspect-ratio: 3/2)";
  const contentCardWidth = "45cqw";
  const contentCardHeight = "45cqh";
  const contentCardRadius = "2.07cqh";
  const contentCardOverlayHeight = "14.8cqh";
  const isBubbles = favoriteCharacter === "bubbles";
  const isMimmi = favoriteCharacter === "mimmi" || favoriteCharacter === "mimi";

  React.useEffect(() => {
    const nextAssets = [
      bg,
      bubblesEnglishBg,
      bubblesStandingGif,
      bubblesBotBg,
      game,
      storyland,
      back,
      cartoon,
      "/backgrounds/garden.png",
      "/characters/green-try.gif",
      "/characters/talking.gif",
      "/sheru-bot/images/background.png",
      "/sheru-bot/images/standinglion-loop.gif",
      "/sheru-bot/images/talking.gif",
    ];

    const preload = () => {
      nextAssets.forEach((asset) => {
        void preloadImageAsset(asset);
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preload, 250);
    return () => window.clearTimeout(timeoutId);
  }, []);

  React.useEffect(() => {
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

  const topBarIcons = [
    { volumeToggle: true, alt: "Volume" },
    { src: reportNew, alt: "Reports", onClick: () => navigate("/reports") },
    { src: settings, alt: "Settings", onClick: () => navigate("/settings") },
    { src: signoutNew, alt: "Account", logoutMenu: true },
  ];

  const openSheruBot = () => {
    window.location.href = "/sheru-bot/";
  };

  return (
 <motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -60 }}
  transition={{ duration: 0.3 }}
  style={{
    height: "100vh",
    minHeight: "100vh",
    backgroundColor: "transparent",
  }}
>

      <Box dir={isUrdu ? 'rtl' : 'ltr'} sx={{ cursor: `url(${click}) 32 32, auto` }}>
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
            backgroundPosition: isBubbles
              ? "center calc(100% + 4cqh)"
              : isMimmi
                ? "center calc(100% + 15cqh)"
                : "bottom center",
            overflow: "hidden",
            containerType: "size",
            [laptopWideLayout]: {
              backgroundPosition: isBubbles
                ? "center calc(100% + 7cqh)"
                : isMimmi
                  ? "center calc(100% + 20cqh)"
                  : "bottom center",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "14.7cqh",
              zIndex: 1,
              pointerEvents: "none",
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.656) 6.88%, rgba(0, 0, 0, 0) 94.56%)",
            }}
          />
          <Paper
            dir="ltr"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "3.5cqh",
              paddingRight: "3.5cqh",
              height: "10cqh",
              border: "none",
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.656) 6.88%, rgba(0, 0, 0, 0) 94.56%)",
              boxShadow: "none",
            }}
          >
            <Box
              component={AppGreetingHeader}
              sx={{
                position: "relative",
                zIndex: 1,
                width: "18cqw",
                marginTop: "1.1cqh",
                textAlign: "left",
                [stackedLayout]: {
                  width: "28cqw",
                },
                [tabletLandscapeLayout]: {
                  width: "22cqw",
                },
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "row", gap: "1cqh", direction: "ltr" }}>
              {topBarIcons.map((item, i) => (
                item.volumeToggle ? (
                  <TopBarVolumeIcon
                    key={i}
                    alt={item.alt}
                    sx={{
                      width: "4.6cqh",
                      height: "4.6cqh",
                      objectFit: "contain",
                      paddingBottom: 0,
                      marginTop: 0,
                      opacity: 1,
                      filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                      [stackedLayout]: {
                        width: "4.2cqh",
                        height: "4.2cqh",
                      },
                    }}
                  />
                ) : item.logoutMenu ? (
                  <TopBarLogoutIcon
                    key={i}
                    src={item.src}
                    alt={item.alt}
                    sx={{
                      width: "4.6cqh",
                      height: "4.6cqh",
                      objectFit: "contain",
                      paddingBottom: 0,
                      marginTop: 0,
                      opacity: 1,
                      filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                      [stackedLayout]: {
                        width: "4.2cqh",
                        height: "4.2cqh",
                      },
                    }}
                  />
                ) : (
                  <Box
                    key={i}
                    component="img"
                    onClick={item.onClick}
                    sx={{
                      width: "4.6cqh",
                      height: "4.6cqh",
                      objectFit: "contain",
                      paddingBottom: 0,
                      marginTop: 0,
                      opacity: 1,
                      filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                      cursor: item.onClick ? "pointer" : "default",
                      [stackedLayout]: {
                        width: "4.2cqh",
                        height: "4.2cqh",
                      },
                    }}
                    src={item.src}
                  />
                )
              ))}
            </Box>
          </Paper>

          {/* Cards */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingLeft: "4cqw",
              paddingRight: "4cqw",
              paddingTop: "14cqh",
              gap: "3cqh",
              [stackedLayout]: {
                flexDirection: "column",
                paddingLeft: "5cqw",
                paddingRight: "5cqw",
                paddingTop: "11cqh",
                gap: "3cqh",
              },
              [tabletLandscapeLayout]: {
                paddingTop: "13cqh",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "flex-start",
                width: "100%",
                gap: "2.5cqw",
                [stackedLayout]: {
                  flexDirection: "column",
                  gap: "1.6cqh",
                },
              }}
            >

            {/* WonderWorld */}
            <Box
              onClick={() => navigate("/wonderworld")}
              sx={{ display: "flex", flexDirection: "column", width: contentCardWidth, opacity: "0.9", cursor: "pointer", overflow: "hidden", position: "relative","&:hover": {
                  transform: "scale(1.08)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0)",
                },
                [stackedLayout]: {
                  width: "100%",
                  boxSizing: "border-box",
                },
                [tabletLandscapeLayout]: {
                  width: contentCardWidth,
                },
              }}
            >
              <Box
                component="img"
                sx={{
                  borderRadius: contentCardRadius,
                  height: contentCardHeight,
                  width: "100%",
                  objectFit: "cover",
                  [stackedLayout]: {
                    height: contentCardHeight,
                  },
                  [tabletLandscapeLayout]: {
                    height: contentCardHeight,
                  },
                }}
                src={game}
              />

              <Typography sx={{background:"rgba(15, 23, 42, 0.2)",backdropFilter:"blur(1.29cqh)",fontFamily:isUrdu ? "JameelNooriNastaleeq" :  "Petrona",fontWeight:"600",color:"rgba(255, 255, 255, 1)",fontSize:isUrdu ? "3.05cqh" : "2.45cqh",lineHeight:isUrdu ? "3.9cqh":"2.8cqh",paddingRight:"2.1cqh",letterSpacing:"0.037cqh",
               position:"absolute",
               left:0,
               right:0,
               bottom:0,
               width:"100%",
               boxSizing:"border-box",
paddingTop:"1.5cqh",paddingLeft:"2.1cqh",paddingBottom:"1.5cqh",minHeight:contentCardOverlayHeight,borderRadius:`0 0 ${contentCardRadius} ${contentCardRadius}`,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                <span style={{display:"block",whiteSpace:"nowrap",marginBottom:"0.4cqh",fontFamily:isUrdu ? "JameelNooriNastaleeq" :  "Chewy",fontWeight:"400",fontStyle:"normal",fontSize:isUrdu ? "3.3cqh" : "3.3cqh",lineHeight:"4.1cqh",letterSpacing:"0.1cqh"}}>
                  {t("wonderWorldTitle")}
                </span>
                {t("wonderWorldDesc.line1")}<br/>
                {t("wonderWorldDesc.line2")}
              </Typography>
            </Box>

            {/* Social Storyland */}
            <Box onClick={() => navigate("/garden")} sx={{ display: "flex", flexDirection: "column", width: contentCardWidth, opacity: "0.9", cursor: "pointer", overflow: "hidden", position: "relative","&:hover": {
                  transform: "scale(1.08)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0)",
                },
                [stackedLayout]: {
                  width: "100%",
                  boxSizing: "border-box",
                },
                [tabletLandscapeLayout]: {
                  width: contentCardWidth,
                },
              }}>
              <Box 
                component="img"
                sx={{
                  borderRadius: contentCardRadius,
                  height: contentCardHeight,
                  width: "100%",
                  objectFit: "cover",
                  [stackedLayout]: {
                    height: contentCardHeight,
                  },
                  [tabletLandscapeLayout]: {
                    height: contentCardHeight,
                  },
                }}
                src={storyland}
              />

              <Typography sx={{background:"rgba(15, 23, 42, 0.2)",backdropFilter:"blur(1.29cqh)",
    width:"100%",
    boxSizing:"border-box",
paddingRight:"2.1cqh",paddingBottom:"1.5cqh",fontFamily:isUrdu ? "JameelNooriNastaleeq" : "Petrona",fontWeight:"600",color:"rgba(255, 255, 255, 1)",fontSize:isUrdu ? "3.05cqh" : "2.45cqh",lineHeight:isUrdu ? "3.9cqh" : "2.8cqh",letterSpacing:"0.037cqh",
position:"absolute",
left:0,
right:0,
bottom:0,
paddingTop:"1.5cqh",paddingLeft:"2.1cqh",minHeight:contentCardOverlayHeight,borderRadius:`0 0 ${contentCardRadius} ${contentCardRadius}`,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <span style={{display:"block",whiteSpace:"nowrap",marginBottom:"0.4cqh",fontFamily: isUrdu ? "JameelNooriNastaleeq" : "Chewy",fontWeight:"400",fontStyle:"normal",fontSize:isUrdu ? "3.3cqh" : "3.3cqh",lineHeight:"4.1cqh",letterSpacing:"0.1cqh"}}>
                  {t("socialStoryTitle")}
                </span>
                {t("socialStoryDesc.line1")}<br/>
                {t("socialStoryDesc.line2")}
              </Typography>
            </Box>
            </Box>
            {/* Rocco */}
            <Box
              onClick={openSheruBot}
              sx={{position: "relative", width: "92cqw", mx:"auto", mt: "3cqh", borderRadius: contentCardRadius, cursor: "pointer", zIndex: 2, "& > *": { position: "relative", zIndex: 1 }, "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0)",
                },
                [stackedLayout]: {
                  width: "92cqw",
                },
                [tabletLandscapeLayout]: {
                  width: "92cqw",
                },
              }}
            >
          <Box sx={{ display: "flex", flexDirection: "column", borderRadius: contentCardRadius, position: "relative", top: 0 }}>
            <Box
              sx={{
                width: "100%",
                height: "18cqh",
                borderRadius: contentCardRadius,
                backgroundImage: `url(${isBubbles ? bubblesBotBg : isMimmi ? mimmiBotBg : back})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: isBubbles || isMimmi ? "cover" : "100% 100%",
                backgroundPosition: isMimmi ? "center 95%" : "bottom center",
                [stackedLayout]: {
                  height: "15cqh",
                },
                [tabletLandscapeLayout]: {
                  height: "16cqh",
                },
              }}
            />

            <Typography  sx={{paddingBottom:"1.5cqh",
            fontFamily:isUrdu ? "JameelNooriNastaleeq" : "Petrona",
              fontWeight:"500",
              color:"rgba(255, 255, 255, 1)",
              fontSize:isUrdu ? "3.05cqh" : "2.45cqh",
              lineHeight:isUrdu ? "3.9cqh" : "2.8cqh",
              letterSpacing:"0.037cqh",
              position:"relative",
              top:"auto",
              transform:"none",
              left:"auto",
              zIndex:2,
                px: "2.1cqh",
              marginTop:"-14.2cqh",
              width:"100%",paddingTop:"1.5cqh",paddingLeft: isUrdu ? "0" : "3.2cqh",paddingRight: isUrdu ? "2.1cqh" : "0",height:"auto",borderRadius: contentCardRadius,
              [stackedLayout]: {
                px: "2.1cqh",
                paddingTop: "1.5cqh",
                width: "72cqw",
                marginTop: "-7.2cqh",
                fontSize: isUrdu ? "3.05cqh" : "2.45cqh",
              },
              [tabletLandscapeLayout]: {
                position: "absolute",
                top: "9.4cqh",
                transform: "translateY(-50%)",
                left: 0,
                px: "2.1cqh",
                marginTop: 0,
                width: "70cqw",
                paddingTop: 0,
                fontSize: isUrdu ? "3.05cqh" : "2.45cqh",
              }}}>
                      <span style={{display:"block",marginBottom:"0.4cqh",fontFamily: isUrdu ? "JameelNooriNastaleeq" : "Chewy",fontWeight:"400",fontStyle:"normal",fontSize:"3.3cqh",lineHeight:"4.1cqh",letterSpacing:"0.1cqh"}}>              
                        {isBubbles
                          ? t("roccoTitle").replace("Sheru", "Bubbles").replace("شیرو", "ببلز")
                          : isMimmi
                            ? "Say hi to your friend Mimmi"
                            : t("roccoTitle")}
                    </span>
            {t("roccoDesc.line1")}
            {t("roccoDesc.line2")}
          </Typography>
        </Box>

       <Box component="img" src={isBubbles ? bubblesStandingGif : isMimmi ? mimmiHiGif : cartoon} sx={{width:"31cqw",height:"46cqh", position: "absolute", right: isUrdu ? "auto" : "-0.2cqw", left: isUrdu ? "-0.2cqw" : "auto", bottom: "-18cqh", zIndex: 1, pointerEvents: "none", transformOrigin:"center bottom",
        [laptopWideLayout]: {
          width: "31cqw",
          height: "46cqh",
          bottom: "-18cqh",
        },
        [stackedLayout]: {
          width: "39cqw",
          height: "46cqh",
          right: isUrdu ? "auto" : "0cqw",
          left: isUrdu ? "0cqw" : "auto",
          bottom: "-16cqh",
        },
        [tabletLandscapeLayout]: {
          width: "39cqw",
          height: "47cqh",
          right: isUrdu ? "auto" : "0cqw",
          left: isUrdu ? "0cqw" : "auto",
          bottom: "-17cqh",
        },
       }}/>
       </Box>
       </Box>
      </Box>
    </Box>
    </motion.div>
  );
}
