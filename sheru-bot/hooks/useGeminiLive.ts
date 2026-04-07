import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { arrayBufferToBase64, decodeAudioData, float32ToInt16, calculateVolume } from '../utils/audio';

interface UseGeminiLiveReturn {
  isConnected: boolean;
  isConnecting: boolean;
  isReady: boolean;
  aiVolume: number;
  userVolume: number;
  connect: () => Promise<void>;
  startConversation: () => Promise<void>;
  disconnect: () => void;
  sendPrompt: (text: string) => void;
  error: string | null;
}

export const useGeminiLive = (): UseGeminiLiveReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Volume state for visualization
  const [aiVolume, setAiVolume] = useState(0);
  const [userVolume, setUserVolume] = useState(0);

  // Audio Contexts
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const aiAnalyzerRef = useRef<AnalyserNode | null>(null);
  const userAnalyzerRef = useRef<AnalyserNode | null>(null);
  
  // Stream tracking
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const liveSessionRef = useRef<any>(null);
  const sessionOpenRef = useRef(false);
  const allowUserInputRef = useRef(false);
  const introAudioStartedRef = useRef(false);
  const introAudioFinishedRef = useRef(false);
  const silenceHangoverUntilRef = useRef(0);
  const introRetryTimeoutRef = useRef<number | null>(null);
  const introInputFallbackTimeoutRef = useRef<number | null>(null);
  const sessionReadyPromiseRef = useRef<Promise<void> | null>(null);
  const resolveSessionReadyRef = useRef<(() => void) | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputStreamRef = useRef<MediaStream | null>(null);
  
  // Animation frames
  const rafIdRef = useRef<number | null>(null);

  const getNextStarterTopic = () => {
    const topics = [
      "how their day was",
      "something they did today",
      "what food they ate today",
      "what made them smile today",
      "school",
      "family",
      "friends",
      "what they like to play",
      "their favorite animal",
      "their favorite cartoon",
    ];

    if (typeof window === "undefined") {
      return topics[0];
    }

    const storageKey = "sheru-bot:starter-topic-index";
    const rawIndex = window.sessionStorage.getItem(storageKey);
    const currentIndex = Number.parseInt(rawIndex || "-1", 10);
    const nextIndex = Number.isNaN(currentIndex)
      ? Math.floor(Math.random() * topics.length)
      : (currentIndex + 1) % topics.length;

    window.sessionStorage.setItem(storageKey, String(nextIndex));
    return topics[nextIndex];
  };

  const getNextIntroVariation = () => {
    const intros = [
      "Hello, my name is Sheru.",
      "Hello beta, I am Sheru.",
      "Hello, mera naam Sheru hai.",
      "Assalamualaikum beta, my name is Sheru.",
      "Hello jaan, I am Sheru.",
    ];

    if (typeof window === "undefined") {
      return intros[0];
    }

    const storageKey = "sheru-bot:intro-variation-index";
    const rawIndex = window.sessionStorage.getItem(storageKey);
    const currentIndex = Number.parseInt(rawIndex || "-1", 10);
    const nextIndex = Number.isNaN(currentIndex)
      ? Math.floor(Math.random() * intros.length)
      : (currentIndex + 1) % intros.length;

    window.sessionStorage.setItem(storageKey, String(nextIndex));
    return intros[nextIndex];
  };

  const getApiKey = () => {
    return import.meta.env.VITE_GEMINI_API_KEY || null;
  };

  const createSessionReadyPromise = () => {
    sessionReadyPromiseRef.current = new Promise<void>((resolve) => {
      resolveSessionReadyRef.current = resolve;
    });
    return sessionReadyPromiseRef.current;
  };

  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputStreamRef.current) {
      inputStreamRef.current.getTracks().forEach(track => track.stop());
      inputStreamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current = null;
    }
    liveSessionRef.current = null;
    sessionOpenRef.current = false;
    sessionReadyPromiseRef.current = null;
    resolveSessionReadyRef.current = null;
    allowUserInputRef.current = false;
    introAudioStartedRef.current = false;
    introAudioFinishedRef.current = false;
    silenceHangoverUntilRef.current = 0;
    if (introRetryTimeoutRef.current) {
      window.clearTimeout(introRetryTimeoutRef.current);
      introRetryTimeoutRef.current = null;
    }
    if (introInputFallbackTimeoutRef.current) {
      window.clearTimeout(introInputFallbackTimeoutRef.current);
      introInputFallbackTimeoutRef.current = null;
    }
    
    // Stop all playing sources
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsReady(false);
    setAiVolume(0);
    setUserVolume(0);
    nextStartTimeRef.current = 0;
  }, []);

  const connect = useCallback(async () => {
    if (sessionOpenRef.current) return;
    if (isConnecting) {
      if (sessionReadyPromiseRef.current) {
        await sessionReadyPromiseRef.current;
      }
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    createSessionReadyPromise();

    try {
      const apiKey = getApiKey();
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      
      // --- Output Audio Context (AI Voice) ---
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const outCtx = new AudioContextClass({ sampleRate: 24000 });
      audioContextRef.current = outCtx;
      
      // Create a master analyzer for the AI output
      const aiAnalyzer = outCtx.createAnalyser();
      aiAnalyzer.fftSize = 256;
      aiAnalyzer.connect(outCtx.destination);
      aiAnalyzerRef.current = aiAnalyzer;
      
      // --- Input Audio Context (User Mic) ---
      const inCtx = new AudioContextClass({ sampleRate: 16000 });
      inputAudioContextRef.current = inCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputStreamRef.current = stream;

      // User Volume Analyzer
      const userAnalyzer = inCtx.createAnalyser();
      userAnalyzer.fftSize = 256;
      userAnalyzerRef.current = userAnalyzer;
      
      const source = inCtx.createMediaStreamSource(stream);
      source.connect(userAnalyzer);

      // Start Volume Monitoring Loop
      const updateVolumes = () => {
        // AI Volume
        if (aiAnalyzerRef.current) {
            const data = new Uint8Array(aiAnalyzerRef.current.frequencyBinCount);
            aiAnalyzerRef.current.getByteFrequencyData(data);
            let sum = 0;
            for(let i=0; i<data.length; i++) sum+=data[i];
            const avg = sum / data.length;
            // Normalize (0-255 -> 0-1), boosted slightly
            setAiVolume(Math.min(1, (avg / 40))); 
        }

        // User Volume
        if (userAnalyzerRef.current) {
            const data = new Uint8Array(userAnalyzerRef.current.frequencyBinCount);
            userAnalyzerRef.current.getByteFrequencyData(data);
            let sum = 0;
            for(let i=0; i<data.length; i++) sum+=data[i];
            const avg = sum / data.length;
            setUserVolume(Math.min(1, (avg / 50)));
        }

        rafIdRef.current = requestAnimationFrame(updateVolumes);
      };
      updateVolumes();

      // Setup Processor for streaming audio to API
      const processor = inCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      source.connect(processor);
      processor.connect(inCtx.destination); // Destination is mute in most browsers for script processor inputs, but needed for flow

      // --- Connect to Gemini Live ---
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Opened');
            sessionOpenRef.current = true;
            setIsConnected(true);
            setIsConnecting(false);
            setIsReady(true);
            resolveSessionReadyRef.current?.();
            resolveSessionReadyRef.current = null;
          },
          onmessage: async (message) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              
              // Ensure we schedule after current time
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                ctx.currentTime
              );

              // Decode
              const dataBytes = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
              const audioBuffer = await decodeAudioData(dataBytes, ctx, 24000, 1);
              
              // Prepare Source
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              introAudioStartedRef.current = true;
              
              // Connect source to the Master AI Analyzer
              if (aiAnalyzerRef.current) {
                  source.connect(aiAnalyzerRef.current);
              } else {
                  source.connect(ctx.destination);
              }
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (
                  introAudioStartedRef.current &&
                  !introAudioFinishedRef.current &&
                  sourcesRef.current.size === 0
                ) {
                  introAudioFinishedRef.current = true;
                  allowUserInputRef.current = true;
                  if (introRetryTimeoutRef.current) {
                    window.clearTimeout(introRetryTimeoutRef.current);
                    introRetryTimeoutRef.current = null;
                  }
                  if (introInputFallbackTimeoutRef.current) {
                    window.clearTimeout(introInputFallbackTimeoutRef.current);
                    introInputFallbackTimeoutRef.current = null;
                  }
                  console.log('Sheru intro finished. Mic input enabled.');
                }
              };
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              console.log('Interrupted by user');
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              // Note: Volume will naturally drop as analyzer empties
            }
          },
          onclose: () => {
            console.log('Session closed');
            cleanup();
          },
          onerror: (err) => {
            console.error('Session error:', err);
            setError("Connection error.");
            cleanup();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            // "Aoede" is the 'Expressive' voice, often female/child-like. 
            // Fallback: "Kore" or "Zephyr".
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } }
          },
          // Updated persona for a child-like/friendly bot
          systemInstruction: `
You are Sheru, a warm bilingual robot companion for autistic children.
Speak softly, gently, and briefly.
Mainly respond in a natural mix of English and Urdu.
Automatically detect the language the child is speaking.
If the child speaks in Sindhi, Pashto, or another language, first understand and follow that language naturally instead of forcing Urdu.
Do not guess based on a few familiar words only; listen for the overall language and respond in the detected language, while still keeping Sheru's warm style.
Use short simple sentences, one idea at a time.
Ask only one small gentle question at the end.
Be encouraging, calm, and playful.
Never scold or overwhelm.
Sheru should always start the conversation first with a short self-introduction before expecting the child to speak.
If the child seems sad, angry, scared, lonely, or hurt:
first validate, then reassure, then offer one tiny coping step, then ask one gentle follow-up.
Do not ignore emotional disclosures and do not switch topics too fast after a hurt feeling.
Use varied child-friendly topics like day, food, school, family, friends, animals, games, cartoons, and play.
Avoid repeating the same opener or question wording.
If the child is unclear, ask them to say it in a smaller way.
If asked to remind the child to look at the screen, be very sweet and playful.
Always sound natural, caring, and child-friendly.
`,
        }
      });

      sessionRef.current = sessionPromise;
      sessionPromise.then((session) => {
        liveSessionRef.current = session;
      }).catch(() => {
        liveSessionRef.current = null;
      });

      // Handle Input Streaming
      processor.onaudioprocess = (e) => {
        if (!sessionOpenRef.current || !liveSessionRef.current || !allowUserInputRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const volume = calculateVolume(inputData);
        const now = performance.now();

        if (volume > 0.03) {
          silenceHangoverUntilRef.current = now + 900;
        }

        if (volume <= 0.03 && now > silenceHangoverUntilRef.current) {
          return;
        }

        // Convert Float32 to Int16 PCM
        const pcmData = float32ToInt16(inputData);
        // Create Base64
        const uint8Data = new Uint8Array(pcmData.buffer);
        const base64Data = arrayBufferToBase64(uint8Data.buffer as ArrayBuffer);

        liveSessionRef.current.sendRealtimeInput({
          media: {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Data
          }
        });
      };

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect");
      setIsConnecting(false);
      cleanup();
    }
    if (sessionReadyPromiseRef.current) {
      await sessionReadyPromiseRef.current;
    }
  }, [isConnecting, cleanup]);

  const startConversation = useCallback(async () => {
    await connect();

    allowUserInputRef.current = false;
    introAudioStartedRef.current = false;
    introAudioFinishedRef.current = false;
    silenceHangoverUntilRef.current = 0;

    if (introRetryTimeoutRef.current) {
      window.clearTimeout(introRetryTimeoutRef.current);
      introRetryTimeoutRef.current = null;
    }
    if (introInputFallbackTimeoutRef.current) {
      window.clearTimeout(introInputFallbackTimeoutRef.current);
      introInputFallbackTimeoutRef.current = null;
    }

    const sendIntroPrompt = (session: any) => {
      const starterTopic = getNextStarterTopic();
      const introLine = getNextIntroVariation();
      session.sendRealtimeInput({
        text: `Start the conversation yourself. Begin with this exact self-introduction line: "${introLine}" Then ask one short warm opening question about ${starterTopic}. Keep it gentle, natural, age-appropriate, and brief. Session token: ${Date.now()}.`
      });
    };

    if (sessionRef.current) {
      sessionRef.current.then((session: any) => {
        if (!introAudioStartedRef.current) {
          sendIntroPrompt(session);
        }
      }).catch((err: any) => {
        console.error('Error sending initial greeting:', err);
      });
    }

    introRetryTimeoutRef.current = window.setTimeout(() => {
      if (sessionRef.current && !introAudioStartedRef.current) {
        sessionRef.current.then((session: any) => {
          if (!introAudioStartedRef.current) {
            sendIntroPrompt(session);
          }
        }).catch((err: any) => {
          console.error('Error retrying initial greeting:', err);
        });
      }
    }, 2200);

    introInputFallbackTimeoutRef.current = window.setTimeout(() => {
      if (!introAudioFinishedRef.current) {
        allowUserInputRef.current = true;
        console.log('Intro fallback timeout reached. Mic input enabled.');
      }
    }, 4200);
  }, [connect]);

  // Function to send a text prompt to the AI
  const sendPrompt = useCallback((text: string) => {
    if (liveSessionRef.current && isConnected) {
      console.log('Sending prompt to AI:', text);
      try {
        liveSessionRef.current.sendRealtimeInput({
          text: text
        });
      } catch (err) {
        console.error('Error sending prompt:', err);
      }
    }
  }, [isConnected]);

  return {
    isConnected,
    isConnecting,
    isReady,
    aiVolume,
    userVolume,
    connect,
    startConversation,
    disconnect: cleanup,
    sendPrompt,
    error
  };
};
