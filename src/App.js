import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

// Auth & context
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GameLogout from "./components/GameLogout";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerified from "./pages/EmailVerified";

// Onboarding pages
import ChildNameSetup from "./pages/ChildNameSetup";
import ChildAgeSetup from "./pages/ChildAgeSetup";
import ChildCharacterSetup from "./pages/ChildCharacterSetup";
import ChildLanguageSetup from "./pages/ChildLanguageSetup";

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
        <Route path="/child-profile/name" element={<ChildNameSetup />} />
        <Route path="/child-profile/age" element={<ChildAgeSetup />} />
        <Route path="/child-profile/character" element={<ChildCharacterSetup />} />
        <Route path="/child-profile/language" element={<ChildLanguageSetup />} />

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

  const handleUserInteraction = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1;
      audio.loop = true;
      audio.muted = false;
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
        <audio ref={audioRef} src={voice} preload="auto" />
        <audio ref={clickAudioRef} src={click} preload="auto" />

        <BrowserRouter>
          <GameLogout />
          <AnimatedRoutes />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
