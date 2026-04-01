import * as React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Assets
import logo from "../assests/logo.png";
import setting from "../assests/setting.png";
import contact from "../assests/contact.png";
import search from "../assests/search.png";
import refresh from "../assests/refresh.png";
import settings from "../assests/settings.png";
import learning from "../assests/learning_button.png";
import identification from "../assests/identification.png";
import back from "../assests/back.png";
import click from "../assests/click.png";
import backbg from "../assests/backbg.png";

function GameSelection() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Helper to keep code clean since both buttons look similar
  const GameOption = ({ image, title, link, labelWidth, titleMarginLeft }) => (
    <Box
      onClick={() => navigate(link)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.08)",
        },
      }}
    >
      {/* Main Circular Image */}
      <Box
        component="img"
        src={image}
        sx={{
          width: "clamp(12rem, 20vw, 19rem)",
          height: "auto",
          borderRadius: "50%",
        }}
      />

      {/* Label Container (Background + Text) */}
      <Box
        sx={{
          position: "relative",
          marginTop: "-10%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Label Background Pill */}
        <Box
          component="img"
          src={backbg}
          sx={{
            width: labelWidth || "70%",
            height: "auto",
          }}
        />
        
        {/* Text Overlay */}
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Perfect centering
            width: "100%",
            textAlign: "center",
            fontSize: "clamp(1.05rem, 2.1vw, 1.6rem)",
            fontFamily: "Chewy",
            letterSpacing: "0.06em",
            color: "rgb(15, 21, 27, 0.8)",
            lineHeight: "1",
            paddingTop: "0.35rem", // Visual adjustment for Chewy font
          }}
        >
          {t(title)}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        // --- FIX: Locks the screen so footer cannot leak through ---
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999, // High priority to sit on top of everything
        // ---------------------------------------------------------
        overflow: "hidden",
        cursor: `url(${click}) 32 32, auto`,
        backgroundColor: "#0b1c16",
      }}
    >
      {/* --- Header Section --- */}
      <Paper
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: { xs: "1rem", md: "1rem 5vw" },
          background:
            "linear-gradient(10deg, rgba(5, 8, 7, 0.6) 0%, rgba(11,61,46,0.4) 100%)",
          borderRadius: "0 0 0.6rem 0.6rem",
          border: "none",
          boxShadow: "none",
        }}
      >
        <Box
          component="img"
          src={logo}
          sx={{
            width: "clamp(7.5rem, 18vw, 14rem)",
            height: "auto",
          }}
        />
        <Box sx={{ display: "flex", gap: "1rem" }}>
          {[setting, contact, search, refresh, settings].map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              sx={{
                width: "clamp(1.7rem, 3.2vw, 2.8rem)",
                height: "auto",
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* --- Main Content (Centered Automatically) --- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack on phone, row on PC
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 18vh)", // Full height minus header
          gap: { xs: 4, md: 8, lg: 15 }, // Space between the two buttons
          marginTop: "-2vh" // Slight visual lift
        }}
      >
        <GameOption
          image={learning}
          title="objectLearningTitle"
          link="/wonderworld"
          labelWidth="40%"
        />

        <GameOption
          image={identification}
          title="objectIdentificationTitle"
          link="/wonderworld"
          labelWidth="70%"
        />
      </Box>

      {/* --- Back Button --- */}
      <Box
        component="img"
        onClick={() => navigate("/English")}
        src={back}
        sx={{
          position: "absolute",
          left: "clamp(0.6rem, 2vw, 3rem)",
          bottom: "clamp(0.6rem, 2vw, 1.5rem)",
          width: "clamp(9rem, 18vw, 16rem)",
          height: "auto",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "scale(1.08)" },
        }}
      />
    </Box>
  );
}

export default GameSelection;
