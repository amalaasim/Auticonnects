import * as React from 'react';
import { Box,Typography } from '@mui/material';
import learnbg from '../assests/learn_bg.png';
import board from '../assests/board.png';
import { useRef,useEffect,useState } from 'react';
import brown from '../assests/brown_board.png';
import full from '../assests/shoeo.png';
import half from '../assests/shoeg.png';
import three from '../assests/shoer.png';
import bg from '../assests/greenbg.png';
import newgif from '../assests/he.gif';
import standinglion from '../assests/standinglion.gif';
import stop from '../assests/stop.png';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import pause from '../assests/pause.png';
import retry from '../assests/retry.png';
import click from '../assests/click.png';
import backbg from '../assests/backbg.png';
import contin from '../assests/continue.png';
import repeatCookie from '../assests/repeatshoe.mpeg';
import amazing from '../assests/amazingshoe.mpeg';
import sayagain from '../assests/sayagainshoe.mpeg';
import repeatshoeurdu from '../assests/repeatshoeurdu.ogg';
import amazshoeurdu from '../assests/amazshoeurdu.ogg';
import againshoe from '../assests/againshoeurdu.ogg';
import back from '../assests/back.png';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
//popup
import { TextField,} from '@mui/material';
import pegion from '../assests/pegion.png';
import gradient from '../assests/gradient.png';
import CloseIcon from '@mui/icons-material/Close';

