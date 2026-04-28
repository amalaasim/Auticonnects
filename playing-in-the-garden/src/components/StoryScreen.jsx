import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { playingInTheGarden } from "../data/playingInTheGarden";
import { useWebEyeGaze } from "../gaze/useWebEyeGaze";
import { useEmotionModel } from "../emotion/useEmotionModel";
import { startSession, finishSession } from "../../../src/lib/analytics/client";
import { normalizeFocusMetrics } from "../../../src/lib/analytics/mappers";
import LoadingWheel from "../../../src/components/LoadingWheel";
import "../styles/StoryScreen.css";
import finalGif from "../final.gif";
import playIcon from "../../../src/assests/play.png";
import bannerSvg from "../assets/banner.svg";

const kidsPlayingGif = new URL(
  "../../public/characters/animations/kids playing.gif",
  import.meta.url
).href;
const pushGif = new URL(
  "../../public/characters/animations/push.gif",
  import.meta.url
).href;
const push2Gif = new URL(
  "../../public/characters/animations/push2.gif",
  import.meta.url
).href;
const settlementGif = new URL(
  "../../public/characters/animations/settelment.gif",
  import.meta.url
).href;
const dostiGif = new URL(
  "../../public/characters/animations/dosti.gif",
  import.meta.url
).href;
const sceneOneStaticImage = "/characters/AliAndFatima.png";

