import React, { useState, useEffect, useRef } from 'react';
import { useGeminiLive } from './hooks/useGeminiLive';
import { useWebEyeGaze } from './hooks/useWebEyeGaze';
import { useEmotionDetection } from './hooks/useEmotionDetection';
import { CartoonAvatar } from './components/CartoonAvatar';
import { TopBar } from './components/TopBar';
import { BottomControls } from './components/BottomControls';
import { EmotionDisplay } from './components/EmotionDisplay';
import { SessionStorage } from './utils/sessionStorage';
import { assetUrl } from './utils/assetUrls';

const App: React.FC = () => {
  const { connect, disconnect, isConnected, isConnecting, aiVolume, userVolume, error, sendPrompt } = useGeminiLive();
  const { isLooking, videoRef } = useWebEyeGaze();
  
  // Emotion detection using the same video ref as gaze detection
  const { currentEmotion, emotionConfidence, emotionCounts, sessionData } = useEmotionDetection(
    videoRef,
    isConnected
  );

  const [currentAiText, setCurrentAiText] = useState("");
  
  // Track AI speaking state
  const [wasAiTalking, setWasAiTalking] = useState(false);
  const gazeReminderSentRef = useRef(false);
  const gazeReminderCountRef = useRef(0);
  const sessionStartTimeRef = useRef<number>(0);
  const lastEmotionRef = useRef<string>("neutral");
  const emotionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = async () => {
    sessionStartTimeRef.current = Date.now();
    await connect();
  };

  const handleStop = () => {
    // Save session data before disconnecting
    if (isConnected && sessionStartTimeRef.current > 0) {
      const sessionDuration = Date.now() - sessionStartTimeRef.current;
      
     SessionStorage.saveSession({
        ...sessionData,
        endTime: Date.now(),
        emotionCounts,
        gazeReminders: gazeReminderCountRef.current,
        conversationDuration: sessionDuration,
      });
      
      console.log('📊 Session saved with emotion data');
    }
    
    disconnect();
    setCurrentAiText("");
    gazeReminderSentRef.current = false;
    gazeReminderCountRef.current = 0;
    sessionStartTimeRef.current = 0;
  };

  const isAiTalking = aiVolume > 0.05;
  const isUserTalking = userVolume > 0.05 && !isAiTalking;

  useEffect(() => {
    if (isAiTalking && !currentAiText) {
      setCurrentAiText("Hello! I'm Mimi. How are you?");
    } else if (!isAiTalking) {
      setCurrentAiText("");
    }
  }, [isAiTalking]);

  // Eye-gaze monitoring logic
  useEffect(() => {
    if (!isConnected) {
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
        
        // Send a gentle reminder to Mimi immediately
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

  }, [isAiTalking, wasAiTalking, isLooking, isConnected, sendPrompt]);

  // Emotion-based interaction logic
  useEffect(() => {
    if (!isConnected || !currentEmotion) return;

    // If emotion changes significantly and AI is not talking
    if (currentEmotion !== lastEmotionRef.current && !isAiTalking) {
      lastEmotionRef.current = currentEmotion;
      
      // Clear any existing timeout
      if (emotionChangeTimeoutRef.current) {
        clearTimeout(emotionChangeTimeoutRef.current);
      }
      
      // Wait a bit to see if emotion is stable, then react
      emotionChangeTimeoutRef.current = setTimeout(() => {
        if (!isAiTalking && isConnected) {
          console.log(`😊 Emotion changed to: ${currentEmotion}. Informing Mimi...`);
          
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
  }, [currentEmotion, isAiTalking, isConnected, sendPrompt]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-6 overflow-hidden relative">
      
      {/* Hidden video element for eye-gaze tracking and emotion detection */}
      <video 
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline
        autoPlay
      />

      {/* Emotion Display - Top Right (below all buttons) */}
      <div className="absolute top-28 right-6 z-50">
        {isConnected && (
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

      <main className="flex-1 flex items-center justify-center w-full max-w-2xl relative z-10">
        <CartoonAvatar 
          isTalking={isAiTalking}
          volume={aiVolume}
          isListening={isUserTalking}
          userVolume={userVolume}
          currentText={currentAiText}
          isConnected={isConnected}
        />
      </main>

      <footer className="w-full max-w-4xl flex flex-col items-center gap-6 z-10">
        <BottomControls
          isConnected={isConnected}
          isConnecting={isConnecting}
          onStart={handleStart}
          onStop={handleStop}
        />

        {/* Gaze Status Indicator */}
        {isConnected && (
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
      </footer>
    </div>
  );
};

export default App;
