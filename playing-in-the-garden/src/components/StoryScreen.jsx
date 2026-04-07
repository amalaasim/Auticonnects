import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { playingInTheGarden } from "../data/playingInTheGarden";
import { useWebEyeGaze } from "../gaze/useWebEyeGaze";
import { useEmotionModel } from "../emotion/useEmotionModel";
import { startSession, finishSession } from "../../../src/lib/analytics/client";
import { normalizeFocusMetrics } from "../../../src/lib/analytics/mappers";
import "../styles/StoryScreen.css";
import finalGif from "../final.gif";
import playIcon from "../../../src/assests/play.png";

const StoryScreen = ({ initialLanguage = "en" }) => {
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
  const [finalLionGifVersion, setFinalLionGifVersion] = useState(0);
  const audioRef = useRef(null);

  const [hoveredEmotion, setHoveredEmotion] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const [attemptsByScene, setAttemptsByScene] = useState({});

  // Eye-gaze attention logic
  const { isLooking, videoRef } = useWebEyeGaze();
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
    videoRef.current && videoRef.current.srcObject;

  const {
    emotionCounts: modelEmotionCounts,
    currentEmotion,
    emotionConfidence,
  } = useEmotionModel({
    enabled: hasInteracted,
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

  const incorrectFeedbackAudios = [
    "/audio/en/incorrect1.mp3",
    "/audio/en/incorrect2.mp3",
    "/audio/en/incorrect3.mp3"
  ];
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

    let audioSrc = null;

    if (typeof currentScene.audio === "string") {
      audioSrc = currentScene.audio;
    } else {
      audioSrc =
        currentScene.audio?.[language] ||
        currentScene.audio?.en;
    }

    if (audioSrc) playAudioSafely(audioSrc);
  };

  const playRandomFeedbackAudio = (type, options) => {
    const list =
      type === "correct"
        ? correctFeedbackAudios
        : incorrectFeedbackAudios;

    const randomIndex = Math.floor(Math.random() * list.length);
    playAudioSafely(list[randomIndex], options);
  };

  const getCharacterImageForScene = (sceneId) => {
    switch (sceneId) {
      case 3:
        return "/characters/AliAndFatima-Push.png";
      case 4:
        return "/characters/AliAndFatima-Cry.png";
      case 5:
        return "/characters/AliAndFatima-Pick.png";
      case 6:
        return "/characters/AliAndFatima-Reconcile.png";
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
      playAudioSafely(audioSrc);
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
          playAudioSafely("/audio/en/lion-guide.mp3");
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

    return (
      <div className="story-container">
        <div
          className="scene-wrapper"
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
            src="/backgrounds/garden.png"
            alt="Garden background"
            className="scene-background"
          />
          {/* Lion centered */}
          {/* Removed the standalone lion image here as per instructions */}
          {/* Text banner */}
          <img
            src="/ui/text-banner.png"
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
          {/* New final score layout */}
          <div className="final-score-layout">
            <div className="final-lion">
              <img
                src={`${finalGif}?v=${finalLionGifVersion}`}
                alt="Lion narrator"
              />
            </div>
            <div className="final-stars">
              <img
                src={`/ui/stars/star-${stars}.png`}
                alt={`${stars} star rating`}
                className="final-star-image"
              />
            </div>
          </div>
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
        {/* DEBUG: Eye gaze status */}
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            zIndex: 9999
          }}
        >
          Eye gaze: {isLooking ? "👀 Looking" : "🙈 Not looking"}
        </div>
        {/* DEBUG: Emotion detection status */}
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: 20,
            background: emotionColors.bg,
            border: `1px solid ${emotionColors.border}`,
            color: emotionColors.text,
            padding: "10px 14px",
            borderRadius: "16px",
            fontSize: "14px",
            backdropFilter: "blur(8px)",
            zIndex: 9999
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "26px", lineHeight: 1 }}>{emotionEmoji}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, textTransform: "capitalize", lineHeight: 1.1 }}>
                {currentEmotion}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8, lineHeight: 1.1 }}>
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
          src="/backgrounds/garden.png"
          alt="Garden background"
          className="scene-background"
        />

        <div className="scene-characters">
          <img
            src={getCharacterImageForScene(currentSceneId)}
            alt="Ali and Fatima"
          />
        </div>
        <img
          src={isLionTalking ? "/characters/talking.gif" : "/characters/green-try.gif"}
          alt="Lion narrator"
          className={`lion ${isLionTalking ? "lion-talking" : "lion-idle"}`}
        />
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

        <img
          src="/ui/text-banner.png"
          alt="Text banner"
          className="text-banner"
        />

        <div className="story-text-group">
          <div className="story-text">
            {sceneText.split("\n").map((line, lineIndex) => (
              <span
                key={`line-${lineIndex}`}
                style={{ display: "block", whiteSpace: "nowrap" }}
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
            <div className="emotion-selector">
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
                    className={`emotion-image ${emotion === "Crying" ? "emotion-crying" : ""}`}
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
          bottom: 20,
          left: 20,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "14px",
          zIndex: 9999
        }}
      >
        Eye gaze: {isLooking ? "👀 Looking" : "🙈 Not looking"}
      </div>
      {/* DEBUG: Emotion detection status */}
      <div
        style={{
          position: "fixed",
          bottom: 80,
          left: 20,
          background: emotionColors.bg,
          border: `1px solid ${emotionColors.border}`,
          color: emotionColors.text,
          padding: "10px 14px",
          borderRadius: "16px",
          fontSize: "14px",
          backdropFilter: "blur(8px)",
          zIndex: 9999
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ fontSize: "26px", lineHeight: 1 }}>{emotionEmoji}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, textTransform: "capitalize", lineHeight: 1.1 }}>
              {currentEmotion}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, lineHeight: 1.1 }}>
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
