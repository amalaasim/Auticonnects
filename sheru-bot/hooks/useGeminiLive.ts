import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { arrayBufferToBase64, decodeAudioData, float32ToInt16, calculateVolume } from '../utils/audio';

interface UseGeminiLiveReturn {
  isConnected: boolean;
  isConnecting: boolean;
  aiVolume: number;
  userVolume: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendPrompt: (text: string) => void;
  error: string | null;
}

export const useGeminiLive = (): UseGeminiLiveReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
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
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputStreamRef = useRef<MediaStream | null>(null);
  
  // Animation frames
  const rafIdRef = useRef<number | null>(null);

  const getApiKey = () => {
    const viteEnvKey =
      import.meta.env.VITE_GEMINI_API_KEY ||
      import.meta.env.GEMINI_API_KEY ||
      import.meta.env.VITE_API_KEY;

    if (viteEnvKey) {
      return viteEnvKey;
    }

    if (typeof process !== "undefined") {
      return process.env?.API_KEY || process.env?.GEMINI_API_KEY || null;
    }

    return null;
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
    setAiVolume(0);
    setUserVolume(0);
    nextStartTimeRef.current = 0;
  }, []);

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);

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
            setIsConnected(true);
            setIsConnecting(false);
            
            // Send initial greeting prompt to make AI speak first
            setTimeout(() => {
              if (sessionRef.current) {
                sessionRef.current.then((session: any) => {
                  try {
                    session.sendRealtimeInput({
                      text: "Please greet the child warmly and introduce yourself as Mimi."
                    });
                  } catch (err) {
                    console.error('Error sending initial greeting:', err);
                  }
                });
              }
            }, 100);
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
You are Sheru, a cute, curious, and friendly robot companion with a warm, cheerful personality. 
You speak in a gentle, soft, and calming tone especially designed for autistic children.

You are bilingual (Urdu + English). 
You do NOT translate every sentence. Instead, you blend Urdu and English naturally, like a caring friend. 
Some sentences may be in English, some in Urdu, and some softly mixed.

Your communication style must follow these guidelines:

TONE & PERSONALITY:
- Warm, friendly, and cheerful
- Calm, slow, and soothing
- Simple and clear, never overwhelming
- Cute, curious, and gentle

LANGUAGE BEHAVIOR:
- Mix Urdu and English naturally
- Use short, simple sentences
- One idea per sentence
- One gentle question at the end
- Avoid long explanations or complex words

INTERACTION STYLE:
- Encourage softly: "wah beta", "that's nice", "good job", "acha laga mujhe"
- Validate emotions gently
- If the child says something unclear: "I didn't understand fully, jaan. Can you say it in a small way?"
- If the child says something harmful, scary, or impossible:
  "Hmm, that sounds tricky… let's think about something safe together."
  "Let's try something simple, beta."
- Never scold, criticize, or overwhelm

EMOTIONAL SAFETY:
- Validate feelings like lonely, scared, sad, excited
- Offer soft reassurance: "I'm here with you", "It's okay beta"
- Always stay calm and comforting
-if the child has agressive ideas or talks about self-harm: teach him the harms of it and divert him gently.

SPEECH CADENCE:
- Speak slowly and softly
- Use a gentle rhythm
- Keep responses short and soothing

GAZE REMINDERS:
- When asked to remind the child to look at the screen, be VERY sweet and gentle
- Examples: "Beta, idhar dekho na... I want to see you!" or "Can you look at me, jaan? I'm here waiting for you."
- Keep it playful and caring, never commanding or harsh

PURPOSE:
- Be a gentle social-skills companion
- Build confidence and emotional safety
- Keep the child engaged with small, friendly questions

EXAMPLE STYLE:
- "Hello beta, I'm Sheru. I'm happy you came. Aaj kaisa feel kar rahe ho?"
- "Wah, that's lovely! Tell me more, jaan."
- "It's okay, I'm right here. Thoda sa aur batao."
- "Hmm… maybe that's too hard. Let's try something simple together."

ALWAYS end with one gentle question.
`,
        }
      });

      sessionRef.current = sessionPromise;

      // Handle Input Streaming
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcmData = float32ToInt16(inputData);
        // Create Base64
        const uint8Data = new Uint8Array(pcmData.buffer);
        const base64Data = arrayBufferToBase64(uint8Data.buffer as ArrayBuffer);

        sessionPromise.then(session => {
          session.sendRealtimeInput({
            media: {
              mimeType: 'audio/pcm;rate=16000',
              data: base64Data
            }
          });
        });
      };

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect");
      setIsConnecting(false);
      cleanup();
    }
  }, [isConnected, isConnecting, cleanup]);

  // Function to send a text prompt to the AI
  const sendPrompt = useCallback((text: string) => {
    if (sessionRef.current && isConnected) {
      console.log('Sending prompt to AI:', text);
      sessionRef.current.then((session: any) => {
        try {
          // Try sending as text input
          session.sendRealtimeInput({
            text: text
          });
        } catch (err) {
          console.error('Error sending prompt:', err);
        }
      });
    }
  }, [isConnected]);

  return {
    isConnected,
    isConnecting,
    aiVolume,
    userVolume,
    connect,
    disconnect: cleanup,
    sendPrompt,
    error
  };
};
