import * as React from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import learnbg from '../assests/verify_shoe.png';
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import click from '../assests/click.png';
import pegion from '../assests/pegion.png';
import CloseIcon from '@mui/icons-material/Close';
import gradient from '../assests/gradient.png';
function Verifyshoe() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userAnswer, setUserAnswer] = React.useState("");
  const [feedback, setFeedback] = React.useState("");

  const handleSubmit = () => {
    if (userAnswer.trim() === "3") {
      navigate("/uploadshoe"); 
      setFeedback("Try Again!");
    }
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
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
        <Box
          sx={{
            backgroundColor:"transparent",
            width: "100%",
            height: "100vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "tra",
              width: "100%",
              height: "100%",
              opacity: "0.85",
              backgroundAttachment: "fixed",
              pointerEvents: "none"
            }}
          />    

          <Box 
            component="img" 
            sx={{ 
              width: "35%", 
              height: "74%", 
              marginLeft: "32%", 
              marginTop: "-42%",
              position:"absolute", 
            }} 
            src={pegion}
          />
          
          <Box 
            component="img" 
            sx={{ 
              width: "33%", 
              height: "34%", 
              marginLeft: "33.5%", 
              marginTop: "-27%",
              position:"absolute", 
            }} 
            src={gradient}
          />

          <Box sx={{
            display:"flex",
            justifyContent:"flex-start",
            marginTop:"-47%",
            marginLeft:"36%",
            padding:"0.5%",
            flexDirection:"column",
            gap:"0.5rem"
          }}>
            <Box sx={{
              display:"flex",
              justifyContent:"flex-start",
              marginTop:"32%",
              padding:"2%",
              flexDirection:"row"
            }}>
              <Typography
                sx={{
                  fontSize: i18n.language === "ur" ? "40px" : "40px",
                  fontStyle:"normal",
                  lineHeight:"90%",
                  marginLeft:"-2%",
                  fontFamily: 'Chewy',
                  letterSpacing:"1px",
                  color: "#783600",
                  opacity:"0.9",
                }}
              >
                {t("adult")}
              </Typography>
              <CloseIcon sx={{
                fontSize: 40,
                color: "#783600", 
                marginLeft: "21%",
                position:"absolute"
              }} />
            </Box>

            <Typography
              sx={{
                fontSize: i18n.language === "ur" ? "20px" : "20px",
                marginTop: "24.5%",
                fontStyle:"normal",
                lineHeight:"90%",
                fontWeight:"800",
                fontFamily: 'Chewy',
                letterSpacing:"1px",
                position:"absolute",
                color: "#883901",
                opacity:"0.9",
              }}
            >
                              {t("shoeQuestion")}
            </Typography>

            {/* Input Field */}
            <TextField
              variant="filled"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              sx={{
                position:"absolute",
                marginTop: "26.5%",
                width:"25%",
                height:"6%",
                color:"#c9742e",
                backgroundColor: "#783600",
                borderRadius: "5px",
                  '& input': {
      color: '#c9742e',
    marginTop:"-3.4%" }
              }}
            />

            <Button 
              variant='contained' 
              onClick={handleSubmit}
              sx={{
                backgroundColor:"#d56509",
                color:"#482406", 
                position:"absolute",
                marginTop: "30%",
                width:"25%",
                height:"6%",
                fontSize:"20px",
                fontWeight:"900"
              }}
            >
                              {t("Submit")}
            </Button>

            {feedback && (
              <Typography sx={{
                position:"absolute",
                marginTop:"36%",
                color: "tan",
                fontSize:"18px",
                fontWeight:"bold",
              }}>
                {feedback}
              </Typography>
            )}

          </Box>
        </Box>
      </Box>
    </motion.div>
  )
}

export default Verifyshoe;