const StoryScreen = ({
  initialLanguage = "en",
  gardenBackgroundSrc = "/backgrounds/garden.png",
  favoriteCharacter = "",
}) => {
  const navigate = useNavigate();
  const [currentSceneId, setCurrentSceneId] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [responses, setResponses] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  // const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState(initialLanguage);
  const [isPaused, setIsPaused] = useState(false);

  const [isLionTalking, setIsLionTalking] = useState(false);
  const [sceneNarrationCompleted, setSceneNarrationCompleted] = useState(false);
  const [finalLionGifVersion, setFinalLionGifVersion] = useState(0);
  const [narratorGifVersion, setNarratorGifVersion] = useState(0);
  const [sceneCharacterGifVersion, setSceneCharacterGifVersion] = useState(0);
  const [finalAssetsReady, setFinalAssetsReady] = useState(false);
  const audioRef = useRef(null);

  const [hoveredEmotion, setHoveredEmotion] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const [attemptsByScene, setAttemptsByScene] = useState({});

  // Eye-gaze attention logic
  const { isLooking, videoRef, cameraAvailable } = useWebEyeGaze();
  const attentionTimerRef = useRef(null);
  const focusTimeRef = useRef(0);        // total focused time (ms)
  const distractedTimeRef = useRef(0);   // total distracted time (ms)
  const distractionCountRef = useRef(0); // number of distraction events
  const lastAttentionChangeRef = useRef(Date.now());
  // Session start time
  const sessionStartRef = useRef(Date.now());
  const analyticsSessionIdRef = useRef(null);
  const analyticsFinalizedRef = useRef(false);

  // Helper: Check if camera is available (permission granted)
  const isCameraAvailable = () =>
    cameraAvailable && videoRef.current && videoRef.current.srcObject;

  const {
    emotionCounts: modelEmotionCounts,
    currentEmotion,
    emotionConfidence,
  } = useEmotionModel({
    enabled: hasInteracted && cameraAvailable,
    videoRef,
    currentSceneId,
  });
  const emotionEmoji = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
  }[currentEmotion] || "😐";
  const emotionColors = {
    happy: { bg: "rgba(34, 197, 94, 0.2)", border: "rgba(34, 197, 94, 0.5)", text: "#dcfce7" },
    sad: { bg: "rgba(59, 130, 246, 0.2)", border: "rgba(59, 130, 246, 0.5)", text: "#dbeafe" },
    angry: { bg: "rgba(239, 68, 68, 0.2)", border: "rgba(239, 68, 68, 0.5)", text: "#fecaca" },
    neutral: { bg: "rgba(107, 114, 128, 0.2)", border: "rgba(107, 114, 128, 0.5)", text: "#e5e7eb" },
  }[currentEmotion] || { bg: "rgba(107, 114, 128, 0.2)", border: "rgba(107, 114, 128, 0.5)", text: "#e5e7eb" };

  const correctFeedbackAudios = [
    "/audio/en/correct1.mp3"
  ];
  const correctFeedbackAudioByLanguage = {
    en: correctFeedbackAudios,
    ur: ["/audio/ur/finalurdu.mp4"],
  };

  const incorrectFeedbackAudios = [
    "/audio/en/incorrect1.mp3",
    "/audio/en/incorrect2.mp3",
    "/audio/en/incorrect3.mp3"
  ];
  const incorrectFeedbackAudioByLanguage = {
    en: incorrectFeedbackAudios,
    ur: ["/audio/ur/nourdu.mpeg"],
  };
  const finalSceneAudio = {
    en: "/audio/en/scene7.mp3",
    ur: "/audio/ur/scene7.m4a"
  };

  const playAudioSafely = (src, { onEnded } = {}) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsLionTalking(false);
      setIsPaused(false);
    }

    const audio = new Audio(src);
    audio.volume = isMuted ? 0 : 1;
    audioRef.current = audio;
    setIsLionTalking(true);

    audio.play().catch(() => {
      audioRef.current = null;
      setIsLionTalking(false);
      setIsPaused(false);
      if (onEnded) onEnded();
    });

    audio.onended = () => {
      audioRef.current = null;
      setIsLionTalking(false);
      setIsPaused(false);
      if (onEnded) onEnded();
    };
  };

  // Audio control helpers
  const pauseAudio = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsLionTalking(true);
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsLionTalking(false);
      setIsPaused(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsLionTalking(false);
    }
    setIsPaused(false);
  };

  const replayAudio = () => {
    if (!currentScene?.audio) return;

    setNarratorGifVersion((current) => current + 1);
    setSceneCharacterGifVersion((current) => current + 1);

    let audioSrc = null;

    if (typeof currentScene.audio === "string") {
      audioSrc = currentScene.audio;
    } else {
      audioSrc =
        currentScene.audio?.[language] ||
        currentScene.audio?.en;
    }

    if (audioSrc) {
      playAudioSafely(audioSrc, {
        onEnded: () => {
          if (currentSceneId === 3 || currentSceneId === 4) {
            setSceneNarrationCompleted(true);
          }
        },
      });
    }
  };

  const playRandomFeedbackAudio = (type, options) => {
    const list =
      type === "correct"
        ? (correctFeedbackAudioByLanguage[language] || correctFeedbackAudios)
        : (incorrectFeedbackAudioByLanguage[language] || incorrectFeedbackAudios);

    const randomIndex = Math.floor(Math.random() * list.length);
    playAudioSafely(list[randomIndex], options);
  };

  const getCharacterImageForScene = (sceneId) => {
    switch (sceneId) {
      case 1:
        return kidsPlayingGif;
      case 2:
        return kidsPlayingGif;
      case 3:
        return pushGif;
      case 4:
        return push2Gif;
      case 5:
        return settlementGif;
      case 6:
        return dostiGif;
      default:
        return "/characters/AliAndFatima.png";
    }
  };

  const getDominantEmotion = (counts) => {
    if (!counts) return null;

    return Object.entries(counts).reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ["neutral", 0]
    )[0];
  };

  const currentScene = playingInTheGarden.find(
    scene => scene.id === currentSceneId
  );
  const currentSceneIndex = playingInTheGarden.findIndex(
    scene => scene.id === currentSceneId
  );
  const previousSceneId =
    currentSceneIndex > 0
      ? playingInTheGarden[currentSceneIndex - 1]?.id ?? null
      : null;
  const sceneText =
    currentScene?.text?.[language] ||
    currentScene?.text?.en ||
    "";
  const finalSceneText =
    language === "ur"
      ? "ہم کھیلتے وقت ایک دوسرے کا خیال رکھتے ہیں، پیار سے کھیلتے ہیں۔ اللہ حافظ"
      : "We take care of each other while playing in the garden!";
  const isScene6Urdu = currentSceneId === 6 && language === "ur";
  const shouldUseCryingSheru =
    (currentSceneId === 3 || currentSceneId === 4) &&
    sceneNarrationCompleted &&
    !isLionTalking;
  const useBubblesNarrator = favoriteCharacter === "bubbles";
  const useMimmiNarrator = favoriteCharacter === "mimmi" || favoriteCharacter === "mimi";

  // If Mimmi is selected, override background with Mimmi's garden background
  const effectiveGardenBackgroundSrc = useMimmiNarrator
    ? "/assets/Mimmi/mimmi_garden_bg.png"
    : gardenBackgroundSrc;
  const idleNarratorSrc = useBubblesNarrator
    ? shouldUseCryingSheru
      ? "/assets/Bubbles/bubbles_crying.gif"
      : "/assets/Bubbles/standing-loop.gif"
    : useMimmiNarrator
      ? shouldUseCryingSheru
        ? "/assets/Mimmi/crying_mimmi.gif"
        : "/assets/Mimmi/standing_mimmi.gif"
      : shouldUseCryingSheru
        ? "/characters/crying_sheru.gif"
        : "/characters/green-try.gif";
  const talkingNarratorSrc = useBubblesNarrator
    ? "/assets/Bubbles/talking.gif"
    : useMimmiNarrator
      ? "/assets/Mimmi/talking_mimmi.gif"
      : "/characters/talking.gif";
  const finalNarratorSrc = useBubblesNarrator
    ? "/assets/Bubbles/bubbles_clapping.gif"
    : useMimmiNarrator
      ? "/assets/Mimmi/clapping_mimmi.gif"
      : `${finalGif}?v=${finalLionGifVersion}`;
  const lionImageSrc = isLionTalking ? talkingNarratorSrc : idleNarratorSrc;
  const versionedNarratorSrc = lionImageSrc.endsWith(".gif")
    ? `${lionImageSrc}${lionImageSrc.includes("?") ? "&" : "?"}v=${narratorGifVersion}`
    : lionImageSrc;
  const currentCharacterImageSrc = getCharacterImageForScene(currentSceneId);
  const displayedCharacterImageSrc =
    currentSceneId === 1 && !hasInteracted
      ? sceneOneStaticImage
      : currentCharacterImageSrc;
  const versionedCharacterImageSrc =
    displayedCharacterImageSrc && displayedCharacterImageSrc.endsWith(".gif")
      ? `${displayedCharacterImageSrc}${displayedCharacterImageSrc.includes("?") ? "&" : "?"}v=${sceneCharacterGifVersion}`
      : displayedCharacterImageSrc;

  useEffect(() => {
    setNarratorGifVersion((current) => current + 1);
  }, [currentSceneId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    [idleNarratorSrc, talkingNarratorSrc].forEach((src) => {
      if (!src) return;
      const image = new Image();
      image.src = src.endsWith(".gif")
        ? `${src}${src.includes("?") ? "&" : "?"}v=${narratorGifVersion}`
        : src;
    });
  }, [idleNarratorSrc, narratorGifVersion, talkingNarratorSrc]);

  useEffect(() => {
    setSceneCharacterGifVersion((current) => current + 1);
  }, [currentCharacterImageSrc, currentSceneId]);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    let ignore = false;

    const ensureAnalyticsSession = async () => {
      if (analyticsSessionIdRef.current) return;

      try {
        const sessionId = await startSession({
          gameKey: "garden_story",
          moduleKey: "garden_story",
          sourceApp: "garden-story",
          language,
          startedAt: new Date(sessionStartRef.current).toISOString(),
        });

        if (!ignore) {
          analyticsSessionIdRef.current = sessionId;
        }
      } catch (error) {
        console.error("Failed to start Garden Story analytics session:", error);
      }
    };

    ensureAnalyticsSession();

    return () => {
      ignore = true;
    };
  }, [language]);

  const goHome = () => {
    window.localStorage.setItem("app_language", language);
    navigate("/english");
  };

  useEffect(() => {
    if (!hasInteracted) return;

    let audioSrc = null;

    if (!currentScene) {
      audioSrc =
        finalSceneAudio[language] ||
        finalSceneAudio.en;
    } else {
      if (!currentScene.audio) return;

      // Support BOTH formats:
      // 1) audio: "/audio/scene1.mp3"
      // 2) audio: { en: "...", ur: "..." }
      if (typeof currentScene.audio === "string") {
        audioSrc = currentScene.audio;
      } else {
        audioSrc =
          currentScene.audio?.[language] ||
          currentScene.audio?.en;
      }
    }

    if (audioSrc) {
      playAudioSafely(audioSrc, {
        onEnded: () => {
          if (currentSceneId === 3 || currentSceneId === 4) {
            setSceneNarrationCompleted(true);
          }
        },
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [currentSceneId, language, hasInteracted]);

  // Eye-gaze attention monitoring effect (self-rescheduling chained setTimeout)
  useEffect(() => {
    // 🚫 Do nothing if camera unavailable OR on final score screen
    if (!isCameraAvailable() || !currentScene) return;
    if (isLooking) {
      if (attentionTimerRef.current) {
        clearTimeout(attentionTimerRef.current);
        attentionTimerRef.current = null;
      }
      return;
    }

    // First prompt after 20s, then repeat every 20s if still not looking
    const schedulePrompt = (delay) => {
      attentionTimerRef.current = setTimeout(() => {
        if (!isLooking && !audioRef.current) {
          playAudioSafely(
            language === "ur"
              ? "/audio/ur/lookhereurdu.mp3"
              : "/audio/en/lion-guide.mp3"
          );
        }
        if (!isLooking) {
          schedulePrompt(20000);
        }
      }, delay);
    };

    if (!attentionTimerRef.current) {
      schedulePrompt(20000);
    }

    return () => {
      if (attentionTimerRef.current) {
        clearTimeout(attentionTimerRef.current);
        attentionTimerRef.current = null;
      }
    };
  }, [isLooking, currentScene]);

  // Aggregate focus/distracted time and count distractions
  useEffect(() => {
    // 🚫 Do not track focus if camera unavailable
    if (!isCameraAvailable()) return;
    const now = Date.now();
    const elapsed = now - lastAttentionChangeRef.current;

    if (isLooking) {
      // user just returned focus
      distractedTimeRef.current += elapsed;
    } else {
      // user just lost focus
      focusTimeRef.current += elapsed;
      distractionCountRef.current += 1;
    }

    lastAttentionChangeRef.current = now;
  }, [isLooking]);

  // 🚫 Stop gaze tracking on final score screen
  useEffect(() => {
    if (!currentScene) {
      if (attentionTimerRef.current) {
        clearTimeout(attentionTimerRef.current);
        attentionTimerRef.current = null;
      }
    }
  }, [currentScene]);

  useEffect(() => {
    setHoveredEmotion(null);
    setSelectedEmotion(null);
    setSceneNarrationCompleted(false);
  }, [currentSceneId]);

  useEffect(() => {
    if (currentScene) return;

    const restartTimer = window.setInterval(() => {
      setFinalLionGifVersion((current) => current + 1);
    }, 4900);

    return () => {
      window.clearInterval(restartTimer);
    };
  }, [currentScene]);

  useEffect(() => {
    if (currentScene) {
      setFinalAssetsReady(false);
      return;
    }

    const totalAttempts = responses.length;
    const totalCorrect = responses.filter(r => r.isCorrect).length;
    const percentage =
      totalAttempts === 0 ? 0 : (totalCorrect / totalAttempts) * 100;

    let stars = 1;
    if (percentage >= 100) {
      stars = 3;
    } else if (percentage >= 66) {
      stars = 2;
    } else if (percentage >= 33) {
      stars = 1;
    }

    const assetUrls = [
      gardenBackgroundSrc,
      bannerSvg,
      "/ui/PlayAgain.png",
      "/ui/home.png",
      isMuted ? "/ui/volume-off.png" : "/ui/volume-on.png",
      `/ui/stars/star-${stars}.png`,
      finalNarratorSrc,
    ];

    let cancelled = false;

    const preloadImage = (src) =>
      new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;
      });

    Promise.all(assetUrls.map(preloadImage)).then(() => {
      if (!cancelled) {
        setFinalAssetsReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [currentScene, finalLionGifVersion, finalNarratorSrc, gardenBackgroundSrc, isMuted, responses]);

  if (!currentScene) {
    // PART 2: Build sessionData when story completes
    const sessionEndTime = Date.now();
    const completionTimeMs = sessionEndTime - sessionStartRef.current;

    const totalStars = responses.reduce((sum, r) => sum + (r.stars || 0), 0);
    const maxStars = responses.length * 3;

    let engagementLevel = "Low";
    if (maxStars > 0) {
      const ratio = totalStars / maxStars;
      if (ratio >= 0.7) engagementLevel = "High";
      else if (ratio >= 0.4) engagementLevel = "Medium";
    }

    const sessionData = {
      sessionMeta: {
        startTime: sessionStartRef.current,
        endTime: sessionEndTime,
        completionTimeMs,
      },
      performance: {
        totalStars,
        maxStars,
        engagementLevel,
      },
      attention: {
        focusTimeMs: focusTimeRef.current,
        distractedTimeMs: distractedTimeRef.current,
        distractionCount: distractionCountRef.current,
      },
      emotions: {
        overall: modelEmotionCounts,
        perQuestion: responses.map(r => ({
          sceneId: r.sceneId,
          detectedEmotion: r.detectedEmotion,
          attempts: r.attempts,
          stars: r.stars,
        })),
      },
    };
    const totalAttempts = responses.length;
    const totalCorrect = responses.filter(r => r.isCorrect).length;

    const percentage =
      totalAttempts === 0 ? 0 : (totalCorrect / totalAttempts) * 100;

    if (!analyticsFinalizedRef.current && analyticsSessionIdRef.current) {
      analyticsFinalizedRef.current = true;
      const focusMetrics = normalizeFocusMetrics(
        focusTimeRef.current,
        distractedTimeRef.current,
        distractionCountRef.current
      );

      finishSession({
        sessionId: analyticsSessionIdRef.current,
        status: "completed",
        endedAt: new Date(sessionEndTime).toISOString(),
        resultMetrics: {
          score_percent: Math.round(percentage || 0),
          engagement_level: engagementLevel,
        },
        emotionCounts: modelEmotionCounts,
        focusMetrics,
      }).catch((error) => {
        console.error("Failed to finish Garden Story analytics session:", error);
      });
    }

    let stars = 1;
    if (percentage >= 100) {
      stars = 3;
    } else if (percentage >= 66) {
      stars = 2;
    } else if (percentage >= 33) {
      stars = 1;
    }

    if (!finalAssetsReady) {
      return (
        <div className="story-container">
          <div className="scene-wrapper final-loading-screen">
            <LoadingWheel size={88} />
          </div>
        </div>
      );
    }

    return (
      <div className="story-container">
        <div
          className="scene-wrapper"
          style={{ backgroundImage: `url(${gardenBackgroundSrc})` }}
          onClick={() => {
            if (!hasInteracted) {
              setHasInteracted(true);

              // 🔑 Browser autoplay unlock for FIRST scene
              if (currentSceneId === 1 && currentScene?.audio) {
                let audioSrc = null;

                if (typeof currentScene.audio === "string") {
                  audioSrc = currentScene.audio;
                } else {
                  audioSrc =
                    currentScene.audio?.[language] ||
                    currentScene.audio?.en;
                }

                if (audioSrc) {
                  playAudioSafely(audioSrc);
                }
              }
            }
          }}
        >
          {/* Top-right global controls */}
          <div className="top-right-controls">
            <img
              src="/ui/home.png"
              alt="Home"
              className="top-btn"
              onClick={goHome}
            />

            <img
              src={isMuted ? "/ui/volume-off.png" : "/ui/volume-on.png"}
              alt="Toggle volume"
              className="top-btn"
              onClick={() => {
                setIsMuted(prev => {
                  const next = !prev;
                  if (audioRef.current) {
                    audioRef.current.volume = next ? 0 : 1;
                  }
                  return next;
                });
              }}
            />
          </div>
          <img
            src={gardenBackgroundSrc}
            alt="Garden background"
            className="scene-background"
          />
          {/* Lion centered */}
          {/* Removed the standalone lion image here as per instructions */}
          {/* Text banner */}
          <div className="story-banner-layer">
            <img
              src={bannerSvg}
              alt="Text banner"
              className="text-banner"
            />
            <div className="story-text-group">
              <div className={`story-text ${language === "ur" ? "urdu" : ""}`}>
                {(sceneText || finalSceneText).split("\n").map((line, index, arr) => (
                  <span
                    key={`${line}-${index}`}
                    style={{ display: "block", whiteSpace: "nowrap" }}
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* New final score layout */}
          <div className="final-score-layout">
            <div className={`final-lion ${useMimmiNarrator ? "final-lion-mimmi" : ""}`}>
              <img
                src={finalNarratorSrc}
                alt="Lion narrator"
              />
            </div>
            <div className="final-actions">
              <img
                src={`/ui/stars/star-${stars}.png`}
                alt={`${stars} star rating`}
                className="final-star-image"
              />
              <img
                src="/ui/PlayAgain.png"
                alt="Play Again"
                className="play-again-button"
                onClick={() => {
                  setCurrentSceneId(1);
                  setResponses([]);
                  setFeedback(null);
                  setHasInteracted(false);
                }}
              />
            </div>
          </div>
        </div>
        {/* DEBUG: Eye gaze status */}
        <div
          style={{
            position: "fixed",
            bottom: "2cqh",
            left: "1.4cqw",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "1cqh 0.85cqw",
            borderRadius: "1cqh",
            fontSize: "1.75cqh",
            zIndex: 9999
          }}
        >
          Eye gaze: {isLooking ? "👀 Looking" : "🙈 Not looking"}
        </div>
        {/* DEBUG: Emotion detection status */}
        <div
          style={{
            position: "fixed",
            bottom: "7.7cqh",
            left: "1.4cqw",
            background: emotionColors.bg,
            border: `1px solid ${emotionColors.border}`,
            color: emotionColors.text,
            padding: "1.25cqh 1cqw",
            borderRadius: "2cqh",
            fontSize: "1.75cqh",
            backdropFilter: "blur(1cqh)",
            zIndex: 9999
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
        {/* Hidden video element for eye-gaze camera input */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "0px",
            height: "0px",
            visibility: "hidden",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  return (
    <div className="story-container">

      <div
        className="scene-wrapper"
        style={{ backgroundImage: `url(${effectiveGardenBackgroundSrc})` }}
        onClick={() => {
          if (!hasInteracted) {
            setHasInteracted(true);
          }
        }}
      >
        {/* Top-right global controls */}
        <div className="top-right-controls">
          <img
            src="/ui/home.png"
            alt="Home"
            className="top-btn"
            onClick={goHome}
          />
          <img
            src={isMuted ? "/ui/volume-off.png" : "/ui/volume-on.png"}
            alt="Toggle volume"
            className="top-btn"
            onClick={() => {
              setIsMuted(prev => {
                const next = !prev;
                if (audioRef.current) {
                  audioRef.current.volume = next ? 0 : 1;
                }
                return next;
              });
            }}
          />
        </div>
          <img
            src={effectiveGardenBackgroundSrc}
            alt="Garden background"
            className="scene-background"
          />

        <div
          className={`scene-characters ${
            currentSceneId === 3
              ? "scene-characters-push"
              : currentSceneId === 4
                ? "scene-characters-push-2"
                : currentSceneId === 5
                  ? "scene-characters-settlement"
                  : currentSceneId === 6
                    ? "scene-characters-dosti"
                : ""
          }`}
        >
          <img
            key={`${versionedCharacterImageSrc || "scene-character"}-${sceneCharacterGifVersion}`}
            src={versionedCharacterImageSrc}
            alt="Ali and Fatima"
          />
        </div>
        <div className="lion-shadow" aria-hidden="true" />
        <img
          src={versionedNarratorSrc}
          alt="Lion narrator"
          className={`lion ${isLionTalking ? "lion-talking" : "lion-idle"} ${
            useBubblesNarrator ? "lion-bubbles" : ""
          } ${useMimmiNarrator ? "lion-mimmi" : ""}`}
        />
        <div
          className={`narrator-controls-anchor ${
            useBubblesNarrator ? "narrator-controls-anchor-bubbles" : ""
          } ${useMimmiNarrator ? "narrator-controls-anchor-mimmi" : ""}`}
        >
          <div className="audio-controls">
            <img
              src="/ui/audio-stop.png"
              alt="Stop audio"
              className="audio-btn"
              onClick={stopAudio}
            />
            <img
              src={isPaused ? playIcon : "/ui/audio-pause.png"}
              alt={isPaused ? "Play audio" : "Pause audio"}
              className="audio-btn pause"
              onClick={pauseAudio}
            />
            <img
              src="/ui/audio-replay.png"
              alt="Replay audio"
              className="audio-btn"
              onClick={replayAudio}
            />
          </div>
        </div>

        <div className="story-banner-layer">
          <img
            src={bannerSvg}
            alt="Text banner"
            className="text-banner"
          />

          <div
            className="story-text-group"
            style={isScene6Urdu ? { left: "54.2%" } : undefined}
          >
            <div
              className="story-text"
              style={isScene6Urdu ? { fontSize: "1.85cqw" } : undefined}
            >
              {sceneText.split("\n").map((line, lineIndex) => (
                <span
                  key={`line-${lineIndex}`}
                  style={{
                    display: "block",
                    whiteSpace: "nowrap",
                    marginBottom:
                      lineIndex < sceneText.split("\n").length - 1 ? "0.22em" : "0",
                  }}
                >
                  {line.split(" ").map((word, wordIndex) => {
                    const cleanWord = word.replace(/[.,!?]/g, "");

                    const englishHighlights = ["happily", "crying"];
                    const urduHighlightsScene1 = ["خوشی", "خوشی"];
                    const urduHighlightsScene3 = ["رونے"];

                    let shouldHighlight = false;

                    if (language === "en") {
                      shouldHighlight = englishHighlights.includes(cleanWord.toLowerCase());
                    }

                    if (language === "ur") {
                      if (currentSceneId === 1 && urduHighlightsScene1.includes(cleanWord)) {
                        shouldHighlight = true;
                      }
                      if (currentSceneId === 3 && urduHighlightsScene3.includes(cleanWord)) {
                        shouldHighlight = true;
                      }
                    }

                    if (shouldHighlight) {
                      return (
                        <span key={`${lineIndex}-${wordIndex}`} className="highlight-word">
                          {word + " "}
                        </span>
                      );
                    }

                    return <span key={`${lineIndex}-${wordIndex}`}>{word + " "}</span>;
                  })}
                </span>
              ))}
            </div>

            {currentScene.askEmotion && (
              <div
                className="emotion-selector"
                style={isScene6Urdu ? { marginTop: "4.4cqh" } : undefined}
              >
                {currentScene.emotionOptions.map((emotion) => {
                const key = emotion.toLowerCase();
                const isActive = selectedEmotion === emotion || hoveredEmotion === emotion;
                const src = isActive
                  ? `/emotions/${key}-color.png`
                  : `/emotions/${key}-grey.png`;

                return (
	                  <img
	                    key={emotion}
	                    src={src}
	                    alt={emotion}
	                    className={`emotion-image ${emotion === "Crying" ? "emotion-crying" : ""} ${isActive ? "emotion-active" : ""}`}
	                    onMouseEnter={() => setHoveredEmotion(emotion)}
                    onMouseLeave={() => setHoveredEmotion(null)}
                    onClick={() => {
                      // Block only if narration audio is actively playing
                      if (audioRef.current && !audioRef.current.paused) return;

                      const sceneId = currentScene.id;
                      const prevAttempts = attemptsByScene[sceneId] || 0;
                      const newAttempts = prevAttempts + 1;

                      setAttemptsByScene(prev => ({
                        ...prev,
                        [sceneId]: newAttempts
                      }));

                      const isCorrect = emotion === currentScene.correctEmotion;
                      setSelectedEmotion(emotion);

                      let starsEarned = 0;
                      if (isCorrect) {
                        if (newAttempts === 1) starsEarned = 3;
                        else if (newAttempts === 2) starsEarned = 2;
                        else if (newAttempts === 3) starsEarned = 1;
                      }

                      setResponses(prev => [
                        ...prev,
                        {
                          sceneId,
                          attempts: newAttempts,
                          stars: starsEarned,
                          selectedEmotion: emotion,
                          correctEmotion: currentScene.correctEmotion,
                          isCorrect,
                          detectedEmotion: getDominantEmotion(modelEmotionCounts),
                          timestamp: Date.now()
                        }
                      ]);

                      setFeedback(isCorrect ? "correct" : "incorrect");

                      if (isCorrect) {
                        playRandomFeedbackAudio("correct", {
                          onEnded: () => {
                            setFeedback(null);
                            setCurrentSceneId(currentScene.nextScene);
                          }
                        });
                      } else {
                        playRandomFeedbackAudio("incorrect");
                      }
                    }}
                  />
                );
              })}
              </div>
            )}
          </div>
          {!currentScene.askEmotion && currentScene.nextScene && (
            <img
              src="/ui/next-button.png"
              alt="Next"
              className="next-button"
              onClick={() => {
                if (audioRef.current) return;
                setCurrentSceneId(currentScene.nextScene);
              }}
            />
          )}
          {previousSceneId && (
            <img
              src="/assets/arrow.png"
              alt="Back"
              className="prev-button"
              onClick={() => {
                stopAudio();
                setFeedback(null);
                setCurrentSceneId(previousSceneId);
              }}
            />
          )}
        </div>
        {attemptsByScene[currentScene.id] >= 3 &&
          feedback !== "correct" && (
            <img
              src="/ui/hint-arrow.png"
              alt="Hint arrow"
              className="hint-arrow"
            />
        )}
      </div>
      {/* DEBUG: Eye gaze status */}
      <div
        style={{
          position: "fixed",
          bottom: "2cqh",
          left: "1.4cqw",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "1cqh 0.85cqw",
          borderRadius: "1cqh",
          fontSize: "1.75cqh",
          zIndex: 9999
        }}
      >
        Eye gaze: {isLooking ? "👀 Looking" : "🙈 Not looking"}
      </div>
      {/* DEBUG: Emotion detection status */}
      <div
        style={{
          position: "fixed",
          bottom: "7.7cqh",
          left: "1.4cqw",
          background: emotionColors.bg,
          border: `1px solid ${emotionColors.border}`,
          color: emotionColors.text,
          padding: "1.25cqh 1cqw",
          borderRadius: "2cqh",
          fontSize: "1.75cqh",
          backdropFilter: "blur(1cqh)",
          zIndex: 9999
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
      {/* Hidden video element for eye-gaze camera input */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "0px",
          height: "0px",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default StoryScreen;
