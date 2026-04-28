import * as React from 'react';
import i18n from "i18next";
import { Box, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";

import bg from '../assests/language_bg.png';
import reportNew from '../assests/report-new.png';
import signoutNew from '../assests/signout-new.png';
import settings from '../assests/settings.png';
import languageBanner from '../assests/language-banner.svg';
import click from '../assests/click.png';
import English from '../assests/English.png';
import Urdu from '../assests/urdu.png';
import TopBarLogoutIcon from "../components/TopBarLogoutIcon";
import TopBarVolumeIcon from "../components/TopBarVolumeIcon";
import AppGreetingHeader from "../components/AppGreetingHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Language() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const bubblesEnglishBg = "/assets/Bubbles/bubbles_bg_unified.png";
  const mimmiUnifiedBg = "/assets/Mimmi/mimmi_bg_unified_extended.png";
  const defaultLanguageBoard = "/assets/language-board.png";
  const bubblesLanguageBoard = "/assets/language-board-bubbles.png";
  const mimmiLanguageBoard = "/assets/Mimmi/language-board-mimmi.png";
  const laptopWideLayout = "@media (min-aspect-ratio: 1.5)";
  const [favoriteCharacter, setFavoriteCharacter] = React.useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem("favoriteCharacter") || "";
  });
  const topBarIcons = [
    { volumeToggle: true, alt: "Volume" },
    { src: reportNew, onClick: () => navigate("/reports") },
    { src: settings, onClick: () => navigate("/settings") },
    { src: signoutNew, logoutMenu: true },
  ];

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

  const selectEnglish = () => {
    i18n.changeLanguage("en");
    navigate("/english");
  };

  const selectUrdu = () => {
    i18n.changeLanguage("ur");
    navigate("/english");
  };

  const isBubbles = favoriteCharacter === "bubbles";
  const isMimmi = favoriteCharacter === "mimmi" || favoriteCharacter === "mimi";
  const languageBackground = isBubbles
    ? bubblesEnglishBg
    : isMimmi
      ? mimmiUnifiedBg
      : bg;
  const languageBoard = isBubbles
    ? bubblesLanguageBoard
    : isMimmi
      ? mimmiLanguageBoard
      : defaultLanguageBoard;
  const languageBackgroundPosition = isBubbles ? "center calc(100% + 4cqh)" : "bottom center";
  const languageBackgroundPositionLaptop = isBubbles ? "center calc(100% + 7cqh)" : "bottom center";

  return (
    <Box sx={{ cursor: `url(${click}) 32 32, auto` }}>
      <Box
        sx={{
          backgroundImage: `url(${languageBackground})`,
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: languageBackgroundPosition,
          position: "relative",
          overflow: "hidden",
          containerType: "size",
          [laptopWideLayout]: {
            backgroundPosition: languageBackgroundPositionLaptop,
          },
        }}
      >
        {/* Gradient background behind SVG banner and top bar */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "45%",
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
        {/* SVG banner above gradient */}
        <Box
          sx={{
            position: "absolute",
            left: "-6%",
            right: "-3%",
            top: "70%",
            width: "auto",
            height: "23%",
            zIndex: 1,
            pointerEvents: "none",
            overflow: "hidden",
            containerType: "size",
          }}
        >
        </Box>
        {/* TOP BAR */}
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { lg: "5%", md: "5%", sm: "4%", xs: "3%" },
            pt: { lg: "28px", md: "28px", sm: "32px", xs: "40px" },
            pb: { lg: "8px", md: "8px", sm: "8px", xs: "8px" },
            borderRadius: 0,
            background: "transparent",
            boxShadow: "none",
            zIndex: 2,
            position: "relative",
          }}
        >
          <Box
            component={AppGreetingHeader}
            sx={{
              width: { lg: "17%", md: "22%", sm: "30%", xs: "38%" },
              mt: 0,
            }}
          />

          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            {topBarIcons.map((item, i) => (
              item.volumeToggle ? (
                <TopBarVolumeIcon
                  key={i}
                  alt={item.alt}
                  sx={{
                    width: { lg: "45px", md: "40px", sm: "35px", xs: "30px" },
                    height: { lg: "45px", md: "40px", sm: "35px", xs: "30px" },
                    objectFit: "contain",
                    mt: 0,
                    opacity: 1,
                    filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                  }}
                />
              ) : item.logoutMenu ? (
                <TopBarLogoutIcon
                  key={i}
                  src={item.src}
                  sx={{
                    width: { lg: "45px", md: "40px", sm: "35px", xs: "30px" },
                    height: { lg: "45px", md: "40px", sm: "35px", xs: "30px" },
                    objectFit: "contain",
                    mt: 0,
                    opacity: 1,
                    filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                  }}
                />
              ) : (
                <Box
                  key={i}
                  component="img"
                  src={item.src}
                  onClick={item.onClick}
                  sx={{
                    width: { lg: "45px", md: "40px", sm: "35px", xs: "30px" },
                    height: { lg: "45px", md: "40px", sm: "35px", xs: "30px" },
                    objectFit: "contain",
                    mt: 0,
                    opacity: 1,
                    filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                    cursor: item.onClick ? "pointer" : "default",
                  }}
                />
              )
            ))}
          </Box>
        </Paper>

        {/* Gradient background behind SVG banner */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "45%",
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.656) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
        {/* SVG banner */}
        <Box
          sx={{
            position: "absolute",
            left: "-6%",
            right: "-3%",
            top: "15%",
            width: "auto",
            height: "23%",
            zIndex: 1,
            pointerEvents: "none",
            overflow: "hidden",
            containerType: "size",
          }}
        >
          <Box
            component="img"
            src={languageBanner}
            alt=""
            aria-hidden="true"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: "scaleY(-1)",
            }}
          />
          <Box
            component="p"
            sx={{
              position: "absolute",
              left: "51%",
              top: "49cqh",
              width: "80cqw",
              m: 0,
              zIndex: 2,
              transform: "translate(-50%, -50%) rotate(-2.2deg)",
              color: "#FFFFFF",
              fontFamily: '"Chewy", cursive',
              fontStyle: "normal",
              fontSize: "3.55cqw",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "0.05em",
              textAlign: "center",
              textShadow: "0 0.243cqw 0.243cqw rgba(0, 0, 0, 0.25)",
              whiteSpace: "nowrap",
            }}
          >
            Pick the language that works best for your child
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "0",
            width: "clamp(360px, 67vmin, 920px)",
            transform: "translateX(-50%)",
            aspectRatio: "1721 / 1454",
            containerType: "size",
            zIndex: 2,
          }}
        >
          <Box
            component="img"
            src={languageBoard}
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

          <Box
            onClick={selectEnglish}
            component="img"
            src={English}
            sx={{
              position: "absolute",
              left: "50%",
              top: "20%",
              width: "42%",
              transform: "translateX(-50%)",
              transition: "transform 180ms ease",
              "&:hover": { transform: "translateX(-50%) scale(1.08)" },
              opacity: 0.9,
              cursor: "pointer",
            }}
          />

          <Box
            onClick={selectUrdu}
            component="img"
            src={Urdu}
            sx={{
              position: "absolute",
              left: "50%",
              top: "55%",
              width: "28%",
              transform: "translateX(-50%)",
              transition: "transform 180ms ease",
              "&:hover": { transform: "translateX(-50%) scale(1.08)" },
              opacity: 0.9,
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
