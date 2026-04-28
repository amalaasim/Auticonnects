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
import newgif from '../assests/talking.gif';
import standinglion from '../assests/standinglion-loop.gif';
import stop from '../assests/stop.png';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import pause from '../assests/pause.png';
import play from '../assests/play.png';
import retry from '../assests/retry.png';
import click from '../assests/click.png';
import backbg from '../assests/backbg.png';
import contin from '../assests/continue.png';
import repeatCookie from '../assests/repeatshoe.mpeg';
import amazing from '../assests/amazing.mpeg';
import sayagain from '../assests/sayagainshoe.mpeg';
import noSound from '../assests/no.mpeg';
import noUrduSound from '../assests/nourdu.mpeg';
import repeatshoeurdu from '../assests/repeatshoeurdu.ogg';
import amazshoeurdu from '../assests/finalurdu.mp4';
import againshoe from '../assests/againshoeurdu.ogg';
import back from '../assests/back.png';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { startSession } from "@/lib/analytics/client";
import { ensureWonderworldSessionState } from "@/lib/analytics/sessionState";
import { GAME_IMAGE_CONFIG, getCachedGameImage, loadSavedGameImage, saveGameImage } from "@/lib/gameImageStore";
import { cleanupWonderworldListening, listenForWonderworldWord } from "@/lib/wonderworldSpeech";
import { preloadImageAsset } from "@/lib/preloadImageAsset";
import { useToast } from "@/hooks/use-toast";
import { useFavoriteCharacter } from "@/hooks/useFavoriteCharacter";
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
  const [previewImage, setPreviewImage] = React.useState(() => getCachedGameImage("shoe"));
  const [pendingImage, setPendingImage] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    let ignore = false;

    const hydrateSavedImage = async () => {
      try {
        const savedImage = await loadSavedGameImage("shoe");
        if (!ignore && savedImage) {
          setPreviewImage(savedImage);
        }
      } catch (error) {
        console.error("Failed to load shoe image:", error);
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
        await saveGameImage("shoe", pendingImage);
      }
      navigate(GAME_IMAGE_CONFIG.shoe.route, { state: { uploadedImage: imageToUse } });
    } catch (error) {
      console.error("Failed to save shoe image:", error);
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
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        pointerEvents: "auto",
      }}
    >
      <Box
        onClick={(event) => event.stopPropagation()}
        sx={{
          cursor: `url(${click}) 122 122, auto`,
          position: "fixed",
          top: "50dvh",
          left: "50vw",
          transform: "translate(-50%, -50%)",
          width: "min(832px, 95vw, calc(95dvh * 832 / 999))",
          aspectRatio: "832 / 999",
        }}
      >
        <CloseIcon onClick={onClose} sx={{ position: "absolute", top: "8%", right: "16%", fontSize: { lg: 42, sm: 32 }, color: "#5d2a00", zIndex: 4, cursor: "pointer" }} />
        <Box component="img" src={pegion} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 1, pointerEvents: "none" }} />
        <Box component="img" src={gradient} sx={{ position: "absolute", top: "44.4%", left: "50%", width: "86.8%", height: "42.6%", transform: "translateX(-50%)", zIndex: 2, pointerEvents: "none" }} />

        <Box sx={{ position: "absolute", top: "63%", left: "50%", transform: "translate(-50%, -50%)", width: "69.4%", height: "23%", background: "#824D1F", mixBlendMode: "multiply", boxShadow: "0px -1.09611px 4.38444px #FFCB8F, inset 0px 4.38444px 4.38444px rgba(0, 0, 0, 0.25)", borderRadius: "7.98462px", pointerEvents: "none", zIndex: 3 }} />

        <Box onClick={handleUploadClick} sx={{ position: "absolute", top: "63%", left: "50%", transform: "translate(-50%, -50%)", width: "69.4%", height: "23%", borderRadius: "7.98462px", cursor: "pointer", containerType: "size", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 4 }}>
          {previewImage ? (
            <Box component="img" src={previewImage} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <Typography sx={{ color: "#c9742e", textAlign: "center", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "chewy", fontSize: "max(4.1cqw, 12.4cqh)", lineHeight: "1.05", maxWidth: "88%", overflowWrap: "break-word" }}>
              <FileUploadIcon sx={{ fontSize: "max(7.2cqw, 21cqh)" }} /><br />{t("upload")}
            </Typography>
          )}
        </Box>

        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

        <Box sx={{ position: "absolute", top: "79%", left: "50%", transform: "translate(-50%, -50%)", width: "69.4%", height: "52px", containerType: "size", display: "flex", zIndex: 4 }}>
          <Box onClick={handleContinue} sx={{ width: previewImage ? "50%" : "100%", height: "100%", cursor: "pointer", position: "relative" }}>
            <Box component="img" src={contin} sx={{ width: "100%", height: "100%" }} />
            <Typography sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#482406", fontWeight: "900", fontSize: previewImage ? "max(3cqw, 16px)" : "max(3.8cqw, 22px)", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy", pointerEvents: "none" }}>{t("Continue")}</Typography>
          </Box>

          {previewImage && (
            <Box onClick={handleAnotherClick} sx={{ width: "50%", height: "100%", cursor: "pointer", position: "relative" }}>
              <Box component="img" src={contin} sx={{ width: "100%", height: "100%" }} />
              <Typography sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#482406", fontWeight: "900", fontSize: "max(3cqw, 16px)", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy", pointerEvents: "none" }}>{t("another")}</Typography>
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
  const { toast } = useToast();
  const [userAnswer, setUserAnswer] = React.useState("");
  const handleSubmit = () => {
    if (userAnswer.trim() === "3") {
      onVerified();
    } else {
      toast({
        variant: "destructive",
        title: "Try again!",
      });
    }
  };

  return (
    <Box
      sx={{
        cursor: `url(${click}) 22 22, auto`,
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        pointerEvents: "auto",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: "50dvh",
          left: "50vw",
          transform: "translate(-50%, -50%)",
          width: "min(832px, 95vw, calc(95dvh * 832 / 999))",
          aspectRatio: "832 / 999",
        }}
      >
        <Box
          component="img"
          src={pegion}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "46.4%",
            left: "50%",
            width: "80.8%",
            height: "38.6%",
            transform: "translateX(-50%)",
            background: "rgba(186, 118, 43, 0.91)",
            filter: "blur(11.2px)",
            zIndex: 1,
            pointerEvents: "none",
            overflow: "hidden",
            borderRadius: "18px",
          }}
        />

        <Box sx={{
          position: "absolute",
          top: "46.7%",
          left: "10.9%",
          containerType: "size",
          display: "flex",
          justifyContent: "flex-start",
          padding: "29px 22px 18px",
          flexDirection: "column",
          gap: "6cqh",
          width: "78.2%",
          height: "32.9%",
          zIndex: 3,
          pointerEvents: "auto",
          overflow: "visible",
        }}>
          <Typography
            sx={{
              width: "calc(100% - 74px)",
              zIndex: 3,
              fontSize: "max(8.6cqw, 16cqh)",
              fontWeight: 400,
              fontStyle: "normal",
              lineHeight: "90%",
              fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
              letterSpacing: "0px",
              color: "#572e0b",
              textShadow: "none",
            }}
          >
            {t("adult")}
          </Typography>

          <CloseIcon
            onClick={closeModal}
            sx={{
              position: "absolute",
              top: "28px",
              right: "28px",
              zIndex: 3,
              fontSize: { lg: 40, sm: 30 },
              color: "#5d2a00",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "3.8cqh", width: "100%" }}>
            <Typography
              sx={{
                fontSize: "max(4.4cqw, 8.6cqh)",
                fontStyle: "normal",
                lineHeight: "90%",
                fontWeight: "800",
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                letterSpacing: "1px",
                color: "#883901",
                opacity: "0.9",
              }}>
              {t("shoeQuestion")}
            </Typography>

            <TextField
              variant="filled"
              InputProps={{ disableUnderline: true }}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              sx={{
                width: "100%",
                height: "51px",
                "@media (min-width: 1200px) and (max-width: 1400px) and (min-height: 900px)": {
                  height: "64px",
                },
                color: "#824D1F",
                backgroundColor: "#824D1F",
                borderRadius: "7.98px",
                opacity: 1,
                mixBlendMode: "multiply",
                "& input": {
                  color: "#c9742e",
                  padding: "10px 12px",
                  textAlign: "left",
                  fontFamily: "Chewy",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "max(5.2cqw, 10.2cqh)",
                  lineHeight: "90%",
                  letterSpacing: "0%",
                },
              }}
            />

            <Box
              onClick={handleSubmit}
              sx={{
                width: "100%",
                height: "52px",
                "@media (min-width: 1200px) and (max-width: 1400px) and (min-height: 900px)": {
                  height: "65px",
                },
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Box component="img" src={contin} sx={{ width: "100%", height: "100%" }} />
              <Typography
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "chewy",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#482406",
                  fontWeight: "900",
                  fontSize: "max(5.7cqw, 11.2cqh)",
                }}
              >
                {t("Continue")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default function Learnobjshoe() {
  const navigate = useNavigate();
  const {t}=useTranslation();
  const favoriteCharacter = useFavoriteCharacter();
  const bubblesLearnBg = "/assets/Bubbles/bubbles_bg_unified.png";
  const bubblesTalkingGif = "/assets/Bubbles/talking.gif";
  const bubblesStandingGif = "/assets/Bubbles/standing-loop.gif";
  const mimmiLearnBg = "/assets/Mimmi/mimmi_bg_unified_extended.png";
  const mimmiTalkingGif = "/assets/Mimmi/talking_mimmi.gif";
  const mimmiStandingGif = "/assets/Mimmi/standing_mimmi.gif";
    const [showPopup, setShowPopup] = React.useState(false); // popup state
const [showUpload, setShowUpload] = React.useState(false);
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
    setIsLionSpeaking(false);
    audio.onplaying = () => {
      if (currentAudioRef.current === audio) {
        setIsLionSpeaking(true);
      }
    };
    audio.onended = () => {
      setIsLionSpeaking(false);
      resolve();
    };
    audio.play().catch(() => {
      setIsLionSpeaking(false);
      resolve();
      console.log("Autoplay blocked");
    });
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
  preloadImageAsset(bubblesTalkingGif);
  preloadImageAsset(bubblesStandingGif);
  preloadImageAsset(bubblesLearnBg);
  preloadImageAsset(mimmiTalkingGif);
  preloadImageAsset(mimmiStandingGif);
  preloadImageAsset(mimmiLearnBg);
}, [bubblesLearnBg, bubblesStandingGif, bubblesTalkingGif, mimmiLearnBg, mimmiStandingGif, mimmiTalkingGif]);
const speechVerifiedRef = useRef(false);
const [speechStep, setSpeechStep] = useState(1);

useEffect(() => {
  localStorage.setItem("shoe_voice_tries", "0");
  localStorage.setItem("shoe_select_tries", "0");
  localStorage.setItem("shoe_select_done", "false");
}, []);

useEffect(() => {
  let ignore = false;

  const ensureSession = async () => {
    if (window.sessionStorage.getItem("analytics:wonderworld:shoe")) return;

    try {
      const sessionId = await startSession({
        gameKey: "wonderworld",
        moduleKey: "shoe",
        sourceApp: "main-app",
        language: i18n.language,
      });

      if (!ignore) {
        ensureWonderworldSessionState("shoe", sessionId, i18n.language);
      }
    } catch (error) {
      console.error("Failed to start shoe analytics session:", error);
    }
  };

  ensureSession();

  return () => {
    ignore = true;
  };
}, []);

const incrementVoiceTries = () => {
  const current = parseInt(localStorage.getItem("shoe_voice_tries") || "0", 10);
  localStorage.setItem("shoe_voice_tries", String(current + 1));
};

const listenForShoe = () => {
const playMistakeSound = () => {
    const audio = new Audio(i18n.language === "ur" ? noUrduSound : noSound);
    setIsLionSpeaking(false);
    audio.onplaying = () => setIsLionSpeaking(true);
    audio.onended = () => setIsLionSpeaking(false);
    audio.onpause = () => setIsLionSpeaking(false);
    audio.play().catch(() => {});
  };

  return listenForWonderworldWord({
    moduleKey: "shoe",
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
    cleanupWonderworldListening({
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
      await listenForShoe();
      if (sequenceCancelRef.current) return;

      currentAudioRef.current = audio2Ref.current;
      audio2Ref.current.volume = 1;
      await playAndWait(audio2Ref.current);
      if (sequenceCancelRef.current) return;

      await wait(500);
      setSpeechStep(2);
      await listenForShoe();
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
    navigate("/findshoe");
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
        height: "100dvh",
        minHeight: "100dvh",
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
              height: "100dvh",
              opacity: "0.9",
              position: "absolute",
              backgroundAttachment: "fixed",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              backgroundImage: `url(${favoriteCharacter === "bubbles" ? bubblesLearnBg : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? mimmiLearnBg : learnbg})`,
              width: "100vw",
              height: "100dvh",
              minHeight: "100dvh",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
              position: "relative",
              backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 10cqh)" : "bottom center",
              overflow: "hidden",
              containerType: "size",
              "@media (min-width: 1200px) and (min-aspect-ratio: 3/2)": {
                backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 12cqh)" : "bottom center",
              },
              "@media (min-width: 1000px) and (max-width: 1100px) and (min-height: 1300px)": {
                backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 9cqh)" : "bottom center",
              },
              "@media (min-width: 1300px) and (max-width: 1400px) and (max-aspect-ratio: 1.4)": {
                backgroundPosition: favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "center calc(100% + 9cqh)" : "bottom center",
              },
            }}
          >
            <Box
              onClick={() => navigate("/wonderworld")}
              sx={{
                position: "absolute",
                top: "5cqh",
                left: "5cqw",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.08)", transition: "0.2s" },
              }}
            >
              <Box component="img" src={backbg} sx={{ width: "max(8cqw, 12cqh)", height: "max(5.5cqh, 3.5cqw)" }} />
              <Typography
                sx={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  fontSize: "max(1.8cqw, 2.7cqh)",
                  fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                  color: "#FFCB8F",
                  letterSpacing: "1px",
                  lineHeight: "1",
                  marginTop: "-2%",
                }}
              >
                <KeyboardArrowLeftIcon sx={{ fontSize: "max(2cqw, 3cqh)", mr: 0.5, stroke: "currentColor", strokeWidth: 0.5 }} />
                {t("back")}
              </Typography>
            </Box>

            <Box
              onClick={() => setShowPopup(true)}
              sx={{
                position: "absolute",
                top: "5cqh",
                right: "5cqw",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": { transform: "scale(1.08)" },
                animation: audioFinished ? "zoomInOut 1.2s infinite" : "none",
                filter: audioFinished ? "drop-shadow(0 0 18px rgba(255,200,120,0.9))" : "none",
                transition: "all 0.3s ease",
              }}
            >
              <Box component="img" src={backbg} sx={{ width: "max(14cqw, 21cqh)", height: "max(5.5cqh, 3.5cqw)" }} />
              <Typography
                sx={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  fontSize: "max(1.6cqw, 2.4cqh)",
                  fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                  color: "#FFCB8F",
                  letterSpacing: "0.5px",
                  lineHeight: "1",
                  marginTop: "-2%",
                }}
              >
                {t("uploadpicture")}
                <FileUploadIcon sx={{ fontSize: "max(1.8cqw, 2.7cqh)", ml: 0.5, stroke: "currentColor", strokeWidth: 0.5 }} />
              </Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "9cqh" : "16cqh",
                left: "3cqw",
                width: favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "max(32cqw, 48cqh)" : "max(26cqw, 39cqh)",
                zIndex: 5,
                "@media (max-aspect-ratio: 1.55)": {
                  left: "-1cqw",
                },
                "@media (min-aspect-ratio: 1.55)": {
                  bottom: favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "11cqh" : "16cqh",
                },
                "@media (min-width: 1000px) and (max-width: 1160px) and (max-height: 780px)": {
                  bottom: favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "10cqh" : "16cqh",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "max(20cqw, 30cqh)",
                  height: "auto",
                  bottom: "88%",
                  left: "50%",
                  zIndex: 6,
                  "@media (max-aspect-ratio: 4/3)": {
                    width: "22cqw",
                    left: "40%",
                  },
                }}
              >
                <Box component="img" sx={{ width: "100%", height: "auto", display: "block", filter: favoriteCharacter === "bubbles" ? "hue-rotate(145deg) saturate(1.35) brightness(1.08)" : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "hue-rotate(65deg) saturate(1.18) brightness(1.05)" : "none" }} src={bg} />
                <Typography
                  sx={{
                    fontSize: i18n.language === "ur" ? "max(3.2cqw, 4.8cqh)" : "max(2.2cqw, 3.3cqh)",
                    position: "absolute",
                    top: "55%",
                    left: "52%",
                    transform: "translate(-50%, -70%)",
                    width: "75%",
                    textAlign: "left",
                    fontStyle: "normal",
                    lineHeight: "1.6",
                    fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                    letterSpacing: "1px",
                    color: "#fff",
                    opacity: "0.9",
                  }}
                >
                  {i18n.language === "ur" ? t("repeatAfterMeShoes") : 'Repeat after me "shoes"'}
                </Typography>
              </Box>
              <Box sx={{ position: "relative", width: "100%" }}>
                {!isLionSpeaking && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "39.5%",
                      left: "30.5%",
                      width: "39%",
                      height: "12.5%",
                      backgroundColor: "#000",
                      borderRadius: "999px",
                      opacity: 1,
                      zIndex: 0,
                      pointerEvents: "none",
                    }}
                  />
                )}
                <Box
                  component="img"
                  loading="eager"
                  decoding="async"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    position: "relative",
                    zIndex: 1,
                    transform: isLionSpeaking
                      ? (favoriteCharacter === "bubbles" || favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? "translateY(2cqh) scaleX(1.03)" : "scaleX(1.03)")
                      : "translateY(2cqh) scale(1.05, 1.02)",
                    transformOrigin: "center",
                  }}
                  src={favoriteCharacter === "bubbles" ? (isLionSpeaking ? bubblesTalkingGif : bubblesStandingGif) : favoriteCharacter === "mimmi" || favoriteCharacter === "mimi" ? (isLionSpeaking ? mimmiTalkingGif : mimmiStandingGif) : (isLionSpeaking ? newgif : standinglion)}
                />
              </Box>
            </Box>

            <Box
              sx={{
                position: "absolute",
                right: "2cqw",
                bottom: "16cqh",
                width: "max(55cqw, 82cqh)",
                aspectRatio: "658 / 481",
                "@media (min-aspect-ratio: 1.5)": {
                  aspectRatio: "658 / 440",
                },
                "@media (max-aspect-ratio: 1.55)": {
                  width: "max(65cqw, 92cqh)", // inflates the entire board diagonally on iPads
                  right: "-2cqw", // Pushes the board further right off-center on 4:3 screens to create space
                  bottom: "14cqh",
                },
                "@media (min-width: 1160px) and (max-width: 1250px) and (min-height: 800px) and (max-height: 900px)": {
                  bottom: "12cqh",
                },
                "@media (min-width: 1000px) and (max-width: 1160px) and (max-height: 780px)": {
                  bottom: "14cqh",
                },
                "@media (min-width: 1300px) and (max-aspect-ratio: 1.4)": {
                  width: "max(55cqw, 82cqh)", // Scales the board down diagonally for specifically the iPad Pro 13-inch (1366x1024)
                  right: "-1cqw", // Brings it back in slightly to match
                  bottom: "12cqh",
                },
                zIndex: 4,
              }}
            >
              <Box component="img" sx={{ width: "100%", height: "100%", borderRadius: "44.5px", position: "absolute" }} src={board} />
              <Typography
                sx={{
                  position: "absolute",
                  width: "100%",
                  textAlign: "center",
                  top: "12%",
                  fontSize: {
                    lg: i18n.language === "ur" ? "max(4.5cqw, 6.5cqh)" : "max(2.8cqw, 4.2cqh)",
                    sm: i18n.language === "ur" ? "max(3.5cqw, 5cqh)" : "max(2.5cqw, 3.8cqh)",
                  },
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "90%",
                  fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                  letterSpacing: "1px",
                  color: "#824D1F",
                  mixBlendMode: "multiply",
                  textShadow: "0px -1.19314px 4.77256px #FFCB8F",
                  zIndex: 2,
                }}
              >
                {t("sayShoes")}
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  width: "78.6%",
                  height: "62.3%",
                  left: "8.6%",
                  top: "22.5%",
                  zIndex: 2,
                  background: "#863F2C",
                  mixBlendMode: "multiply",
                  boxShadow: "0px -1.30781px 5.23125px #FFCB8F, inset 0px 5.23125px 5.23125px rgba(0, 0, 0, 0.25)",
                  borderRadius: "25.056px",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  width: "70.7%",
                  height: "62.3%",
                  left: "12.5%",
                  top: "22.5%",
                  zIndex: 3,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box component="img" sx={{ width: "34%", height: "auto", objectFit: "contain", transform: "translateY(10%)" }} src={half} />
                <Box component="img" sx={{ width: "25%", height: "auto", objectFit: "contain", transform: "translateY(-15%)" }} src={full} />
                <Box component="img" sx={{ width: "34%", height: "auto", objectFit: "contain", transform: "translateY(10%)" }} src={three} />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "30%",
                  left: "47.9%",
                  bottom: "10.5%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              >
                <Box component="img" onClick={handleStop} sx={{ width: "25%", height: "auto", objectFit: "contain", cursor: "pointer", pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={stop} />
                <Box component="img" onClick={handlePauseResume} sx={{ width: "33%", height: "auto", objectFit: "contain", cursor: "pointer", pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={isPaused ? play : pause} />
                <Box component="img" onClick={handleRestart} sx={{ width: "25%", height: "auto", objectFit: "contain", cursor: "pointer", pointerEvents: "auto", "&:hover": { transform: "scale(1.28)", boxShadow: "0 10px 25px rgba(0,0,0,0)" } }} src={retry} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "2cqh",
            backgroundColor: "rgba(0,0,0,0.55)",
            padding: "max(0.6cqw, 0.9cqh) max(1cqw, 1.5cqh)",
            borderRadius: "max(1cqw, 1.5cqh)",
            zIndex: 20,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "max(1.2cqw, 1.8cqh)",
              fontFamily: "Chewy",
              color: speechVerified ? "#B9FFB3" : "#FFE1B3",
            }}
          >
            {audioFinished
              ? "Great job! ✅"
              : speechVerified
                ? "Verified: shoes ✅"
                : i18n.language === "ur"
                  ? `آگے جانے کے لیے جوتے بولیں (${speechStep}/2)`
                  : `Say “shoes” to continue (${speechStep}/2)`}
          </Typography>
          {speechStatus && (
            <Typography
              sx={{
                fontSize: "max(0.9cqw, 1.35cqh)",
                fontFamily: "Chewy",
                color: "#fff",
                opacity: 0.9,
                marginTop: "max(0.3cqw, 0.45cqh)",
              }}
            >
              {speechStatus}
            </Typography>
          )}
        </Box>

        <audio ref={audio1Ref} src={i18n.language === "ur" ? repeatshoeurdu : repeatCookie} preload="auto" />
        <audio ref={audio2Ref} src={i18n.language === "ur" ? againshoe : sayagain} preload="auto" />
        <audio ref={audio3Ref} src={i18n.language === "ur" ? amazshoeurdu : amazing} preload="auto" />
      </Box>

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
