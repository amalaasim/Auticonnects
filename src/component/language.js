import * as React from 'react';
import i18n from "i18next";
import { Box, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";

import bg from '../assests/language_bg.png';
import logo from '../assests/logo.png';
import contact from '../assests/contact.png';
import search from '../assests/search.png';
import refresh from '../assests/refresh.png';
import settings from '../assests/settings.png';
import blue_bg from '../assests/blue_bg.png';
import select from '../assests/select_language.png';
import text from '../assests/text.png';
import click from '../assests/click.png';
import English from '../assests/English.png';
import Urdu from '../assests/urdu.png';

export default function Language() {
  const navigate = useNavigate();

  const selectEnglish = () => {
    i18n.changeLanguage("en");
    navigate("/english");
  };

  const selectUrdu = () => {
    i18n.changeLanguage("ur");
    navigate("/english");
  };

  return (
    <Box sx={{ cursor: `url(${click}) 32 32, auto` }}>
      <Box
        sx={{
          backgroundImage: `url(${bg})`,
          width: "100%",
          height: "100vh",
          minHeight: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* TOP BAR */}
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { lg: "5%", md: "5%", sm: "4%", xs: "3%" },
            borderRadius: "10px",
            background:
              "linear-gradient(10deg, rgba(69,73,72,0.4) 0%, rgba(89,96,94,0.2) 100%)",
          }}
        >
          <Box
            component="img"
            src={logo}
            sx={{
              width: { lg: "17%", md: "22%", sm: "30%", xs: "38%" },
              mt: { lg: "1.5%", md: "2%", sm: "6%", xs: "10%" },
            }}
          />

          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            {[contact, search, refresh, settings].map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                sx={{
                  width: { lg: "45px", md: "40px", sm: "35px", xs: "30px" },
                  height: "auto",
                  mt: { lg: "27px", md: "30px", sm: "50px", xs: "70px" },
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* BACKGROUNDS */}
        <Box component="img" src={blue_bg} sx={{ width: "100%", height: "22%", mt: { lg: "1%", md: "4%", sm: "2%", xs: "7%" } }} />

        <Box
          component="img"
          src={text}
          sx={{
            width: { lg: "80%", md: "85%", sm: "91%", xs: "95%" },
            mt: { lg: "-12%", md: "-20%", sm: "-26%", xs: "-36%" },
            ml: { lg: "9.3%", md: "7%", sm: "5%", xs: "2.5%" },
          }}
        />

        <Box
          component="img"
          src={select}
          sx={{
            width: { lg: "35.6%", md: "57%", sm: "61.8%", xs: "83.7%" },
            ml: { lg: "33.3%", md: "25%", sm: "19%", xs: "12.5%" },
            mt:{ lg: "0%", md: "-0.5%", sm: "7%", xs: "12%" },
            height: "auto",
          }}
        />

        {/* ENGLISH */}
        <Box
          onClick={selectEnglish}
          component="img"
          src={English}
          sx={{
            width: { lg: "15%", md: "29%", sm: "31%", xs: "40%" },
            ml: { lg: "43.3%", md: "39%", sm: "34.8%", xs: "32%" },
            mt: { lg: "-44.5%", md: "-71%", sm: "-77.9%", xs: "-106%" },
            "&:hover": { transform: "scale(1.08)" },
            opacity: 0.9,
          }}
        />

        {/* URDU */}
        <Box
          onClick={selectUrdu}
          component="img"
          src={Urdu}
          sx={{
            width: { lg: "10%", md: "19%", sm: "21%", xs: "27%" },
            ml: { lg: "47%", md: "44%", sm: "41%", xs: "42%" },
            mt: { lg: "-28%", md: "-45%", sm: "-50%", xs: "-70%" },
            "&:hover": { transform: "scale(1.08)" },
            opacity: 0.9,
          }}
        />
      </Box>
    </Box>
  );
}
