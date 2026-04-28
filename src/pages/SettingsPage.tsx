import { useEffect, useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import i18n from "@/i18n";
import englishBackground from "../assests/english_bg.png";
import { bubblesSettingsBg, mimmiSettingsBg } from "../assests/characterBackgrounds";
import settingsBoard from "../assests/settingsboard.png";
import reportNew from "../assests/report-new.png";
import homeButton from "../assests/homebutton.png";
import signoutNew from "../assests/signout-new.png";
import editIcon from "../assests/editicon.png";
import backNew from "../assests/backnew.png";
import TopBarLogoutIcon from "../components/TopBarLogoutIcon";
import TopBarVolumeIcon from "../components/TopBarVolumeIcon";
import AppGreetingHeader from "../components/AppGreetingHeader";

function normalizeLanguage(value: string | null | undefined) {
  if (value === "urdu") return "ur";
  if (value === "english") return "en";
  return value || "en";
}

const characterOptions = [
  { name: "Bubbles", value: "bubbles", color: "#B78FD7" },
  { name: "Sheru", value: "rocco", color: "#F2A156" },
  { name: "Mimmi", value: "mimi", color: "#80E2F4" },
] as const;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, childName: profileChildName, refreshProfile } = useAuth();
  const storedLanguage = normalizeLanguage(
    typeof window !== "undefined"
      ? window.localStorage.getItem("app_language") || "en"
      : "en"
  );

  const [childName, setChildName] = useState(
    typeof window !== "undefined" ? window.sessionStorage.getItem("childName") || profileChildName || "Abdullah" : "Abdullah"
  );
  const [childAge, setChildAge] = useState(
    typeof window !== "undefined" ? window.sessionStorage.getItem("childAge") || "7" : "7"
  );
  const [language, setLanguage] = useState(storedLanguage);
  const [favoriteCharacter, setFavoriteCharacter] = useState(
    typeof window !== "undefined" ? window.sessionStorage.getItem("favoriteCharacter") || "rocco" : "rocco"
  );

  const email = useMemo(() => user?.email || "nimrahkamran620@gmail.com", [user?.email]);
  const authProvider = user?.app_metadata?.provider;
  const canChangePassword = authProvider !== "google" && authProvider !== "facebook";

  const topBarIcons = [
    { volumeToggle: true, alt: "Volume" },
    { src: reportNew, alt: "Reports", onClick: () => navigate("/reports") },
    { src: homeButton, alt: "Home", onClick: () => navigate("/english") },
    { src: signoutNew, alt: "Account", logoutMenu: true },
  ];

  const handleSave = async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("childName", childName);
      window.sessionStorage.setItem("childAge", childAge);
      window.sessionStorage.setItem("favoriteCharacter", favoriteCharacter);
      window.localStorage.setItem("app_language", language);
    }
    i18n.changeLanguage(language);

    if (!user?.id) return;

    await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          child_name: childName,
          child_age: childAge ? parseInt(childAge, 10) : null,
          language: language === "ur" ? "urdu" : "english",
          favorite_character: favoriteCharacter,
        },
        {
          onConflict: "user_id",
        }
      );

    await refreshProfile();
  };

  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("child_name, child_age, language, favorite_character")
        .eq("user_id", user.id)
        .maybeSingle();

      if (ignore || error || !data) return;

      if (data.child_name) {
        setChildName(data.child_name);
      }

      if (data.child_age != null) {
        setChildAge(String(data.child_age));
      }

      if (data.language) {
        setLanguage(normalizeLanguage(data.language));
      }

      if (data.favorite_character) {
        setFavoriteCharacter(data.favorite_character);
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("favoriteCharacter", data.favorite_character);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  // Determine background image and position based on favoriteCharacter
  const isBubbles = favoriteCharacter === "bubbles";
  const isMimmi = favoriteCharacter === "mimmi" || favoriteCharacter === "mimi";
  const settingsBg = isBubbles
    ? bubblesSettingsBg
    : isMimmi
      ? mimmiSettingsBg
      : englishBackground;
  const settingsBgPosition = isBubbles
    ? "center calc(100% + 5.2cqh)" // was 4cqh, now 2cqh further down
    : isMimmi
      ? "center calc(100% + 15cqh)"
      : "bottom center";
  const laptopWideLayout = "@media (min-width: 1200px) and (min-aspect-ratio: 3/2)";
  // iPad 11" (1180x820) and iPad 13" (1366x1024) media queries
  const ipad11Media = "@media (min-width: 1170px) and (max-width: 1190px) and (min-height: 810px) and (max-height: 830px)";
  const ipad13Media = "@media (min-width: 1350px) and (max-width: 1380px) and (min-height: 1000px) and (max-height: 1050px)";

  return (
    <Box
      sx={{
        width: "100cqw",
        height: "100cqh",
        minHeight: "100cqh",
        backgroundImage: `url(${settingsBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: settingsBgPosition,
        position: "relative",
        overflow: "hidden",
        containerType: "size",
        [laptopWideLayout]: {
          backgroundPosition: isBubbles
            ? "center calc(100% + 9cqh)" // was 7cqh, now 2cqh further down
            : isMimmi
              ? "center calc(100% + 20cqh)"
              : "bottom center",
        },
        // iPad 11" (move Mimmi bg 1 unit up)
        [ipad11Media]: isMimmi ? {
          backgroundPosition: "center calc(100% + 14cqh)",
        } : {},
        // iPad 13" (move Mimmi bg 3 units up)
        [ipad13Media]: isMimmi ? {
          backgroundPosition: "center calc(100% + 12cqh)",
        } : {},
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: "5cqw",
          pt: "3.6cqh",
          pb: "1cqh",
          height: "10cqh",
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0.656) 26.91%, rgba(0, 0, 0, 0) 100%)",
          boxShadow: "none",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 3,
        }}
      >
        <Box component={AppGreetingHeader} sx={{ width: "17cqw", minWidth: "16cqh", mt: 0 }} />
        <Box sx={{ display: "flex", gap: "0.7cqw" }}>
          {topBarIcons.map((item, index) =>
            item.volumeToggle ? (
              <TopBarVolumeIcon
                key={index}
                alt={item.alt}
                sx={{
                  width: "5.6cqh",
                  height: "5.6cqh",
                  objectFit: "contain",
                  mt: 0,
                  filter: "brightness(1.12) contrast(1.08) drop-shadow(0 0.25cqh 0.75cqh rgba(0,0,0,0.22))",
                }}
              />
            ) : item.logoutMenu ? (
              <TopBarLogoutIcon
                key={index}
                src={item.src}
                alt={item.alt}
                sx={{
                  width: "5.6cqh",
                  height: "5.6cqh",
                  objectFit: "contain",
                  mt: 0,
                  filter: "brightness(1.12) contrast(1.08) drop-shadow(0 0.25cqh 0.75cqh rgba(0,0,0,0.22))",
                }}
              />
            ) : (
              <Box
                key={index}
                component="img"
                src={item.src}
                alt={item.alt}
                onClick={item.onClick}
                sx={{
                  width: "5.6cqh",
                  height: "5.6cqh",
                  objectFit: "contain",
                  mt: 0,
                  cursor: item.onClick ? "pointer" : "default",
                  filter: "brightness(1.12) contrast(1.08) drop-shadow(0 0.25cqh 0.75cqh rgba(0,0,0,0.22))",
                }}
              />
            )
          )}
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          bottom: "7cqh",
          transform: "translateX(-50%)",
          width: "min(82cqw, 98cqh)",
          aspectRatio: "986 / 821",
          containerType: "size",
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          src={settingsBoard}
          alt="Settings board"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        <Typography
          sx={{
            position: "absolute",
            top: "6.5cqh",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "Chewy",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "5.2cqh",
            lineHeight: "90%",
            letterSpacing: "0%",
            color: "#5f2506",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          Settings
        </Typography>

        <Box
          sx={{
            position: "absolute",
            top: "26.2cqh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "48cqw",
            display: "flex",
            flexDirection: "column",
            gap: "2.05cqh",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.55cqh" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: "Chewy", color: "#7e3f0b", fontWeight: 400, fontStyle: "normal", fontSize: "2.55cqh", lineHeight: "90%", letterSpacing: "0%" }}>
              Email
            </Typography>
            {canChangePassword && (
              <Button
                type="button"
                onClick={() => navigate("/change-password")}
                sx={{
                  fontFamily: "Chewy",
                  color: "#7e3f0b",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "2.2cqh",
                  minWidth: "auto",
                  padding: 0,
                  lineHeight: "2.7cqh",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                  textDecorationColor: "#7e3f0b",
                  textDecorationThickness: "0.14cqh",
                  textUnderlineOffset: "0.25cqh",
                  transform: "translateY(-1.7cqh)",
                  textTransform: "none",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Change Password
              </Button>
            )}
            </Box>
            <TextField
              value={email}
              disabled
              fullWidth
              InputProps={{ sx: fieldSx }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.55cqh" }}>
            <Typography sx={labelSx}>Child's Name</Typography>
            <TextField
              value={childName}
              onChange={(event) => setChildName(event.target.value)}
              fullWidth
              InputProps={{
                sx: fieldSx,
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      component="img"
                      src={editIcon}
                      alt="Edit"
                      sx={{ width: "2.6cqh", height: "2.6cqh", objectFit: "contain" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.55cqh" }}>
            <Typography sx={labelSx}>Child's Age</Typography>
            <TextField
              value={childAge}
              onChange={(event) => setChildAge(event.target.value)}
              fullWidth
              InputProps={{
                sx: fieldSx,
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      component="img"
                      src={editIcon}
                      alt="Edit"
                      sx={{ width: "2.6cqh", height: "2.6cqh", objectFit: "contain" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.55cqh" }}>
            <Typography sx={labelSx}>Select Language</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2cqw", width: "100%" }}>
              <Button
                onClick={() => setLanguage("ur")}
                sx={language === "ur" ? activeLanguageButtonSx : languageButtonSx}
              >
                Urdu
              </Button>
              <Button
                onClick={() => setLanguage("en")}
                sx={language === "en" ? activeLanguageButtonSx : languageButtonSx}
              >
                English
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "0.55cqh" }}>
            <Typography sx={labelSx}>Select Character</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.9cqw", width: "100%" }}>
              {characterOptions.map((character) => (
                <Button
                  key={character.value}
                  onClick={() => setFavoriteCharacter(character.value)}
                  sx={characterButtonSx(character.color, favoriteCharacter === character.value)}
                >
                  {character.name}
                </Button>
              ))}
            </Box>
          </Box>

          <Button onClick={handleSave} sx={saveButtonSx}>
            Save Changes
          </Button>
        </Box>
      </Box>

      <Box
        component="img"
        src={backNew}
        alt="Back"
        onClick={() => navigate("/english")}
        sx={{
          position: "absolute",
          left: "3cqw",
          bottom: isBubbles || isMimmi ? "-2cqh" : "6cqh", // Move up for Bubbles
          width: "25cqh",
          height: "30cqh",
          objectFit: "contain",
          cursor: "pointer",
          zIndex: 2,
          "&:hover": {
            transform: "scale(1.04)",
          },
        }}
      />
    </Box>
  );
}

const labelSx = {
  fontFamily: "Chewy",
  color: "#7e3f0b",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "2.55cqh",
  lineHeight: "90%",
  letterSpacing: "0%",
  mt: 0,
};

const fieldSx = {
  borderRadius: "1.25cqh",
  backgroundColor: "#914b14",
  color: "#f5c37d",
  fontFamily: "Chewy",
  width: "100%",
  height: "5.8cqh",
  minHeight: "5.8cqh",
  fontSize: "2.45cqh",
  lineHeight: "90%",
  letterSpacing: "0%",
  "& input": {
    color: "#f5c37d",
    fontFamily: "Chewy",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "2.45cqh",
    lineHeight: "90%",
    letterSpacing: "0%",
    py: 0,
    px: "1.4cqw",
    height: "5.8cqh",
    boxSizing: "border-box",
  },
  "& .MuiInputAdornment-root": {
    mr: "0.7cqw",
  },
  "& fieldset": {
    border: "none",
  },
};

const languageButtonSx = {
  borderRadius: "1.25cqh",
  backgroundColor: "#b47a3f",
  color: "#f5c37d",
  fontFamily: "Chewy",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "2.45cqh",
  lineHeight: "90%",
  letterSpacing: "0%",
  textTransform: "none",
  minHeight: "5.8cqh",
  py: 0,
  "&:hover": {
    backgroundColor: "#a96d31",
  },
};

const activeLanguageButtonSx = {
  ...languageButtonSx,
  backgroundColor: "#7a3d10",
  "&:hover": {
    backgroundColor: "#6b340d",
  },
};

const characterButtonSx = (color: string, selected: boolean) => ({
  borderRadius: "1.25cqh",
  backgroundColor: color,
  color: "#fff",
  fontFamily: "Chewy",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "2.25cqh",
  lineHeight: "90%",
  letterSpacing: "0%",
  textTransform: "none",
  minHeight: "5.4cqh",
  py: 0,
  opacity: selected ? 1 : 0.72,
  border: selected ? "0.28cqh solid rgba(95, 37, 6, 0.72)" : "0.28cqh solid transparent",
  boxShadow: selected ? "0 0.55cqh 1.3cqh rgba(95, 37, 6, 0.22)" : "none",
  "&:hover": {
    backgroundColor: color,
    opacity: 1,
  },
});

const saveButtonSx = {
  mt: "0.3cqh",
  borderRadius: "1.25cqh",
  background: "linear-gradient(180deg, #d97a08 0%, #b75d00 100%)",
  color: "#fff",
  fontFamily: "Chewy",
  fontSize: "2.65cqh",
  textTransform: "none",
  minHeight: "6.1cqh",
  py: 0,
  boxShadow: "0 1cqh 2.2cqh rgba(122,61,16,0.28)",
  "&:hover": {
    background: "linear-gradient(180deg, #c86f08 0%, #a85400 100%)",
  },
};
