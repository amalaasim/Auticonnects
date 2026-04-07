import React, { useState, useEffect, useRef } from 'react';
import { useGeminiLive } from './hooks/useGeminiLive';
import { useWebEyeGaze } from './hooks/useWebEyeGaze';
import { useEmotionDetection } from './hooks/useEmotionDetection';
import { CartoonAvatar } from './components/CartoonAvatar';
import { TopBar } from './components/TopBar';
import { BottomControls } from './components/BottomControls';
import { EmotionDisplay } from './components/EmotionDisplay';
import { assetUrl } from './utils/assetUrls';
import { finishSession, startSession } from '../src/lib/analytics/client';
import { normalizeFocusMetrics } from '../src/lib/analytics/mappers';

const App: React.FC = () => {
  const { connect, startConversation, disconnect, isConnected, isConnecting, isReady, aiVolume, userVolume, error, sendPrompt } = useGeminiLive();
  const { isLooking, videoRef } = useWebEyeGaze();
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
      setCurrentAiText("Hello! I'm Sheru.");
    } else if (!isAiTalking) {
      setCurrentAiText("");
    }
  }, [isAiTalking]);

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
      if (!isLooking && !gazeReminderSentRef.current && isConnected) {
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
      } else if (gazeReminderSentRef.current) {
        console.log('⏳ Child not looking but cooldown active - skipping reminder');
      }
    }

    // Track AI talking state
    setWasAiTalking(isAiTalking);

  }, [isAiTalking, wasAiTalking, isLooking, hasStartedConversation, sendPrompt]);

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
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-6 overflow-hidden relative">
      
      {/* Hidden video element for eye-gaze tracking and emotion detection */}
      <video 
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline
        autoPlay
      />

      {/* Emotion Display - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-50">
        {hasStartedConversation && (
          <EmotionDisplay emotion={currentEmotion} confidence={emotionConfidence} />
        )}
      </div>

      {/* Full Screen Background */}
      <div className="absolute inset-0 -z-10">
        <img 
          src={assetUrl("/images/background.png")} 
          alt="Arctic Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            filter: 'none',
            opacity: 1
          }}
        />
      </div>

      <TopBar />

      <main
        className="flex-1 flex items-end justify-center w-full max-w-2xl relative z-10"
        style={{ transform: 'translateY(50px)' }}
      >
        <CartoonAvatar 
          isTalking={isAiTalking}
          volume={aiVolume}
          isListening={isUserTalking}
          userVolume={userVolume}
          currentText={currentAiText}
          isConnected={hasStartedConversation}
        />
      </main>

      <footer
        className="w-full max-w-4xl flex flex-col items-center gap-6 z-10"
        style={{ transform: 'translateY(50px)' }}
      >
        <BottomControls
          isConnected={hasStartedConversation}
          isConnecting={isConnecting}
          isReady={isReady}
          onStart={handleStart}
          onStop={handleStop}
        />

        <div className="min-h-[68px] flex flex-col items-center gap-3">
          {/* Gaze Status Indicator */}
          {hasStartedConversation && (
            <div className={`px-3 py-1 border rounded text-xs ${
              isLooking 
                ? 'bg-green-500/10 border-green-500/30 text-green-200' 
                : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
            }`}>
              {isLooking ? '👀 Looking at screen' : '👁️ Not looking'}
            </div>
          )}

          {/* Error Messages */}
          {error && (
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg text-sm">
              Voice Error: {error}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
