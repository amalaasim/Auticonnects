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

// ✅ Import Framer Motion
import { motion } from "framer-motion";

export default function English() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    minHeight: "100vh",
    backgroundColor: "transparent",
  }}
>

      <Box dir={i18n.language === 'ur' ? 'rtl' : 'ltr'} sx={{ cursor: `url(${click}) 32 32, auto` }}>
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
          <Paper
            dir="ltr"
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "5%",
              paddingRight: "5%",
              paddingTop: { lg: "28px", md: "28px", sm: "32px", xs: "40px" },
              paddingBottom: "8px",
              marginTop: 0,
              border: "none",
              background: "transparent",
              boxShadow: "none",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0.656) 26.91%, rgba(0, 0, 0, 0) 100%)",
                pointerEvents: "none",
                zIndex: 0,
              },
            }}
          >
            <Box
              component={AppGreetingHeader}
              sx={{
                position: "relative",
                zIndex: 1,
                width: { lg: "17%", md: "25%", sm: "29%", xs: "27%" },
                marginTop: 0,
                textAlign: "left",
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "row", gap: "0.5rem", direction: "ltr" }}>
              {topBarIcons.map((item, i) => (
                item.volumeToggle ? (
                  <TopBarVolumeIcon
                    key={i}
                    alt={item.alt}
                    sx={{
                      width: { lg: "45.23px", md: "25%", sm: "30%", xs: "40px" },
                      height: {lg:"45.23px",sm:"45.23px"},
                      objectFit: "contain",
                      paddingBottom:{ lg: "0", md: "0", sm: "3%", xs: "0"},
                      marginTop: 0,
                      opacity: 1,
                      filter: "brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))",
                    }}
                  />
                ) : item.logoutMenu ? (
                  <TopBarLogoutIcon
                    key={i}
                    src={item.src}
                    alt={item.alt}
                    sx={{
                      width: { lg: "45.23px", md: "25%", sm: "30%", xs: "40px" },
                      height: {lg:"45.23px",sm:"45.23px"},
                      objectFit: "contain",
                      paddingBottom:{ lg: "0", md: "0", sm: "3%", xs: "0"},
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
                      width: { lg: "45.23px", md: "25%", sm: "30%", xs: "40px" },
                      height: {lg:"45.23px",sm:"45.23px"},
                      objectFit: "contain",
                      paddingBottom:{ lg: "0", md: "0", sm: "3%", xs: "0"},
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

          {/* Cards */}
          <Box sx={{ display: "flex", flexDirection: {lg:"row",md:"row",sm:"column"},marginLeft:{ lg: "0", md: "0", sm: "5%", xs: "0"},
justifyContent: "space-around", padding: "4%",marginTop:"-2%",
gap:{ lg:"2.75rem", md:"2rem", sm:"1rem" } }}>

            {/* WonderWorld */}
            <Box
              onClick={() => navigate("/wonderworld")}
              sx={{ display: "flex", flexDirection: "column", opacity: "0.9", cursor: "pointer","&:hover": {
                  transform: "scale(1.08)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0)",
                }, }}
            >
              <Box
                component="img"
                sx={{ borderRadius: "20px", height: { lg: "45vh", md: "40vh", sm: "30vh", xs: "30vh" },
              width: { lg: "100%", md: "100%", sm: "95%", xs: "30%"},}}
                src={game}
              />

              <Typography sx={{backgroundColor:"rgba(111, 117, 131, 0.6)",fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" :  "Petrona",fontWeight:"600",color:"rgba(255, 255, 255, 1)",fontSize:i18n.language === "ur" ? "28px" : "22px",lineHeight:i18n.language === "ur" ? "36px":"24px",paddingRight:"5%",letterSpacing:"0.38px",
                  mt: { lg: i18n.language === "ur" ? "-23.5%" : "-19.3%", sm: i18n.language === "ur" ?"-23%": "-19.3%", xs: "-12%" },
               width:{ lg: "100%", md: "100%", sm: "95%", xs: "100%"},
paddingTop:"2.3%",paddingLeft:"5%",paddingBottom:"2.6%",height:"auto",borderRadius:"20px"}}>
                <span style={{fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" :  "chewy",fontWeight:"400",fontStyle:"Regular",fontSize:i18n.language === "ur" ? "42px" : "26.45px",lineHeight:"47px",letterSpacing:"2px"}}>
                  {t("wonderWorldTitle")}
                </span>
                <br />
                {t("wonderWorldDesc.line1")}<br/>
                {t("wonderWorldDesc.line2")}
              </Typography>
            </Box>

            {/* Social Storyland */}
            <Box onClick={() => navigate("/garden")} sx={{ display: "flex", flexDirection: "column", opacity: "0.9", cursor: "pointer","&:hover": {
                  transform: "scale(1.08)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0)",
                }, }}>
              <Box 
                component="img"
                sx={{ borderRadius: "20px", height: { lg: "45vh", md: "40vh", sm: "30vh", xs: "30vh" },
              width: { lg: "100%", md: "100%", sm: "95%", xs: "30%"},}}
                src={storyland}
              />

              <Typography sx={{backgroundColor:"rgba(111, 117, 131, 0.6)",
    width:{ lg: "100%", md: "100%", sm: "95%", xs: "100%"},
paddingRight:"5%",paddingBottom:"2.6%",fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" : "Petrona",fontWeight:"600",color:"rgba(255, 255, 255, 1)",fontSize:i18n.language === "ur" ? "27px" : "22px",lineHeight:i18n.language === "ur" ? "36px" : "24px",letterSpacing:"0.38px",
mt: { lg: i18n.language === "ur" ? "-23.5%" : "-19.5%", sm:  i18n.language === "ur" ?"-22.6%":"-19.2%", xs: "-12%" },
paddingTop:"2.3%",paddingLeft:"5%",height:"auto",borderRadius:"20px"}}>
                  <span style={{fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "chewy",fontWeight:"400",fontStyle:"Regular",fontSize:i18n.language === "ur" ? "42px" : "26.45px",lineHeight:"47px",letterSpacing:"2px"}}>
                  {t("socialStoryTitle")}
                </span>
                <br />
                {t("socialStoryDesc.line1")}<br/>
                {t("socialStoryDesc.line2")}
              </Typography>
            </Box>
          </Box>

          {/* Rocco */}
          <Box
            onClick={openSheruBot}
            sx={{width:{ lg:"calc(100% - 4%)", md:"calc(100% - 4%)", sm:"98%", xs:"96%" }, mx:"auto", borderRadius:"20px", cursor: "pointer","&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0)",

                },}}
          >
          <Box sx={{ display: "flex", flexDirection: "column",marginTop:"-2%",borderRadius:"20px" }}>
            <Box component="img" src={back} sx={{ width: {lg:"100%",md:"100%",sm:"98%", xs:"100%"},
                  height: { lg: "22vh", md: "22vh", sm: "17vh", xs: "15vh" },
               borderRadius:{lg:"7%"}, paddingLeft: {lg:"2%", md:"2%", sm:i18n.language === "ur" ? "12%" :"9%", xs:"0"}, paddingRight: { lg:"2%", md:"2%", sm:"6%", xs:"0" }, 
               }} />

            <Typography  sx={{paddingBottom:"2.3%",
            fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" : "Petrona",
              fontWeight:"500",
              color:"rgba(255, 255, 255, 1)",
              fontSize:{lg:i18n.language === "ur" ? "28px" : "22px", sm: i18n.language === "ur" ? "22px" : "18px"},
              lineHeight:i18n.language === "ur" ? "37px" : "24px",
              letterSpacing:"0.38px",
                px: { lg: i18n.language === "ur" ? "8%" : "8%", sm: "12%", xs: "2%" },
              marginTop:{lg:"-10.5%",sm:"-17%"},
              width:{lg:"100%",sm:"70%"},paddingTop:"2.3%",paddingLeft: i18n.language === "ur" ? "0%" : "8%",paddingRight: i18n.language === "ur" ? "8%" : "0%",height:"100%",borderRadius:"20px"}}>
                      <span style={{fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",fontWeight:"400",fontStyle:"normal",fontSize:{lg:i18n.language === "ur" ? "42px" : "37.35px",},lineHeight:"30px",letterSpacing:"2px",width:"100%"}}>              
                        {t("roccoTitle")}
                    </span>
                    <br />
            {t("roccoDesc.line1")}
            {t("roccoDesc.line2")}
          </Typography>
        </Box>

       <Box component="img" src={cartoon} sx={{width:{lg:"32%",sm:"235%"},height:"43%", marginLeft:"66%",marginRight:{lg:i18n.language === "ur" ? "70%" : "0%",sm:i18n.language === "ur" ? "65%" : "0%"},paddingLeft:"6%",marginTop:{lg: i18n.language === "ur" ?"-18%":"-16%",sm: i18n.language === "ur" ?"-24%":"-35%"}, position: "relative", zIndex: 1, pointerEvents: "none"}}/>
       </Box>
       </Box>
      </Box>
    </motion.div>
  );
}