//upload popup
export function UploadShoe() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fileInputRef = React.useRef(null);
  const [imageFile, setImageFile] = React.useState(null);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleAnotherClick = () => {
    setImageFile(null); // remove previous image
    localStorage.removeItem("uploadedShoe"); // clear old image
    fileInputRef.current.click(); // open file picker again
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Convert file to Base64 and store in localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("uploadedShoe", reader.result); // consistently use uploadedCookie
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    const savedImage = localStorage.getItem("uploadedShoe");
    if (savedImage) {
      navigate("/showShoe", { state: { uploadedImage: savedImage } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        pointerEvents: "auto",
      }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto`, position: "relative" }}>
        <Box
          component="img"
          src={pegion}
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "620px",
            height: "800px",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <Box
          component="img"
          src={gradient}
          sx={{
            width: "32%",
            height: "34%",
            position: "fixed",
            top: "63%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Upload Box */}
        <Box
          onClick={handleUploadClick}
          sx={{
            position: "fixed",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "25%",
            height: "18%",
            backgroundColor: "#783600",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3,
          }}
        >
          {imageFile ? (
            <Box component="img" src={URL.createObjectURL(imageFile)} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <Typography sx={{ color: "#c9742e", textAlign: "center", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq":"chewy", 
                     fontSize:{lg:i18n.language === "ur" ? "30px" : "20px",sm:i18n.language === "ur" ? "20px" :"20px"} }}>
              <FileUploadIcon sx={{ fontSize: 40 }} /><br />{t("upload")}
            </Typography>
          )}
        </Box>

        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

        {/* Continue / Another Buttons */}
        <Box
          sx={{
            position: "fixed",
            top: "80%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "25.9%",
            height: "5.5%",
            display: "flex",
            zIndex: 3,
          }}
        >
          {/* Continue Button */}
          <Box
            onClick={handleContinue}
            sx={{
              width: imageFile ? "50%" : "100%",
              height: "100%",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Box component="img" src={contin} sx={{ width: "100%", height: "100%",opacity:{lg:"1",sm:"0"}
,              marginTop:{lg:i18n.language === "ur" ? "-12%" :"-12%",sm:i18n.language === "ur" ? "-40%" :"-60%"}}} />
            <Typography sx={{
             position: "absolute",
              top: {lg:i18n.language === "ur" ? "-64%" :"-65%",sm:"-160%"},
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#482406",
              fontWeight: "900",
                fontSize: {lg:i18n.language === "ur" ? "27px" :"20px",sm:i18n.language === "ur" ? "24px" :"18px"},
              fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :"Chewy",
              pointerEvents: "none",
            }}>{t("Continue")}</Typography>
          </Box>

          {/* Another Button (only if image uploaded) */}
          {imageFile && (
            <Box
              onClick={handleAnotherClick}
              sx={{
                width: "50%",
                height: "100%",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Box component="img" src={contin} sx={{ width: "100%", height: "100%" , marginTop:{lg:i18n.language === "ur" ? "-12%" :"-12%",sm:"-45%"},opacity:{lg:"1",sm:"0%"}
}} />
              <Typography sx={{
                  position: "absolute",
        top: {lg:i18n.language === "ur" ? "-64%" :"-65%",sm:-60},
                left:{lg:0,sm:i18n.language === "ur" ? 0 :10},
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#482406",
                fontWeight: "900",
                fontSize: {lg:i18n.language === "ur" ? "27px" :"18px",sm:i18n.language === "ur" ? "17px" :"12px"},
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :"Chewy",
                pointerEvents: "none",
              }}>{t("another")}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
// Popup Component

function Verifyshoe({ closeModal, onVerified }) {
  const { t } = useTranslation();
  const [userAnswer, setUserAnswer] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
const handleSubmit = () => {
  if (userAnswer.trim() === "3") {  // must match exactly
    setFeedback("Correct!");
    onVerified();  // opens UploadShoe
  } else {
    setFeedback("Try again!");
  }
};

return(

 <Box
   sx={{
     cursor: `url(${click}) 22 22, auto`,
     position: "fixed",
     inset: 0,
     zIndex: 10000,
     pointerEvents: "auto",
   }}
 >
        {/* no global blur; blur only the form container */}

        {/* board background */}
        <Box
  component="img"
  src={pegion}
  sx={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { lg: "100%", sm: "100%" },
    maxWidth: "620px",
    height: "800px",
    zIndex: 1,
  }}
/>

          <Box 
            component="img" 
            sx={{ 
              width: "35%", 
              height: "74%", 
              marginLeft: "32%", 
              marginTop: {lg:"-82%",sm:"-180%"},
              position:"absolute",
              zIndex: 1,
            }} 
            src={pegion}
          />
          
          <Box 
            component="img" 
            sx={{ 
              width: "32%", 
              height: "34%", 
              marginLeft: "33.2%", 
              marginTop: {lg:"-67%",sm:"-148%"},
              position:"absolute",
              zIndex: 1,
            }} 
            src={gradient}
          />

          <Box sx={{
            position: "fixed",
            top: "64%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display:"flex",
            justifyContent:"flex-start",
            padding:"16px",
            flexDirection:"column",
            gap:"12px",
            width:{lg:"30%",sm:"70%"},
            zIndex: 10000,
            backgroundColor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            borderRadius: "10px",
            pointerEvents: "auto",
          }}>
            <Box sx={{
              display:"flex",
              justifyContent:"flex-start",
              marginTop: 0,
              padding:"2%",
              flexDirection:"row",
              alignItems: "center",
              gap: "12px"
            }}>
                       <Typography
                         sx={{
                           fontSize: {lg:i18n.language === "ur" ? "40px" : "40px",sm:i18n.language === "ur" ? "30px" :"21px"},
                           fontStyle:"normal",
                           lineHeight:"90%",
                           marginLeft:"-2%",
                           fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy',
                           letterSpacing:"1px",
                           color: "#5d2a00",
                           opacity:"0.9",
                         }}
                       >
                {t("adult")}
              </Typography>
              <CloseIcon onClick={closeModal} sx={{
                fontSize: {lg:40,sm:30},
                color: "#5d2a00",
                marginLeft: "auto"
              }} />
            </Box>

            <Box sx={{ display:"flex", flexDirection:"column", gap:"12px", marginTop:{lg:"6%",sm:"8%"} }}>
              <Typography
                sx={{
                  fontSize: {lg:i18n.language === "ur" ? "20px" : "20px",sm:i18n.language === "ur" ? "20px" :"16px"},
                  fontStyle:"normal",
                  lineHeight:"90%",
                  fontWeight:"800",
                  fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy',
                  letterSpacing:"1px",
                  color: "#883901",
                  opacity:"0.9",
                }}>
                {t("shoeQuestion")}
              </Typography>

              {/* Input Field */}
              <TextField
                variant="filled"
                InputProps={{ disableUnderline: true }}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                sx={{
                  width: { lg: "395px", sm: "260px" },
                  height: "51px",
                  color:"#824D1F",
                  backgroundColor: "#824D1F",
                  borderRadius: "7.98px",
                  opacity: 1,
                  mixBlendMode: "multiply",
                  '& input': {
                    color: '#c9742e',
                    padding: "10px 12px",
                    textAlign: "left",
                    fontFamily: "Chewy",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "24.67px",
                    lineHeight: "90%",
                    letterSpacing: "0%",
                  }
                }}
              />

              <Box
                onClick={handleSubmit}
                sx={{
                  width: "100%",
                  height: "52px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <Box component='img' src={contin} sx={{ width: "100%", height: "100%" }} />
                <Typography
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" :"chewy",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#482406",
                    fontWeight: "900",
                    fontSize: {lg:"30px",sm:"22px"},
                  }}
                >
                  {t("Continue")}
                </Typography>
              </Box>
            </Box>


            {feedback && (
              <Typography sx={{
                position:"absolute",
                marginTop:{lg:"36%",sm:"45%"},
                color: "black",
                fontSize:"18px",
                fontWeight:"bold",
              }}>
                {feedback}
              </Typography>
            )}

          </Box>
      </Box>
);
}

export default function Learnobjshoe() {
  const navigate = useNavigate();
  const {t}=useTranslation();
    const [showPopup, setShowPopup] = React.useState(false); // popup state
const [showUpload, setShowUpload] = React.useState(false);
const audio1Ref = useRef(null);
const audio2Ref = useRef(null);
const audio3Ref = useRef(null);
const recognitionRef = useRef(null);
const retryListenRef = useRef(null);
const autoAdvanceRef = useRef(false);
const playAndWait = (audio) => {
  return new Promise((resolve) => {
    if (!audio) {
      setIsLionSpeaking(false);
      resolve();
      return;
    }
    setIsLionSpeaking(true);
    audio.onended = () => {
      setIsLionSpeaking(false);
      resolve();
    };
    audio.play().catch(() => console.log("Autoplay blocked"));
  });
};

const wait = (ms) => new Promise(res => setTimeout(res, ms));
const [audioFinished, setAudioFinished] = useState(false);
const [speechVerified, setSpeechVerified] = useState(false);
const [speechStatus, setSpeechStatus] = useState("");
const [isLionSpeaking, setIsLionSpeaking] = useState(false);
const speechVerifiedRef = useRef(false);
const [speechStep, setSpeechStep] = useState(1);

useEffect(() => {
  localStorage.setItem("shoe_voice_tries", "0");
  localStorage.setItem("shoe_select_tries", "0");
  localStorage.setItem("shoe_select_done", "false");
}, []);

const incrementVoiceTries = () => {
  const current = parseInt(localStorage.getItem("shoe_voice_tries") || "0", 10);
  localStorage.setItem("shoe_voice_tries", String(current + 1));
};

const listenForShoe = () => {
  return new Promise((resolve, reject) => {
    const targetWord = i18n.language === "ur" ? "jootay" : "shoes";
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechStatus("Speech recognition not supported on this device.");
      reject(new Error("SpeechRecognition not supported"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;
    recognition.continuous = false;

    const startListening = () => {
      if (retryListenRef.current) {
        clearTimeout(retryListenRef.current);
        retryListenRef.current = null;
      }
      setSpeechVerified(false);
      setSpeechStatus(`Listening… say “${targetWord}”`);
      try {
        recognition.start();
      } catch (_) {
        // ignore
      }
    };

    recognition.onresult = (event) => {
      const transcripts = Array.from(event.results || []).flatMap((result) =>
        Array.from(result || []).map((item) => item.transcript.toLowerCase())
      );
      const transcript = transcripts[0] || "";
      const variants = [
        "shoe",
        "shoes",
        "sho",
        "show",
        "shoo",
        "shu",
        "joota",
        "jootay",
        "jootey",
        "joote",
        "jutay",
        "jutey",
        "joota",
        "jootae",
        "jotay",
        "jotey",
        "jootie",
        "juti",
        "jooti",
        "joota",
        "jootae",
        "jootai",
        "جوتا",
        "جوتے",
      ];
      const matches = transcripts.some((value) => {
        const normalized = value.replace(/[\s\-_.']/g, "");
        const words = value
          .split(/\s+/)
          .map((word) => word.replace(/[^a-z\u0600-\u06ff]/gi, "").toLowerCase())
          .filter(Boolean);

        if (variants.some((v) => normalized.includes(v) || words.includes(v))) {
          return true;
        }

        return words.some((word) => {
          if (word.length > 8) return false;
          if (/^sho/.test(word)) return true;
          if (/^shu/.test(word)) return true;
          if (/^joo/.test(word)) return true;
          if (/^jut/.test(word)) return true;
          if (/^جو/.test(word)) return true;
          return false;
        });
      });
      incrementVoiceTries();
      setSpeechStatus(`Heard: ${transcript}`);
      if (matches) {
        setSpeechVerified(true);
        speechVerifiedRef.current = true;
        setSpeechStatus(`Great! You said ${targetWord}.`);
        if (retryListenRef.current) {
          clearTimeout(retryListenRef.current);
          retryListenRef.current = null;
        }
        recognition.stop();
        resolve();
      } else {
        setSpeechVerified(false);
        speechVerifiedRef.current = false;
        setSpeechStatus(`Try again: say “${targetWord}”.`);
      }
    };

    recognition.onerror = () => {
      setSpeechStatus("Couldn't hear you. Try again.");
    };

    recognition.onend = () => {
      if (!speechVerifiedRef.current) {
        retryListenRef.current = setTimeout(startListening, 800);
      }
    };

    recognitionRef.current = recognition;
    startListening();
  });
};

useEffect(() => {
  return () => {
    if (retryListenRef.current) {
      clearTimeout(retryListenRef.current);
      retryListenRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
  };
}, []);

useEffect(() => {
  const playSequence = async () => {
    try {
      setAudioFinished(false);
      setSpeechVerified(false);
      setSpeechStatus("");
      setIsLionSpeaking(false);
      setSpeechStep(1);
      autoAdvanceRef.current = false;
      audio1Ref.current.pause();
      audio2Ref.current.pause();
      audio3Ref.current.pause();

      audio1Ref.current.currentTime = 0;
      audio2Ref.current.currentTime = 0;
      audio3Ref.current.currentTime = 0;

      audio1Ref.current.volume = 1;
      await playAndWait(audio1Ref.current);

      await wait(500);
      setSpeechStep(1);
      await listenForShoe();

      audio2Ref.current.volume = 1;
      await playAndWait(audio2Ref.current);

      await wait(500);
      setSpeechStep(2);
      await listenForShoe();

      audio3Ref.current.volume = 1;
      await playAndWait(audio3Ref.current);
      setIsLionSpeaking(false);
            setAudioFinished(true);
    } catch (e) {
      setIsLionSpeaking(false);
      console.log("Audio error", e);
    }
  };

  playSequence();
}, [i18n.language]);
  useEffect(() => {
    speechVerifiedRef.current = speechVerified;
  }, [speechVerified]);
  useEffect(() => {
    if (!audioFinished || autoAdvanceRef.current) return;
    autoAdvanceRef.current = true;
    const savedImage = localStorage.getItem("uploadedShoe");
    if (savedImage) {
      navigate("/showShoe");
    } else {
      navigate("/findshoe"); // agar image nahi hai to find page
    }
  }, [audioFinished, navigate]);
  
    React.useEffect(() => {
   if (showPopup || showUpload) {
       document.body.style.overflow = "hidden"; // disable scroll
     } else {
       document.body.style.overflow = "auto";   // enable scroll
     }
   }, [showPopup,showUpload]);
 <style>
{`
@keyframes zoomInOut {
  0%   { transform: scale(1); }
  50%  { transform: scale(2); }
  100% { transform: scale(1); }
}
`}
</style>
  return (
     <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Box
  sx={{
    filter:  (showPopup||showUpload)? "blur(5px)" : "none",
    transition: "filter 0.3s ease",
  }}
>
    <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
      <Box
        sx={{
          backgroundColor: "#0B3D2E",
          width: "100vw",
          height: "100vh",
          opacity: "0.9",
          position: "absolute",
          backgroundAttachment: "fixed",
          pointerEvents: "none"
        }}
      />
      <Box
        sx={{
          backgroundImage: `url(${learnbg})`,
          width: "100vw",
          minHeight: "100vh",
          height: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          position: "relative",
          backgroundPosition: "center"
        }}
      >
               <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "5%", paddingRight: "5%" }}>
          
                
        <Box sx={{ display: "flex", paddingLeft: "5%" }}>
          <Box
            onClick={() => navigate("/wonderworld")}
            component="img"
            sx={{
              width: { lg: "40%", md: "25%", sm: "40%", xs: "27%" },
              height:{lg:"auto",sm:"43%"},
              marginTop: { lg: "45px", md: "2%", sm: "50px", xs: "43%" },
              "&:hover": { transform: "scale(1.18)", boxShadow: "0 10px 25px rgba(0,0,0,0)" }
            }}
            src={backbg}
          />
           <Typography
                       onClick={() => navigate("/wonderworld")}
             sx={{
               fontSize: i18n.language === "ur" ? "35px" :"35px",
               marginTop: {lg:i18n.language === "ur" ? "3.8%" :"3%",sm:i18n.language === "ur" ? "3.8%" :"5%"},
               paddingTop:"14%",
               marginLeft: i18n.language === "ur" ? "-35.5%" :"-37.95%",
               fontStyle:"normal",
               lineHeight:"90%",
               fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy',
               letterSpacing:"1px",
               color:"rgba(255, 203, 143, 1)",
opacity:"0.9",
             }}>
            <KeyboardArrowLeftIcon  sx={{
    fontSize: 25,
    stroke: 'currentColor',
    strokeWidth: 0.5,
  }} />{t("back")}
              </Typography> 
        </Box>
        <Box sx={{ display: "flex", }}>
          <Box
    onClick={() => setShowPopup(true)}
                component='img'
            sx={{
              width: { lg: "68%", md: "25%", sm: "60%", xs: "40px" },height:"50px",
              marginTop: { lg: "45px", md: "30px", sm: "15%", xs: "205px" },
              marginLeft: "22%",
              "&:hover": { transform: "scale(1.08)", boxShadow: "0 10px 25px rgba(0,0,0,0)" },
              animation: audioFinished ? 'zoomInOut 1.2s infinite' : 'none',
    filter: audioFinished
      ? 'drop-shadow(0 0 18px rgba(255,200,120,0.9))'
      : 'none',
    transition: 'all 0.3s ease',
            }}
            src={backbg}
          />
          <Typography
    onClick={() => setShowPopup(true)}
                 sx={{
               fontSize: {lg:i18n.language === "ur" ? "35px" :"30px",
                sm:"25px"},
               marginTop: {lg:"15.7%",sm:"18%"},
               marginLeft: {lg:"-62.5%",sm:"-57%"},
               fontStyle:"normal",
               lineHeight:"90%",
               fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy',
               letterSpacing:"0.5px",
               color:"rgba(255, 203, 143, 1)",
opacity:"0.9",
             }}>{t("uploadpicture")}
                         <FileUploadIcon  sx={{
    fontSize: 25,
    stroke: 'currentColor',
    strokeWidth: 0.5,
  }} />
              </Typography> 
              </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                  <Box sx={{ display: "flex", flexDirection: "column", }}>
          <Box component='img'
               sx={{
                 width: { lg: "280px",sm:"260px" },
                 marginTop:{lg:i18n.language === "ur" ? "6%" : "5%",sm:i18n.language === "ur" ? "15%" : "10%"},
                 height: "143px",
                 marginLeft: {lg:"350px",sm:"20%"}
               }}
               src={bg} />
                  <Typography
             sx={{
               fontSize: i18n.language === "ur" ? "53px" : "33px",
               marginTop: {lg:i18n.language === "ur" ? "-6.8%" : "-7.5%",sm:i18n.language === "ur" ? "-14%" : "-15%"},
               width:{lg:i18n.language === "ur" ? "22%":"15%",sm:i18n.language === "ur" ? "42%" : "35%"},
               marginLeft: {lg:i18n.language === "ur" ? "24.8%" : "25%",sm:i18n.language === "ur" ? "22%" : "22%"},
               whiteSpace: i18n.language === "ur" ? "nowrap" : "normal",
               fontStyle:"normal",
               lineHeight:"38px",
               fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy',
               letterSpacing:"1px",
               color:"rgb(15, 21, 27,0.8)",
opacity:"0.9",
             }}>
             {t("repeatAfterMeShoes")}
              </Typography> 
              </Box>
          <Box component='img' sx={{ width: { lg: "400.59px",sm:"47%" }, height: {lg:"400.96px",sm:"52vh"}, marginTop: "-8px", marginLeft: {lg:"150px",sm:"-3%"}, borderRadius: "200.58px" }} src={isLionSpeaking ? newgif : standinglion} />
        </Box>

        <Box component='img' sx={{ width: {lg:"658.94px",sm:"60%"}, height: {lg:"481px",sm:"40%"}, borderRadius: "44.5px", marginLeft: {lg:"723px",sm:"40%"}, marginTop: {lg:"-40.5%",sm:"-69%"} }} src={board} />
        <Typography sx={{ width: "50%",fontSize: {lg:i18n.language === "ur" ? "65px" : "35px",
                sm:i18n.language === "ur" ? "40px" : "35px",},               
               marginLeft: {lg:i18n.language === "ur" ? "905px" : "880px",sm:i18n.language === "ur" ? "57%" : "48%"},
               marginTop:{lg:"-33.5%",sm:"-50%"},
               fontStyle:"normal",
               lineHeight:"38px",
               fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" : 'Chewy',
               letterSpacing:"1px",
               color:"rgba(130, 77, 31, 1)",
opacity:"0.9", }}>{t("sayShoes")}</Typography> 
        <Box component='img' sx={{ width: {lg:"518px",sm:"40%"}, height: {lg:"300px",sm:"22%"}, marginLeft: {lg:"780px",sm:"49%"}, marginTop: "1.8%" }} src={brown} />
        <Box component='img' sx={{ width:{lg:"200px",sm:"110px"}, height: {lg:"200px",sm:"100px"}, marginLeft: {lg:"800px",sm:"49%"}, marginTop: {lg:"-18%",sm:"-20%"} }} src={half} />
        <Box component='img' sx={{ width:{lg:"200px",sm:"120px"}, height: {lg:"200px",sm:"130px"}, marginLeft: {lg:"calc(62.5% + 50px)",sm:"61.5%"}, marginTop: {lg:"calc(-32% - 35px)",sm:"-38%"} }} src={full} />
        <Box component='img' sx={{ width:{lg:"200px",sm:"90px"}, height: {lg:"180px",sm:"90px"}, marginLeft: {lg:"calc(72% + 45px)",sm:"75%"}, marginTop: {lg:"calc(-20% - 10px)",sm:"-30%"} }} src={three} />
        <Box component='img' sx={{ width: {lg:"50px",sm:"30px"}, height: {lg:"50px",sm:"30px"}, marginLeft: {lg:"940px",sm:"60%"}, marginTop: {lg:"-12.5%",sm:"-24%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={stop} />
        <Box component='img' sx={{ width: {lg:"65px",sm:"40px"}, height: {lg:"65px",sm:"40px"}, marginLeft: {lg:"1007px",sm:"66%"}, marginTop: {lg:"-16%",sm:"-30%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={pause} />
        <Box component='img' sx={{ width: {lg:"50px",sm:"30px"}, height: {lg:"50px",sm:"30px"}, marginLeft: {lg:"1087px",sm:"73%"}, marginTop: {lg:"-18.9%",sm:"-36%"}, "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={retry} />
      </Box>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      bottom: { lg: "20px", sm: "10px" },
                      backgroundColor: "rgba(0,0,0,0.55)",
                      padding: "8px 14px",
                      borderRadius: "14px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { lg: "16px", sm: "14px" },
                        fontFamily: "Chewy",
                        color: speechVerified ? "#B9FFB3" : "#FFE1B3",
                      }}
                    >
                      {audioFinished
                        ? "Great job! ✅"
                        : speechVerified
                        ? "Verified: shoe ✅"
                        : `Say “shoe” to continue (${speechStep}/2)`}
                    </Typography>
                    {speechStatus && (
                      <Typography
                        sx={{
                          fontSize: { lg: "12px", sm: "11px" },
                          fontFamily: "Chewy",
                          color: "#fff",
                          opacity: 0.9,
                          marginTop: "4px",
                        }}
                      >
                        {speechStatus}
                      </Typography>
                    )}
                  </Box>
                  
<audio
  ref={audio1Ref}
  src={i18n.language === "ur" ? repeatshoeurdu : repeatCookie}
  preload="auto"
/>

<audio
  ref={audio2Ref}
  src={i18n.language === "ur" ? againshoe : sayagain}
  preload="auto"
/>

<audio
  ref={audio3Ref}
  src={i18n.language === "ur" ? amazshoeurdu : amazing}
  preload="auto"
/>    </Box>

     {/* POPUP */}
{showPopup && (
  <Verifyshoe
    closeModal={() => setShowPopup(false)}
    onVerified={() => {
      setShowPopup(false);
      setShowUpload(true);
    }}
  />
)}
{showUpload && <UploadShoe />}

    </motion.div>
  )
}
