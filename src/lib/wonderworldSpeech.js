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
    recognitionLang: config.recognitionLang,
    targetWord: language === "ur" ? config.targetWordByLanguage.ur : config.targetWordByLanguage.en,
    matches: config.matches,
  };
}
