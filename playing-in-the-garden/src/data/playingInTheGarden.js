export const playingInTheGarden = [
  {
    id: 1,
    text: {
      en: "Ali and Fatima were playing happily in the garden.",
      ur: "علی اور فاطمہ باغ میں خوشی خوشی کھیل رہے تھے۔",
    },
    askEmotion: false,
    nextScene: 2,
    audio: {
      en: "/audio/en/scene1.mp3",
      ur: "/audio/ur/scene1.m4a"
    }
  },
  {
    id: 2,
    text: {
      en: "How is Fatima feeling?",
      ur: " فاطمہ کیسا محسوس کر رہی ہے؟",
    },
    askEmotion: true,
    emotionOptions: ["Happy", "Crying", "Angry", "Neutral"],
    correctEmotion: "Happy",
    nextScene: 3,
    audio: {
      en: "/audio/en/scene2.mp3",
      ur: "/audio/ur/scene2.m4a"
    }
  },
  {
    id: 3,
    text: {
      en: "Suddenly, Ali pushed Fatima. She starts crying.",
      ur: "اچانک علی نے فاطمہ کو دھکا دیا۔ فاطمہ رونے لگی۔",
    },
    askEmotion: false,
    nextScene: 4,
    audio: {
      en: "/audio/en/scene3.mp3",
      ur: "/audio/ur/scene3.m4a"
    }
  },
  {
    id: 4,
    text: {
      en: "How is Fatima feeling after being\npushed by Ali?",
      ur: "علی کے دھکا دینے کے بعد فاطمہ کو اب کیسا لگ رہا ہے؟",
    },
    askEmotion: true,
    emotionOptions: ["Happy", "Crying", "Angry", "Neutral"],
    correctEmotion: "Crying",
    nextScene: 5,
    audio: {
      en: "/audio/en/scene4.mp3",
      ur: "/audio/ur/scene4.m4a"
    }
  },
  {
    id: 5,
    text: {
      en: "Ali realized his mistake and helped Fatima stand up.",
      ur: " علی کو اپنی غلطی کا احساس ہوا اور اس نے فاطمہ کو اٹھنے میں مدد دی۔",
    },
    askEmotion: false,
    nextScene: 6,
    audio: {
      en: "/audio/en/scene5.mp3",
      ur: "/audio/ur/scene5.m4a"
    }
  },
  {
    id: 6,
    text: {
      en: "Ali and Fatima start playing again.\nHow is Fatima feeling now?",
      ur: "علی اور فاطمہ دوبارہ کھیلنے لگے۔ اب فاطمہ کو کیسا لگ رہا ہے؟"
    },
    askEmotion: true,
    emotionOptions: ["Happy", "Crying", "Angry", "Neutral"],
    correctEmotion: "Happy",
    nextScene: null,
    audio: {
      en: "/audio/en/scene6.mp3",
      ur: "/audio/ur/scene6.m4a"
    }
  }
];
