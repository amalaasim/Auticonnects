import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

// Auth & context
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerified from "./pages/EmailVerified";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";

// Onboarding pages
import ChildNameSetup from "./pages/ChildNameSetup";
import ChildAgeSetup from "./pages/ChildAgeSetup";
import ChildCharacterSetup from "./pages/ChildCharacterSetup";
import ParentalConsent from "./pages/ParentalConsent";

// Game / app screens
import Cookie from "./component/showCookie";
import Lanuguage from "./component/language";
import Wonderworld from "./component/wonderworld";
import Learnobj from "./component/learnobject";
import Learnobjcar from "./component/learnobjectcar";
import Learnobjshoe from "./component/learnobjshoe";
import Learnobjball from "./component/learnobjball";
import Find from "./component/find";
import Findcar from "./component/findcar";
import Findshoe from "./component/findshoe";
import Findball from "./component/findball";
import Final from "./component/final";
import English from "./component/English";
import Verifyshoe from "./component/shoeverify";
import GardenStory from "./component/GardenStory";
import voice from "./assests/audio_file.mpeg";
import click from "./assests/click_Audio.wav";
import { UploadShoe } from "./component/uploadshoe";
import Show from "./component/showShoe";
import YourShoe from "./component/yourShoe";
import Ball from "./component/showball";
import Car from "./component/car";
import splashVideo from "./assests/splash.mp4";
import splashAudio from "./assests/splashaudio.mp3";

const MUSIC_MUTED_STORAGE_KEY = "app_music_muted";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── Public auth routes ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verified" element={<EmailVerified />} />

        {/* ── Onboarding routes (auth required, profile check skipped) ── */}
        <Route path="/child-profile/consent" element={<ParentalConsent />} />
        <Route path="/child-profile/name" element={<ChildNameSetup />} />
        <Route path="/child-profile/age" element={<ChildAgeSetup />} />
        <Route path="/child-profile/character" element={<ChildCharacterSetup />} />

        {/* ── Protected game routes ── */}
        <Route path="/" element={<ProtectedRoute><Lanuguage /></ProtectedRoute>} />
        <Route path="/english" element={<ProtectedRoute><English /></ProtectedRoute>} />
        <Route path="/garden" element={<ProtectedRoute><GardenStory /></ProtectedRoute>} />
        <Route path="/wonderworld" element={<ProtectedRoute><Wonderworld /></ProtectedRoute>} />
        <Route path="/learnobject" element={<ProtectedRoute><Learnobj /></ProtectedRoute>} />
        <Route path="/learnobjectcar" element={<ProtectedRoute><Learnobjcar /></ProtectedRoute>} />
        <Route path="/learnobjshoe" element={<ProtectedRoute><Learnobjshoe /></ProtectedRoute>} />
        <Route path="/learnobjball" element={<ProtectedRoute><Learnobjball /></ProtectedRoute>} />
        <Route path="/find" element={<ProtectedRoute><Find /></ProtectedRoute>} />
        <Route path="/findcar" element={<ProtectedRoute><Findcar /></ProtectedRoute>} />
        <Route path="/findshoe" element={<ProtectedRoute><Findshoe /></ProtectedRoute>} />
        <Route path="/findball" element={<ProtectedRoute><Findball /></ProtectedRoute>} />
        <Route path="/final" element={<ProtectedRoute><Final /></ProtectedRoute>} />
        <Route path="/shoeverify" element={<ProtectedRoute><Verifyshoe /></ProtectedRoute>} />
        <Route path="/uploadshoe" element={<ProtectedRoute><UploadShoe /></ProtectedRoute>} />
        <Route path="/showShoe" element={<ProtectedRoute><Show /></ProtectedRoute>} />
        <Route path="/yourShoe" element={<ProtectedRoute><YourShoe /></ProtectedRoute>} />
        <Route path="/showCookie" element={<ProtectedRoute><Cookie /></ProtectedRoute>} />
        <Route path="/showball" element={<ProtectedRoute><Ball /></ProtectedRoute>} />
        <Route path="/car" element={<ProtectedRoute><Car /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
        <Route path="/new-password" element={<ProtectedRoute><NewPasswordPage /></ProtectedRoute>} />
        <Route path="/final/learnobject" element={<ProtectedRoute><Final /></ProtectedRoute>} />
        <Route path="/final/learnobjectcar" element={<ProtectedRoute><Final /></ProtectedRoute>} />
        <Route path="/final/learnobjball" element={<ProtectedRoute><Final /></ProtectedRoute>} />
        <Route path="/final/learnobjshoe" element={<ProtectedRoute><Final /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const splashVideoRef = useRef(null);
  const splashAudioRef = useRef(null);
  const splashStartedRef = useRef(false);
  const [showSplash, setShowSplash] = useState(true);
  const SPLASH_AUDIO_DURATION_SECONDS = 4;

  const startSplashPlayback = () => {
    const video = splashVideoRef.current;
    const audio = splashAudioRef.current;
    if (!video || !audio) return;

    video.muted = true;
    audio.muted = false;
    audio.volume = 1;

    video.play().catch(() => {});
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (!showSplash) return;

    const video = splashVideoRef.current;
    const audio = splashAudioRef.current;
    if (!video || !audio) return;
    let splashTimeoutId;
    let splashAudioCutoffId;

    video.muted = true;
    audio.muted = false;
    audio.volume = 1;
    audio.currentTime = 0;
    video.currentTime = 0;
    splashStartedRef.current = false;

    const finishSplash = () => {
      audio.pause();
      audio.currentTime = 0;
      setShowSplash(false);
    };

    const handleSplashAudioPlaying = () => {
      if (splashStartedRef.current) return;
      splashStartedRef.current = true;
      splashAudioCutoffId = window.setTimeout(
        finishSplash,
        SPLASH_AUDIO_DURATION_SECONDS * 1000
      );
    };

    startSplashPlayback();
    splashTimeoutId = window.setTimeout(finishSplash, 12000);
    video.onended = finishSplash;
    video.onerror = finishSplash;
    audio.onplaying = handleSplashAudioPlaying;
    audio.onerror = () => {};

    return () => {
      window.clearTimeout(splashTimeoutId);
      window.clearTimeout(splashAudioCutoffId);
      video.onended = null;
      video.onerror = null;
      audio.onplaying = null;
      audio.onerror = null;
      audio.pause();
      video.pause();
    };
  }, [showSplash]);

  const handleUserInteraction = () => {
    if (showSplash) {
      startSplashPlayback();
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      const isMuted =
        typeof window !== "undefined" &&
        window.localStorage.getItem(MUSIC_MUTED_STORAGE_KEY) === "true";
      audio.volume = 0.1;
      audio.loop = true;
      audio.muted = isMuted;
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    }

    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <div
        className="App"
        onClick={handleUserInteraction}
        onTouchStart={handleUserInteraction}
      >
        {showSplash && (
          <div
            onClick={startSplashPlayback}
            onTouchStart={startSplashPlayback}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#000",
            }}
          >
            <video
              ref={splashVideoRef}
              src={splashVideo}
              preload="auto"
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
              }}
            />
            <audio ref={splashAudioRef} src={splashAudio} preload="auto" />
          </div>
        )}
        <audio ref={audioRef} src={voice} preload="auto" data-background-music="true" />
        <audio ref={clickAudioRef} src={click} preload="auto" />

        {!showSplash && (
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
