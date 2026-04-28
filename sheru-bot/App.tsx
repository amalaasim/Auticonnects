import React, { useState, useEffect, useRef } from 'react';
import { useGeminiLive } from './hooks/useGeminiLive';
import { useWebEyeGaze } from './hooks/useWebEyeGaze';
import { useEmotionDetection } from './hooks/useEmotionDetection';
import { CartoonAvatar } from './components/CartoonAvatar';
import { TopBar } from './components/TopBar';
import { BottomControls } from './components/BottomControls';
import { assetUrl } from './utils/assetUrls';
import LoadingWheel from '../src/components/LoadingWheel';
import { finishSession, startSession } from '../src/lib/analytics/client';
import { normalizeFocusMetrics } from '../src/lib/analytics/mappers';

const imagePreloadCache = new Map<string, Promise<void>>();

function preloadImage(src: string) {
  if (!src) return Promise.resolve();
  if (imagePreloadCache.has(src)) return imagePreloadCache.get(src)!;

  const promise = new Promise<void>((resolve) => {
    const image = new Image();
    const done = () => resolve();

    image.onload = done;
    image.onerror = done;
    image.src = src;

    if (image.complete) {
      done();
    }
  }).then(() => {
    const image = new Image();
    image.src = src;
    return typeof image.decode === "function"
      ? image.decode().catch(() => {})
      : undefined;
  });

  imagePreloadCache.set(src, promise);
  return promise;
}

