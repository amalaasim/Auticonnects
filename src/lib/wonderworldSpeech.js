function normalizeWords(value) {
  return value
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z\u0600-\u06ff]/gi, "").toLowerCase())
    .filter(Boolean);
}

function buildTranscriptMatcher(variants, predicate) {
  return (transcripts) =>
    transcripts.some((value) => {
      const normalized = value.replace(/[\s\-_.']/g, "");
      const words = normalizeWords(value);

      if (variants.some((variant) => normalized.includes(variant) || words.includes(variant))) {
        return true;
      }

      return words.some(predicate);
    });
}

const cookieVariants = [
  "cookie",
  "cooki",
  "kuki",
  "kookie",
  "biscuit",
  "biscut",
  "biskit",
  "biskut",
  "biscoot",
  "biscuet",
  "bisquite",
  "biskoot",
  "biscot",
  "biscot",
  "biscot",
  "baskit",
  "biskat",
  "biscat",
  "biscut",
  "biscoot",
  "biscuitt",
  "بسکٹ",
  "بسکِٹ",
  "بِسکٹ",
  "بسکِت",
  "بیسکٹ",
  "بِسکِت",
  "بِسکِٹ",
  "بسکُٹ",
  "بسکٹٹ",
  "بِسکُٹ",
  "بیسکِٹ",
  "بسکٹا",
  "بسکٹو",
];

const carVariants = [
  "car",
  "cars",
  "carr",
  "care",
  "cur",
  "kar",
  "kaar",
  "gari",
  "gaari",
  "ghari",
  "ghaari",
  "ghaaree",
  "ghari",
  "ghaadi",
  "gaady",
  "garri",
  "gaaree",
  "گاڑی",
  "گاڑي",
];

const ballVariants = [
  "ball",
  "bal",
  "boll",
  "bawl",
  "bol",
  "baal",
  "gaind",
  "gaen",
  "gain",
  "gand",
  "gaindh",
  "gainda",
  "gaynd",
  "gayn",
  "ghaind",
  "ghaenda",
  "گیند",
  "گیندا",
];

const shoeVariants = [
  "shoe",
  "shoes",
  "sho",
  "show",
  "shoo",
  "shu",
  "joota",
  "jootay",
  "jootey",
  "joote",
  "jutay",
  "jutey",
  "joota",
  "jootae",
  "jotay",
  "jotey",
  "jootie",
  "juti",
  "jooti",
  "joota",
  "jootae",
  "jootai",
  "جوتا",
  "جوتے",
];

export const WONDERWORLD_SPEECH_CONFIG = {
  cookie: {
    targetWordByLanguage: {
      en: "cookie",
      ur: "biscuit",
    },
    recognitionLang: "en-US",
    attemptMode: "firstResultOnce",
    permissionMode: "requireMicPermission",
    resultMode: "allResults",
    controlMode: "allowCancel",
    matches: buildTranscriptMatcher(cookieVariants, (word) => {
      if (word.length > 8) return false;
      if (/^cook/.test(word)) return true;
      if (/^bisc/.test(word)) return true;
      if (/^bisk/.test(word)) return true;
      if (/^بسک/.test(word)) return true;
      if (/^بِسک/.test(word)) return true;
      return false;
    }),
  },
  car: {
    targetWordByLanguage: {
      en: "car",
      ur: "gaari",
    },
    recognitionLang: "en-US",
    attemptMode: "finalResultOnly",
    permissionMode: "noPermissionCheck",
    resultMode: "currentResultOnly",
    controlMode: "allowCancel",
    matches: buildTranscriptMatcher(carVariants, (word) => {
      if (word.length > 7) return false;
      if (/^[ck].*(r|re|rr)$/.test(word)) return true;
      if (/^ca/.test(word)) return true;
      if (/^ka/.test(word)) return true;
      if (/^gar/i.test(word)) return true;
      if (/^ghar/i.test(word)) return true;
      if (/^gha/i.test(word)) return true;
      return false;
    }),
  },
  ball: {
    targetWordByLanguage: {
      en: "ball",
      ur: "gaind",
    },
    recognitionLang: "en-US",
    attemptMode: "finalResultOnly",
    permissionMode: "requireMicPermission",
    resultMode: "currentResultOnly",
    controlMode: "allowCancel",
    matches: buildTranscriptMatcher(ballVariants, (word) => {
      if (word.length > 7) return false;
      if (/^ba/.test(word)) return true;
      if (/^bo/.test(word)) return true;
      if (/^gai/.test(word)) return true;
      if (/^gay/.test(word)) return true;
      if (/^gha/.test(word)) return true;
      if (/^گی/.test(word)) return true;
      return false;
    }),
  },
  shoe: {
    targetWordByLanguage: {
      en: "shoes",
      ur: "jootay",
    },
    recognitionLang: "en-US",
    attemptMode: "finalResultOnly",
    permissionMode: "requireMicPermission",
    resultMode: "currentResultOnly",
    controlMode: "allowCancel",
    matches: buildTranscriptMatcher(shoeVariants, (word) => {
      if (word.length > 8) return false;
      if (/^sho/.test(word)) return true;
      if (/^shu/.test(word)) return true;
      if (/^joo/.test(word)) return true;
      if (/^jut/.test(word)) return true;
      if (/^جو/.test(word)) return true;
      return false;
    }),
  },
};

export function getWonderworldSpeechConfig(moduleKey, language) {
  const config = WONDERWORLD_SPEECH_CONFIG[moduleKey];
  if (!config) {
    throw new Error(`Unsupported WonderWorld speech key: ${moduleKey}`);
  }

  return {
    attemptMode: config.attemptMode,
    controlMode: config.controlMode,
    recognitionLang: config.recognitionLang,
    permissionMode: config.permissionMode,
    resultMode: config.resultMode,
    targetWord: language === "ur" ? config.targetWordByLanguage.ur : config.targetWordByLanguage.en,
    matches: config.matches,
  };
}

async function ensureMicPermission() {
  if (!navigator.mediaDevices?.getUserMedia) return true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (_) {
    return false;
  }
}

function extractTranscripts(event) {
  return Array.from(event.results || []).flatMap((result) =>
    Array.from(result || []).map((item) => item.transcript.toLowerCase())
  );
}

function extractCurrentResultTranscripts(event) {
  const result = event.results[event.resultIndex] || event.results[0];
  return Array.from(result || []).map((item) => item.transcript.toLowerCase());
}

export function listenForWonderworldWord({
  moduleKey,
  language,
  recognitionRef,
  retryListenRef,
  speechVerifiedRef,
  cancelListenRef,
  allowListeningRef,
  startListeningRef,
  setSpeechVerified,
  setSpeechStatus,
  incrementVoiceTries,
  onMistake,
  retryDelay = 800,
}) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    let attemptCounted = false;
    let mistakePlayedForCurrentAttempt = false;
    const {
      attemptMode,
      controlMode,
      permissionMode,
      recognitionLang,
      resultMode,
      targetWord,
      matches,
    } = getWonderworldSpeechConfig(moduleKey, language);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechStatus("Speech recognition not supported on this device.");
      reject(new Error("SpeechRecognition not supported"));
      return;
    }

    if (cancelListenRef) {
      cancelListenRef.current = false;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = recognitionLang;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;
    recognition.continuous = false;

    const clearRetry = () => {
      if (retryListenRef?.current) {
        clearTimeout(retryListenRef.current);
        retryListenRef.current = null;
      }
    };

    const shouldAllowListening = () => !allowListeningRef || allowListeningRef.current;

    const startListening = async () => {
      clearRetry();
      mistakePlayedForCurrentAttempt = false;

      if (
        controlMode === "allowCancel" &&
        ((cancelListenRef && cancelListenRef.current) || !shouldAllowListening())
      ) {
        return;
      }

      setSpeechVerified(false);
      setSpeechStatus(`Listening… say “${targetWord}”`);

      if (permissionMode === "requireMicPermission") {
        const hasPermission = await ensureMicPermission();
        if (!hasPermission) {
          setSpeechStatus("Microphone permission blocked.");
          return;
        }
      }

      try {
        recognition.start();
      } catch (_) {
        // Ignore browser errors when start is called twice.
      }
    };

    if (startListeningRef) {
      startListeningRef.current = startListening;
    }

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex] || event.results[0];
      const transcripts =
        resultMode === "currentResultOnly"
          ? extractCurrentResultTranscripts(event)
          : extractTranscripts(event);
      const transcript = transcripts[0] || "";
      const isFinalResult = Boolean(result?.isFinal);

      if (attemptMode === "everyResult") {
        incrementVoiceTries();
      } else if (attemptMode === "finalResultOnly") {
        if (result?.isFinal) {
          incrementVoiceTries();
        }
      } else if (!attemptCounted) {
        incrementVoiceTries();
        attemptCounted = true;
      }

      setSpeechStatus(`Heard: ${transcript}`);

      if (matches(transcripts)) {
        setSpeechVerified(true);
        speechVerifiedRef.current = true;
        setSpeechStatus(`Great! You said ${targetWord}.`);
        clearRetry();
        resolved = true;
        recognition.stop();
        resolve();
        return;
      }

      setSpeechVerified(false);
      speechVerifiedRef.current = false;
      if (!isFinalResult) {
        setSpeechStatus(transcript ? `Heard: ${transcript}` : `Listening… say “${targetWord}”`);
        return;
      }

      if (transcript && !mistakePlayedForCurrentAttempt) {
        mistakePlayedForCurrentAttempt = true;
        onMistake?.();
      }
      setSpeechStatus(`Try again: say “${targetWord}”.`);
    };

    recognition.onerror = () => {
      if (
        controlMode === "allowCancel" &&
        ((cancelListenRef && cancelListenRef.current) || !shouldAllowListening())
      ) {
        return;
      }
      setSpeechStatus("Couldn't hear you. Try again.");
    };

    recognition.onend = () => {
      if (controlMode === "allowCancel" && cancelListenRef && cancelListenRef.current) {
        resolved = true;
        resolve();
        return;
      }

      if (
        controlMode === "allowCancel"
          ? !resolved && shouldAllowListening()
          : !speechVerifiedRef.current
      ) {
        retryListenRef.current = setTimeout(() => {
          startListening();
        }, retryDelay);
      }
    };

    recognitionRef.current = recognition;

    if (controlMode === "allowCancel") {
      if (shouldAllowListening()) {
        startListening();
      }
      return;
    }

    startListening();
  });
}

export function cleanupWonderworldListening({
  recognitionRef,
  retryListenRef,
}) {
  if (retryListenRef?.current) {
    clearTimeout(retryListenRef.current);
    retryListenRef.current = null;
  }

  if (recognitionRef?.current) {
    try {
      recognitionRef.current.stop();
    } catch (_) {
      // Ignore redundant stop calls.
    }
  }
}

export function stopWonderworldListening({
  recognitionRef,
  retryListenRef,
  cancelListenRef,
  allowListeningRef,
}) {
  if (cancelListenRef) {
    cancelListenRef.current = true;
  }

  if (allowListeningRef) {
    allowListeningRef.current = false;
  }

  cleanupWonderworldListening({
    recognitionRef,
    retryListenRef,
  });
}
