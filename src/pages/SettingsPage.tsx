import { useEffect, useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import i18n from "@/i18n";
import englishBackground from "../assests/english_bg.png";
import settingsBoard from "../assests/settingsboard.png";
import reportNew from "../assests/report-new.png";
import homeButton from "../assests/homebutton.png";
import settingsIcon from "../assests/settings.png";
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
        .select("child_name, child_age, language")
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
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${englishBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: "5%",
          py: 1.25,
          background: "linear-gradient(10deg, rgba(5, 8, 7, 0.6) 0%, rgba(11,61,46,0.4) 100%)",
        }}
      >
        <Box component={AppGreetingHeader} sx={{ width: { lg: "17%", md: "25%", sm: "29%", xs: "34%" }, mt: { lg: "0.5%", xs: "2%" } }} />
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          {topBarIcons.map((item, index) =>
            item.volumeToggle ? (
              <TopBarVolumeIcon
                key={index}
                alt={item.alt}
                sx={{
                  width: { lg: "45px", md: "42px", sm: "36px", xs: "30px" },
                  height: { lg: "45px", md: "42px", sm: "36px", xs: "30px" },
                  objectFit: "contain",
                  mt: { lg: "16px", md: "19px", sm: "18px", xs: "18px" },
                  filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                }}
              />
            ) : item.logoutMenu ? (
              <TopBarLogoutIcon
                key={index}
                src={item.src}
                alt={item.alt}
                sx={{
                  width: { lg: "45px", md: "42px", sm: "36px", xs: "30px" },
                  height: { lg: "45px", md: "42px", sm: "36px", xs: "30px" },
                  objectFit: "contain",
                  mt: { lg: "16px", md: "19px", sm: "18px", xs: "18px" },
                  filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
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
                  width: { lg: "45px", md: "42px", sm: "36px", xs: "30px" },
                  height: { lg: "45px", md: "42px", sm: "36px", xs: "30px" },
                  objectFit: "contain",
                  mt: { lg: "16px", md: "19px", sm: "18px", xs: "18px" },
                  cursor: item.onClick ? "pointer" : "default",
                  filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                }}
              />
            )
          )}
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pt: { lg: 6, xs: 7 },
        }}
      >
        <Box
          component="img"
          src={settingsBoard}
          alt="Settings board"
          sx={{
            width: { lg: "46rem", md: "38rem", sm: "84vw", xs: "88vw" },
            maxWidth: "88vw",
            maxHeight: "calc(100vh - 110px)",
            objectFit: "contain",
          }}
        />

        <Typography
          sx={{
            position: "absolute",
            top: { lg: "calc(12.5% + 2px)", md: "calc(12% + 2px)", sm: "calc(11% + 2px)", xs: "calc(10.5% + 2px)" },
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "Chewy",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "40px",
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
            top: { lg: "calc(20% + 88px)", md: "calc(19% + 88px)", sm: "calc(17% + 88px)", xs: "calc(15% + 88px)" },
            width: { lg: "24rem", md: "20.5rem", sm: "52vw", xs: "58vw" },
            display: "flex",
            flexDirection: "column",
            gap: { lg: "0.95rem", xs: "0.7rem" },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.45 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: "Chewy", color: "#7e3f0b", fontWeight: 400, fontStyle: "normal", fontSize: "16px", lineHeight: "90%", letterSpacing: "0%" }}>
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
                  fontSize: "15px",
                  minWidth: "auto",
                  padding: 0,
                  lineHeight: "22px",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                  textDecorationColor: "#7e3f0b",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "2px",
                  transform: "translateY(-15px)",
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.45 }}>
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
                      sx={{ width: "18px", height: "18px", objectFit: "contain" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.45 }}>
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
                      sx={{ width: "18px", height: "18px", objectFit: "contain" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.45 }}>
            <Typography sx={labelSx}>Select Language</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, width: "100%" }}>
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
          left: { lg: "42px", sm: "18px", xs: "14px" },
          bottom: { lg: "41px", sm: "27px", xs: "25px" },
          width: { lg: "210px", sm: "170px", xs: "150px" },
          height: { lg: "250px", sm: "210px", xs: "180px" },
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
  fontSize: "16px",
  lineHeight: "90%",
  letterSpacing: "0%",
  mt: 0,
};

const fieldSx = {
  borderRadius: "10px",
  backgroundColor: "#914b14",
  color: "#f5c37d",
  fontFamily: "Chewy",
  width: "100%",
  minHeight: { lg: "44px", xs: "38px" },
  fontSize: "16px",
  lineHeight: "90%",
  letterSpacing: "0%",
  "& input": {
    color: "#f5c37d",
    fontFamily: "Chewy",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "16px",
    lineHeight: "90%",
    letterSpacing: "0%",
    py: 0.25,
  },
  "& fieldset": {
    border: "none",
  },
};

const languageButtonSx = {
  borderRadius: "10px",
  backgroundColor: "#b47a3f",
  color: "#f5c37d",
  fontFamily: "Chewy",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "16px",
  lineHeight: "90%",
  letterSpacing: "0%",
  textTransform: "none",
  minHeight: { lg: "44px", xs: "38px" },
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

const saveButtonSx = {
  mt: 1,
  borderRadius: "10px",
  background: "linear-gradient(180deg, #d97a08 0%, #b75d00 100%)",
  color: "#fff",
  fontFamily: "Chewy",
  fontSize: { lg: 17, xs: 14 },
  textTransform: "none",
  py: 0.6,
  boxShadow: "0 8px 18px rgba(122,61,16,0.28)",
  "&:hover": {
    background: "linear-gradient(180deg, #c86f08 0%, #a85400 100%)",
  },
};
