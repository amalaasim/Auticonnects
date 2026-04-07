import * as React from 'react';
import { Box,Typography } from '@mui/material';
import { useEffect,useRef,useState } from 'react';
import learnbg from '../assests/learn_bg.png';
import board from '../assests/board.png';
import brown from '../assests/brown_board.png';
import full from '../assests/fullc.png';
import half from '../assests/halfc.png';
import three from '../assests/threec.png';
import bg from '../assests/greenbg.png';
import newgif from '../assests/talking.gif';
import standinglion from '../assests/standinglion-loop.gif';
import stop from '../assests/stop.png';
import pause from '../assests/pause.png';
import play from '../assests/play.png';
import retry from '../assests/retry.png';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import click from '../assests/click.png';
import contin from '../assests/continue.png';
import backbg from '../assests/backbg.png';
import back from '../assests/back.png';
import repeatCookie from '../assests/repeatcookie.mpeg';
import amazing from '../assests/amazing.mpeg';
import sayagain from '../assests/sayagaincookie.mpeg';
import noSound from '../assests/no.mpeg';
import noUrduSound from '../assests/nourdu.mpeg';
import repeatCookieurdu from '../assests/repeatcookieurdu.mp4';
import amazbiscuiturdu from '../assests/finalurdu.mp4';
import againcookie from '../assests/againbiscuiturdu.mp4';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { startSession } from "@/lib/analytics/client";
import { ensureWonderworldSessionState } from "@/lib/analytics/sessionState";
import { GAME_IMAGE_CONFIG, getCachedGameImage, loadSavedGameImage, saveGameImage } from "@/lib/gameImageStore";
import { listenForWonderworldWord, stopWonderworldListening } from "@/lib/wonderworldSpeech";
import { preloadImageAsset } from "@/lib/preloadImageAsset";
//popup
import { TextField,} from '@mui/material';
import pegion from '../assests/pegion.png';
import gradient from '../assests/gradient.png';
import CloseIcon from '@mui/icons-material/Close';
//upload popup
export function UploadShoe({ onClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fileInputRef = React.useRef(null);
  const [previewImage, setPreviewImage] = React.useState(() => getCachedGameImage("cookie"));
  const [pendingImage, setPendingImage] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    let ignore = false;

    const hydrateSavedImage = async () => {
      try {
        const savedImage = await loadSavedGameImage("cookie");
        if (!ignore && savedImage) {
          setPreviewImage(savedImage);
        }
      } catch (error) {
        console.error("Failed to load cookie image:", error);
      }
    };

    hydrateSavedImage();

    return () => {
      ignore = true;
    };
  }, []);

  const handleUploadClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleAnotherClick = () => {
    setPendingImage(null);
    handleUploadClick();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result !== "string") return;
        setPendingImage(reader.result);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    const imageToUse = pendingImage || previewImage;
    if (!imageToUse || isSaving) return;

    try {
      setIsSaving(true);
      if (pendingImage) {
        await saveGameImage("cookie", pendingImage);
      }
      navigate(GAME_IMAGE_CONFIG.cookie.route, { state: { uploadedImage: imageToUse } });
    } catch (error) {
      console.error("Failed to save cookie image:", error);
    } finally {
      setIsSaving(false);
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
        <CloseIcon
          onClick={onClose}
          sx={{
            position: "fixed",
            top: "calc(50% - 290px)",
            left: "calc(50% + 250px)",
            transform: "translate(-50%, -50%)",
            fontSize: { lg: 42, sm: 32 },
            color: "#5d2a00",
            zIndex: 4,
            cursor: "pointer",
          }}
        />
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
          {previewImage ? (
            <Box component="img" src={previewImage} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
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
              width: previewImage ? "50%" : "100%",
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
          {previewImage && (
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


function Learnobj() {
  const navigate = useNavigate();
  const { t } = useTranslation();
    
const audio1Ref = useRef(null);
const audio2Ref = useRef(null);
const audio3Ref = useRef(null);
const recognitionRef = useRef(null);
const retryListenRef = useRef(null);
const autoAdvanceRef = useRef(false);
const startListeningRef = useRef(null);
const currentAudioRef = useRef(null);
const allowListeningRef = useRef(true);
const isPausedRef = useRef(false);
const sequenceCancelRef = useRef(false);
const cancelListenRef = useRef(false);

const playAndWait = (audio) => {
  return new Promise((resolve) => {
    if (!audio || sequenceCancelRef.current) {
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
const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
  preloadImageAsset(newgif);
  preloadImageAsset(standinglion);
}, []);
const speechVerifiedRef = useRef(false);
const [speechStep, setSpeechStep] = useState(1);

useEffect(() => {
  localStorage.setItem("cookie_voice_tries", "0");
  localStorage.setItem("cookie_select_tries", "0");
  localStorage.setItem("cookie_select_done", "false");
}, []);

useEffect(() => {
  let ignore = false;

  const ensureSession = async () => {
    if (window.sessionStorage.getItem("analytics:wonderworld:cookie")) return;

    try {
      const sessionId = await startSession({
        gameKey: "wonderworld",
        moduleKey: "cookie",
        sourceApp: "main-app",
        language: i18n.language,
      });

      if (!ignore) {
        ensureWonderworldSessionState("cookie", sessionId, i18n.language);
      }
    } catch (error) {
      console.error("Failed to start cookie analytics session:", error);
    }
  };

  ensureSession();

  return () => {
    ignore = true;
  };
}, []);

const incrementVoiceTries = () => {
  const current = parseInt(localStorage.getItem("cookie_voice_tries") || "0", 10);
  localStorage.setItem("cookie_voice_tries", String(current + 1));
};

const playMistakeSound = () => {
  const audio = new Audio(i18n.language === "ur" ? noUrduSound : noSound);
  setIsLionSpeaking(true);
  audio.onended = () => setIsLionSpeaking(false);
  audio.onpause = () => setIsLionSpeaking(false);
  audio.play().catch(() => {});
};

const listenForCookie = () => {
  return listenForWonderworldWord({
    moduleKey: "cookie",
    language: i18n.language,
    recognitionRef,
    retryListenRef,
    speechVerifiedRef,
    cancelListenRef,
    allowListeningRef,
    startListeningRef,
    setSpeechVerified,
    setSpeechStatus,
    incrementVoiceTries,
    onMistake: playMistakeSound,
  });
};

useEffect(() => {
  return () => {
    if (retryListenRef.current) {
      clearTimeout(retryListenRef.current);
      retryListenRef.current = null;
    }
    stopWonderworldListening({
      recognitionRef,
      retryListenRef,
      cancelListenRef,
      allowListeningRef,
    });
  };
}, []);

const playSequence = async () => {
  try {
    sequenceCancelRef.current = false;
    isPausedRef.current = false;
    allowListeningRef.current = true;
    setAudioFinished(false);
    setSpeechVerified(false);
    setSpeechStatus("");
    setIsLionSpeaking(false);
    setIsPaused(false);
    setSpeechStep(1);
    autoAdvanceRef.current = false;
    audio1Ref.current.pause();
    audio2Ref.current.pause();
    audio3Ref.current.pause();

    audio1Ref.current.currentTime = 0;
    audio2Ref.current.currentTime = 0;
    audio3Ref.current.currentTime = 0;

    currentAudioRef.current = audio1Ref.current;
    audio1Ref.current.volume = 1;
    await playAndWait(audio1Ref.current);
    if (sequenceCancelRef.current) return;

    await wait(500);
    setSpeechStep(1);
    await listenForCookie();
    if (sequenceCancelRef.current) return;

    currentAudioRef.current = audio2Ref.current;
    audio2Ref.current.volume = 1;
    await playAndWait(audio2Ref.current);
    if (sequenceCancelRef.current) return;

    await wait(500);
    setSpeechStep(2);
    await listenForCookie();
    if (sequenceCancelRef.current) return;

    currentAudioRef.current = audio3Ref.current;
    audio3Ref.current.volume = 1;
    await playAndWait(audio3Ref.current);
    if (sequenceCancelRef.current) return;

    currentAudioRef.current = null;
    setIsLionSpeaking(false);
    setAudioFinished(true);
  } catch (e) {
    setIsLionSpeaking(false);
    console.log("Audio error", e);
  }
};

useEffect(() => {
  playSequence();
}, [i18n.language]);

useEffect(() => {
  speechVerifiedRef.current = speechVerified;
}, [speechVerified]);

useEffect(() => {
  if (!audioFinished || autoAdvanceRef.current) return;
  autoAdvanceRef.current = true;
  navigate("/find");
}, [audioFinished, navigate]);

const handlePauseResume = () => {
  if (!isPausedRef.current) {
    isPausedRef.current = true;
    setIsPaused(true);
    allowListeningRef.current = false;
    if (retryListenRef.current) {
      clearTimeout(retryListenRef.current);
      retryListenRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    setIsLionSpeaking(false);
    setSpeechStatus("Paused");
  } else {
    isPausedRef.current = false;
    setIsPaused(false);
    allowListeningRef.current = true;
    if (currentAudioRef.current && currentAudioRef.current.paused) {
      setIsLionSpeaking(true);
      currentAudioRef.current.play().catch(() => {});
    } else if (startListeningRef.current) {
      try {
        startListeningRef.current();
      } catch (_) {}
    }
    setSpeechStatus("");
  }
};

const handleStop = () => {
  sequenceCancelRef.current = true;
  isPausedRef.current = false;
  setIsPaused(false);
  allowListeningRef.current = false;
  cancelListenRef.current = true;
  if (retryListenRef.current) {
    clearTimeout(retryListenRef.current);
    retryListenRef.current = null;
  }
  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
    } catch (_) {}
  }
  [audio1Ref.current, audio2Ref.current, audio3Ref.current].forEach((a) => {
    if (!a) return;
    try {
      a.pause();
      a.currentTime = 0;
      if (typeof a.onended === "function") a.onended();
    } catch (_) {}
  });
  currentAudioRef.current = null;
  setSpeechVerified(false);
  setSpeechStatus("Stopped");
  setIsLionSpeaking(false);
  setAudioFinished(false);
};

const handleRestart = () => {
  handleStop();
  setTimeout(() => {
    playSequence();
  }, 0);
};

  <style>
{`
@keyframes zoomInOut {
  0%   { transform: scale(1); }
  50%  { transform: scale(2); }
  100% { transform: scale(1); }
}
`}
</style>




        const [showPopup, setShowPopup] = React.useState(false); // popup state
    const [showUpload, setShowUpload] = React.useState(false);
     React.useEffect(() => {
   if (showPopup || showUpload) {
     document.body.style.overflow = "hidden"; // disable scroll
   } else {
     document.body.style.overflow = "auto";   // enable scroll
   }
 }, [showPopup,showUpload]);
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
          <Box
      sx={{
        filter: (showPopup || showUpload) ? "blur(5px)" : "none",
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
    transition: 'all 0.3s ease',}}
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
                          <Box sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
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
               marginTop: {lg:i18n.language === "ur" ? "0" : "-8.0%",sm:i18n.language === "ur" ? "0" : "-15.5%"},
               width:{lg:"20%",sm:"35%"},
               marginLeft: {lg:i18n.language === "ur" ? "0" : "26%",sm:i18n.language === "ur" ? "0" : "23%"},
               position: i18n.language === "ur" ? "absolute" : "relative",
               top: {lg:i18n.language === "ur" ? "136px" : "auto",sm:i18n.language === "ur" ? "174px" : "auto"},
               left: {lg:i18n.language === "ur" ? "358px" : "auto",sm:i18n.language === "ur" ? "116px" : "auto"},
               fontStyle:"normal",
               lineHeight:"38px",
               fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" :'Chewy',
               letterSpacing:"1px",
               transform: "none",
               color:"rgb(15, 21, 27,0.8)",
opacity:"0.9",
             }}>
             {t("repeatAfterMe")}
              </Typography> 
              </Box>
          <Box component='img' loading="eager" decoding="async" sx={{ width: { lg: "451.59px",sm:"44%" }, height: {lg:"390.96px",sm:"52vh"}, marginTop: "-8px", marginLeft: {lg:"150px",sm:"-3%"}, borderRadius: "200.58px", objectFit: "contain", transform: isLionSpeaking ? "none" : "translateY(18px) scale(1.05, 1.02)", transformOrigin: "center" }} src={isLionSpeaking ? newgif : standinglion} />
        </Box>

        <Box component='img' sx={{ width: {lg:"658.94px",sm:"60%"}, height: {lg:"481px",sm:"40%"}, borderRadius: "44.5px", marginLeft: {lg:"723px",sm:"40%"}, marginTop: {lg:"-40%",sm:"-69%"} }} src={board} />
        <Typography sx={{ width: "50%",fontSize: {lg:i18n.language === "ur" ? "65px" : "35px",
                sm:i18n.language === "ur" ? "40px" : "35px",},               
               marginLeft: {lg:i18n.language === "ur" ? "905px" : "880px",sm:i18n.language === "ur" ? "57%" : "48%"},
               marginTop:{lg:"-33.5%",sm:"-50%"},
               fontStyle:"normal",
               lineHeight:"38px",
               fontFamily:i18n.language === "ur" ? "JameelNooriNastaleeq" : 'Chewy',
               letterSpacing:"1px",
               color:"rgba(130, 77, 31, 1)",
opacity:"0.9", }}>{t("learnToSay")}</Typography> 
        <Box component='img' sx={{ width: {lg:"518px",sm:"40%"}, height: {lg:"300px",sm:"22%"}, marginLeft: {lg:"780px",sm:"49%"}, marginTop: "1.8%" }} src={brown} />
        <Box component='img' sx={{ width:{lg:"220px",sm:"110px"}, height: "auto", objectFit: "contain", marginLeft: {lg:"796px",sm:"52%"}, marginTop: {lg:"-18%",sm:"-20%"} }} src={half} />
        <Box component='img' sx={{ width:{lg:"150px",sm:"70px"}, height: {lg:"150px",sm:"80px"}, marginLeft: {lg:"67%",sm:"67%"}, marginTop: {lg:"-32%",sm:"-38%"} }} src={full} />
        <Box component='img' sx={{ width:{lg:"200px",sm:"100px"}, height: {lg:"200px",sm:"100px"}, marginLeft: {lg:"75%",sm:"77%"}, marginTop: {lg:"-20%",sm:"-30%"} }} src={three} />
        <Box component='img' onClick={handleStop} sx={{ width: {lg:"50px",sm:"30px"}, height: {lg:"50px",sm:"30px"}, marginLeft: {lg:"940px",sm:"60%"}, marginTop: {lg:"-12.5%",sm:"-24%"}, cursor: "pointer", position: "relative", zIndex: 10, pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={stop} />
        <Box component='img' onClick={handlePauseResume} sx={{ width: {lg:"65px",sm:"40px"}, height: {lg:"65px",sm:"40px"}, marginLeft: {lg:"1007px",sm:"66%"}, marginTop: {lg:"-16%",sm:"-30%"}, cursor: "pointer", position: "relative", zIndex: 10, pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={isPaused ? play : pause} />
        <Box component='img' onClick={handleRestart} sx={{ width: {lg:"50px",sm:"30px"}, height: {lg:"50px",sm:"30px"}, marginLeft: {lg:"1087px",sm:"73%"}, marginTop: {lg:"-18.9%",sm:"-36%"}, cursor: "pointer", position: "relative", zIndex: 10, pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={retry} />
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
                        ? "Verified: cookie ✅"
                        : i18n.language === "ur"
                          ? `آگے جانے کے لیے بسکٹ بولیں (${speechStep}/2)`
                          : `Say “cookie” to continue (${speechStep}/2)`}
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
  src={i18n.language === "ur" ? repeatCookieurdu : repeatCookie}
  preload="auto"
/>

<audio
  ref={audio2Ref}
  src={i18n.language === "ur" ? againcookie : sayagain}
  preload="auto"
/>

<audio
  ref={audio3Ref}
  src={i18n.language === "ur" ? amazbiscuiturdu : amazing}
  preload="auto"
/>


    </Box>
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
    {showUpload && <UploadShoe onClose={() => setShowUpload(false)} />}
    </motion.div>
  )
}

export default Learnobj;
