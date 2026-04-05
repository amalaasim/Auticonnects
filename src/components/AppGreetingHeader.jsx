import * as React from "react";
import { Box, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";

const LETTER_COLORS = [
  "#66d9ff",
  "#8ae45f",
  "#ff4fa0",
  "#ff9f1c",
  "#7e7cff",
  "#38d39f",
  "#ffd166",
];

function renderColoredText(text) {
  return text.split("").map((char, index) => (
    <Box
      key={`${char}-${index}`}
      component="span"
      sx={{
        color: char === " " ? "#fff" : LETTER_COLORS[index % LETTER_COLORS.length],
        WebkitTextStroke: "3.13px #ffffff",
        paintOrder: "stroke fill",
        textShadow: "0px 1.14px 1.14px rgba(0,0,0,0.25)",
        display: "inline-block",
        lineHeight: 1,
        mr: char === " " ? "0.5em" : "0.12em",
      }}
    >
      {char}
    </Box>
  ));
}

export default function AppGreetingHeader({ sx = {} }) {
  const { childName } = useAuth();
  const trimmedName = childName?.trim();
  const primaryText = trimmedName ? `Hi-${trimmedName}` : "AutiConnects";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        minWidth: 0,
        ...sx,
      }}
    >
      <Typography
        component="div"
        sx={{
          fontFamily: '"Chewy", cursive',
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: {
            lg: trimmedName ? "38.72px" : "34px",
            md: trimmedName ? "32px" : "28px",
            sm: trimmedName ? "24px" : "22px",
            xs: trimmedName ? "16px" : "15px",
          },
          lineHeight: 1,
          letterSpacing: "0.12em",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          textTransform: trimmedName ? "uppercase" : "none",
        }}
      >
        {renderColoredText(primaryText)}
      </Typography>

      <Typography
        sx={{
          mt: "1px",
          pl: 0,
          fontFamily: '"Chewy", cursive',
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: { lg: "12.12px", md: "10.5px", sm: "9px", xs: "7px" },
          lineHeight: 1,
          color: "#ffffff",
          letterSpacing: "0.12em",
          textShadow: "0 2px 8px rgba(0,0,0,0.28)",
          whiteSpace: "nowrap",
          textAlign: "left",
          alignSelf: "flex-start",
        }}
      >
        Welcome to Auti-connects playground.
      </Typography>
    </Box>
  );
}