const App: React.FC = () => {
  const { connect, startConversation, disconnect, isConnected, isConnecting, isReady, aiVolume, userVolume, error, sendPrompt } = useGeminiLive();
  const { isLooking, videoRef, cameraAvailable } = useWebEyeGaze();
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  
  // Emotion detection using the same video ref as gaze detection
  const { currentEmotion, emotionConfidence, emotionCounts, sessionData } = useEmotionDetection(
    videoRef,
    hasStartedConversation
  );

  const [currentAiText, setCurrentAiText] = useState("");
  
  // Track AI speaking state
  const [wasAiTalking, setWasAiTalking] = useState(false);
  const gazeReminderSentRef = useRef(false);
  const gazeReminderCountRef = useRef(0);
  const sessionStartTimeRef = useRef<number>(0);
  const analyticsSessionIdRef = useRef<string | null>(null);
  const lastEmotionRef = useRef<string>("neutral");
  const emotionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const focusTimeRef = useRef(0);
  const distractedTimeRef = useRef(0);
  const distractionCountRef = useRef(0);
  const lastAttentionChangeRef = useRef<number | null>(null);
  const previousIsLookingRef = useRef<boolean | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const favoriteCharacter =
    typeof window !== "undefined" ? window.sessionStorage.getItem("favoriteCharacter") : null;
  const isBubbles = favoriteCharacter === "bubbles";
  const isMimmi = favoriteCharacter === "mimmi" || favoriteCharacter === "mimi";
  const [mimmiBackgroundPosition, setMimmiBackgroundPosition] = useState("center calc(100% + 8cqh)");
  const [isPageReady, setIsPageReady] = useState(false);
  const pageBackgroundSrc = isBubbles
    ? "/assets/Bubbles/Bubbles_BotPg_BG.png"
    : isMimmi
      ? "/assets/Mimmi/mimmi_bg_unified_extended.png"
      : assetUrl("/images/background.png");
  const emotionEmoji = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
    surprised: "😲",
    fearful: "😨",
    disgusted: "🤢",
  }[currentEmotion] || "😐";
  const emotionColors = {
    happy: { bg: "rgba(34, 197, 94, 0.2)", border: "rgba(34, 197, 94, 0.5)", text: "#dcfce7" },
    sad: { bg: "rgba(59, 130, 246, 0.2)", border: "rgba(59, 130, 246, 0.5)", text: "#dbeafe" },
    angry: { bg: "rgba(239, 68, 68, 0.2)", border: "rgba(239, 68, 68, 0.5)", text: "#fecaca" },
    neutral: { bg: "rgba(107, 114, 128, 0.2)", border: "rgba(107, 114, 128, 0.5)", text: "#e5e7eb" },
    surprised: { bg: "rgba(234, 179, 8, 0.2)", border: "rgba(234, 179, 8, 0.5)", text: "#fef3c7" },
    fearful: { bg: "rgba(168, 85, 247, 0.2)", border: "rgba(168, 85, 247, 0.5)", text: "#f3e8ff" },
    disgusted: { bg: "rgba(249, 115, 22, 0.2)", border: "rgba(249, 115, 22, 0.5)", text: "#ffedd5" },
  }[currentEmotion] || { bg: "rgba(107, 114, 128, 0.2)", border: "rgba(107, 114, 128, 0.5)", text: "#e5e7eb" };
  const [sceneRect, setSceneRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const updateSceneRect = () => {
      const container = sceneRef.current;
      if (!container) return;

      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
      const scale = Math.max(containerWidth / 1582, containerHeight / 1015);
      const width = 1582 * scale;
      const height = 1015 * scale;
      const left = (containerWidth - width) / 2;
      const top = containerHeight - height - (containerHeight * 0.08);

      setSceneRect({ left, top, width, height });
    };

    updateSceneRect();

    const resizeObserver = new ResizeObserver(() => {
      updateSceneRect();
    });

    if (sceneRef.current) {
      resizeObserver.observe(sceneRef.current);
    }

    window.addEventListener("resize", updateSceneRect);
    window.addEventListener("orientationchange", updateSceneRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSceneRect);
      window.removeEventListener("orientationchange", updateSceneRect);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsPageReady(false);

    const avatarAssets = isBubbles
      ? [
          "/assets/Bubbles/Bubbles_Sleeping.png",
          "/assets/Bubbles/standing-loop.gif",
          "/assets/Bubbles/talking-loop.gif",
        ]
      : isMimmi
        ? [
            "/assets/Bubbles/mimmi_sleeping.png",
            "/assets/Mimmi/standing_mimmi.gif",
            "/assets/Mimmi/talking_mimmi.gif",
          ]
        : [
            assetUrl("/images/cat_static.png"),
            assetUrl("/images/standinglion-loop.gif"),
            assetUrl("/images/talking.gif"),
            assetUrl("/images/circles.png"),
          ];

    const pageAssets = [
      pageBackgroundSrc,
      assetUrl("/images/status-rectangle-blend.png"),
      assetUrl("/images/logo.png"),
      assetUrl("/images/play-circle.png"),
      assetUrl("/images/pause-circle.png"),
      assetUrl("/images/stop-circle.png"),
      ...avatarAssets,
    ];

    Promise.all([
      ...pageAssets.map(preloadImage),
      document.fonts?.ready?.catch?.(() => {}) || Promise.resolve(),
    ]).then(() => {
      if (!cancelled) {
        setIsPageReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isBubbles, isMimmi, pageBackgroundSrc]);

  useEffect(() => {
    const updateMimmiBackgroundObjectPosition = () => {
      if (typeof window === "undefined") return;

      const isLaptopWide = window.matchMedia("(min-width: 1200px) and (min-aspect-ratio: 3/2)").matches;
      const isIpadPortrait = window.matchMedia("(min-width: 1000px) and (max-width: 1100px) and (min-height: 1300px)").matches;
      const isIpad13 = window.matchMedia("(min-width: 1300px) and (max-width: 1400px) and (max-aspect-ratio: 1.4)").matches;

      if (isLaptopWide) {
        setMimmiBackgroundPosition("center calc(100% + 0cqh)");
      } else if (isIpadPortrait || isIpad13) {
        setMimmiBackgroundPosition("center calc(100% + 0cqh)");
      } else {
        setMimmiBackgroundPosition("center calc(100% + 0cqh)");
      }
    };

    updateMimmiBackgroundObjectPosition();
    window.addEventListener("resize", updateMimmiBackgroundObjectPosition);
    window.addEventListener("orientationchange", updateMimmiBackgroundObjectPosition);

    return () => {
      window.removeEventListener("resize", updateMimmiBackgroundObjectPosition);
      window.removeEventListener("orientationchange", updateMimmiBackgroundObjectPosition);
    };
  }, []);

  useEffect(() => {
    if (hasStartedConversation || isReady || isConnecting) return;

    void connect().catch((connectError) => {
      console.error('Failed to preconnect Sheru Bot:', connectError);
    });
  }, [connect, hasStartedConversation, isReady, isConnecting]);

  const handleStart = async () => {
    setHasStartedConversation(true);
    sessionStartTimeRef.current = Date.now();
    focusTimeRef.current = 0;
    distractedTimeRef.current = 0;
    distractionCountRef.current = 0;
    lastAttentionChangeRef.current = Date.now();
    previousIsLookingRef.current = isLooking;

    void startSession({
      gameKey: 'sheru_bot',
      moduleKey: 'sheru_bot',
      sourceApp: 'sheru-bot',
      startedAt: new Date(sessionStartTimeRef.current).toISOString(),
    })
      .then((sessionId) => {
        analyticsSessionIdRef.current = sessionId;
      })
      .catch((analyticsError) => {
        console.error('Failed to start Sheru Bot analytics session:', analyticsError);
      });

    await startConversation();
  };

  const handleStop = () => {
    // Save session data before disconnecting
    if (isConnected && sessionStartTimeRef.current > 0 && analyticsSessionIdRef.current) {
      const sessionDuration = Date.now() - sessionStartTimeRef.current;
      const now = Date.now();
      const lastChange = lastAttentionChangeRef.current;
      const previousIsLooking = previousIsLookingRef.current;
      let focusTime = focusTimeRef.current;
      let distractedTime = distractedTimeRef.current;

      if (lastChange != null && previousIsLooking != null) {
        const elapsed = now - lastChange;
        if (previousIsLooking) {
          focusTime += elapsed;
        } else {
          distractedTime += elapsed;
        }
      }

      finishSession({
        sessionId: analyticsSessionIdRef.current,
        status: 'completed',
        endedAt: new Date(now).toISOString(),
        resultMetrics: {
          score_percent: sessionData.totalSamples > 0 ? 100 : 0,
          engagement_level: sessionDuration >= 60000 ? 'High' : sessionDuration >= 30000 ? 'Medium' : 'Low',
          gaze_reminders: gazeReminderCountRef.current,
        },
        emotionCounts,
        focusMetrics: normalizeFocusMetrics(
          focusTime,
          distractedTime,
          distractionCountRef.current
        ),
      }).catch((analyticsError) => {
        console.error('Failed to finish Sheru Bot analytics session:', analyticsError);
      });
    }
    
    disconnect();
    setHasStartedConversation(false);
    setCurrentAiText("");
    gazeReminderSentRef.current = false;
    gazeReminderCountRef.current = 0;
    sessionStartTimeRef.current = 0;
    analyticsSessionIdRef.current = null;
  };

  const isAiTalking = aiVolume > 0.05;
  const isUserTalking = userVolume > 0.05 && !isAiTalking;

  useEffect(() => {
    if (isAiTalking && !currentAiText) {
      if (isMimmi) {
        setCurrentAiText("Hello! I'm Mimmi. Let's play and talk together!");
      } else if (isBubbles) {
        setCurrentAiText("Hello! I'm Bubbles.");
      } else {
        setCurrentAiText("Hello! I'm Sheru.");
      }
    } else if (!isAiTalking) {
      setCurrentAiText("");
    }
  }, [isAiTalking, isBubbles, isMimmi]);

  // Eye-gaze monitoring logic
  useEffect(() => {
    if (!hasStartedConversation) {
      console.log('👁️ Gaze monitor: Not connected, skipping');
      return;
    }

    console.log('👁️ Gaze monitor check:', {
      wasAiTalking,
      isAiTalking,
      isLooking,
      gazeReminderSent: gazeReminderSentRef.current
    });

    // Detect when AI finishes speaking and child is not looking
    if (wasAiTalking && !isAiTalking) {
      // AI just finished talking - check gaze immediately
      console.log('🎤 AI finished speaking.');
      
      // Check current gaze status immediately (no delay)
      if (cameraAvailable && !isLooking && !gazeReminderSentRef.current && isConnected) {
        console.log('👁️❌ Child is not looking after AI finished. Sending gentle reminder...');
        
        // Send a gentle reminder to Sheru immediately
        sendPrompt("The child is not looking at the screen. Gently and sweetly ask them to look at you, in a very friendly way. Keep it very short and caring.");
        
        // Mark that we've sent the reminder
        gazeReminderSentRef.current = true;
        gazeReminderCountRef.current += 1; // Track for session data
        console.log('✅ Reminder sent! Cooldown started (30s)');
        
        // Reset the flag after a cooldown period (30 seconds)
        setTimeout(() => {
          gazeReminderSentRef.current = false;
          console.log('⏰ Gaze reminder cooldown expired. Ready to remind again.');
        }, 30000);
      } else if (isLooking) {
        console.log('👁️✅ Child is looking! No reminder needed.');
      } else if (!cameraAvailable) {
        console.log('📷 Camera unavailable. Skipping gaze reminder.');
      } else if (gazeReminderSentRef.current) {
        console.log('⏳ Child not looking but cooldown active - skipping reminder');
      }
    }

    // Track AI talking state
    setWasAiTalking(isAiTalking);

  }, [isAiTalking, wasAiTalking, isLooking, hasStartedConversation, sendPrompt, cameraAvailable]);

  // Emotion-based interaction logic
  useEffect(() => {
    if (!hasStartedConversation) {
      lastAttentionChangeRef.current = null;
      previousIsLookingRef.current = null;
      return;
    }

    const now = Date.now();

    if (lastAttentionChangeRef.current == null) {
      lastAttentionChangeRef.current = now;
      previousIsLookingRef.current = isLooking;
      return;
    }

    const previousIsLooking = previousIsLookingRef.current;
    const elapsed = now - lastAttentionChangeRef.current;

    if (previousIsLooking === true) {
      focusTimeRef.current += elapsed;
    } else if (previousIsLooking === false) {
      distractedTimeRef.current += elapsed;
    }

    if (previousIsLooking === true && isLooking === false) {
      distractionCountRef.current += 1;
    }

    previousIsLookingRef.current = isLooking;
    lastAttentionChangeRef.current = now;
  }, [hasStartedConversation, isLooking]);

  useEffect(() => {
    if (!hasStartedConversation || !currentEmotion) return;

    // If emotion changes significantly and AI is not talking
    if (currentEmotion !== lastEmotionRef.current && !isAiTalking) {
      lastEmotionRef.current = currentEmotion;
      
      // Clear any existing timeout
      if (emotionChangeTimeoutRef.current) {
        clearTimeout(emotionChangeTimeoutRef.current);
      }
      
      // Wait a bit to see if emotion is stable, then react
      emotionChangeTimeoutRef.current = setTimeout(() => {
        if (!isAiTalking && hasStartedConversation) {
          console.log(`😊 Emotion changed to: ${currentEmotion}. Informing Sheru...`);
          
          let emotionPrompt = "";
          
          switch (currentEmotion) {
            case "sad":
              emotionPrompt = "The child seems sad or unhappy. Respond with extra warmth, gentleness and comfort. Ask softly what's wrong in a caring way.";
              break;
            case "angry":
              emotionPrompt = "The child seems upset or frustrated. Be very calm, soothing and understanding. Gently ask if something is bothering them.";
              break;
            case "happy":
              emotionPrompt = "The child is happy and joyful! Match their positive energy with enthusiasm and celebration. Say something cheerful!";
              break;
            case "fearful":
              emotionPrompt = "The child seems scared or worried. Be extra gentle, reassuring and comforting. Tell them you're here and everything is okay.";
              break;
            case "surprised":
              emotionPrompt = "The child looks surprised! Share in their excitement with curiosity and wonder.";
              break;
            case "neutral":
              // Don't send a prompt for neutral - that's the baseline
              return;
            default:
              return;
          }
          
          if (emotionPrompt) {
            sendPrompt(emotionPrompt);
          }
        }
      }, 5000); // Wait 5 seconds to ensure emotion is stable
    }

    return () => {
      if (emotionChangeTimeoutRef.current) {
        clearTimeout(emotionChangeTimeoutRef.current);
      }
    };
  }, [currentEmotion, isAiTalking, hasStartedConversation, sendPrompt]);

  return (
    <div
      ref={sceneRef}
      className="relative w-screen h-screen min-h-screen max-h-screen overflow-hidden"
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        minHeight: "100dvh",
        containerType: "size",
        background: "linear-gradient(180deg, #104d46 0%, #0c2f31 42%, #4a984e 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 h-full w-full pointer-events-none select-none"
        style={{
          backgroundImage: `url(${pageBackgroundSrc})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: isMimmi ? mimmiBackgroundPosition : "bottom center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Hidden video element for eye-gaze tracking and emotion detection */}
      <video 
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline
        autoPlay
        muted
      />

      {!isPageReady ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#080f01]">
          <LoadingWheel size={84} />
        </div>
      ) : (
        <>

      <div
        style={{
          position: "fixed",
          bottom: "2.5cqh",
          left: "1.5cqw",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "1cqh 0.85cqw",
          borderRadius: "1cqh",
          fontSize: "1.75cqh",
          zIndex: 9999,
        }}
      >
        Eye gaze: {!cameraAvailable ? "Camera off" : isLooking ? "👀 Looking" : "🙈 Not looking"}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "9.5cqh",
          left: "1.5cqw",
          background: emotionColors.bg,
          border: `1px solid ${emotionColors.border}`,
          color: emotionColors.text,
          padding: "1.25cqh 1cqw",
          borderRadius: "2cqh",
          fontSize: "1.75cqh",
          backdropFilter: "blur(1cqh)",
          zIndex: 9999,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.7cqw" }}>
          <div style={{ fontSize: "3.25cqh", lineHeight: 1 }}>{emotionEmoji}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "1.75cqh", fontWeight: 600, textTransform: "capitalize", lineHeight: 1.1 }}>
              {currentEmotion}
            </div>
            <div style={{ fontSize: "1.5cqh", opacity: 0.8, lineHeight: 1.1 }}>
              {Math.round((emotionConfidence || 0) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <main
        className="absolute inset-0 w-full h-full z-10 overflow-visible pointer-events-none"
      >
        <div
          className="absolute overflow-visible"
          style={{
            left: `${sceneRect.left}px`,
            top: `${sceneRect.top}px`,
            width: `${sceneRect.width}px`,
            height: `${sceneRect.height}px`,
            containerType: "size",
          }}
        >
          <CartoonAvatar 
            isTalking={isAiTalking}
            volume={aiVolume}
            isListening={isUserTalking}
            userVolume={userVolume}
            currentText={currentAiText}
            isConnected={hasStartedConversation}
            isBubbles={isBubbles}
            isMimmi={isMimmi}
          />
        </div>
      </main>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6 overflow-x-hidden overflow-y-visible">
        <TopBar />
      </div>

      <div
        className="absolute z-20 overflow-visible pointer-events-none"
        style={{
          left: `${sceneRect.left}px`,
          top: `${sceneRect.top}px`,
          width: `${sceneRect.width}px`,
          height: `${sceneRect.height}px`,
          containerType: "size",
        }}
      >
        <footer
          className="absolute left-1/2 w-full -translate-x-1/2 flex flex-col items-center gap-6 pointer-events-auto"
          style={{ bottom: isMimmi ? '-10%' : '-5%' }}
        >
          <BottomControls
            isConnected={hasStartedConversation}
            isConnecting={isConnecting}
            isReady={isReady}
            onStart={handleStart}
            onStop={handleStop}
          />

          <div className="min-h-[68px] flex flex-col items-center gap-3">
            {/* Error Messages */}
            {error && (
              <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg text-sm">
                Voice Error: {error}
              </div>
            )}
          </div>
        </footer>
      </div>
        </>
      )}
    </div>
  );
};

export default App;
