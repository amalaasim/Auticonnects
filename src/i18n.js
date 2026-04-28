import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      wonderWorldTitle: "WonderWorld Games",
      wonderWorldDesc: {
        line1: "Explore everyday objects in a fun",
        line2: "and magical way."
      },
      socialStoryTitle: "Social Storyland",
      socialStoryDesc: {
        line1: "Practice real-life situations in a calm,",
        line2: "guided way."
      },
      roccoTitle: "Say hi to your friend Sheru! He loves chatting.",
      roccoDesc: {
        line1: "Share your day with him, your feelings, ",
        line2: "or anything on your mind."
      },
  "objectLearningTitle": "Object Learning Game",
  "objectIdentificationTitle": "Object Identification Game",
  "backButton": "Back",
  "selectObjectTitle": "Select object to learn",
   "back": "Back",
    "next": "Next",
    "repeatAfterMe": "Repeat after me Cookie",
    "learnToSay": "Learn to say \"Cookie\"",
      "question": "Can you find Cookie?",
    "book": "Book",
    "moon": "Moon",
    "cookie": "Cookie",
        "good":"Yes! you did it ",
"try":"Play Again",
    "repeatAfterMeCar": "Repeat after me Car",
"saycar":"Learn to say \"Car\"",
 "questioncar":"Can you find Car?",
        "car":"Car",
        "ball":"Ball",
        "shoes":"Shoes",
         "sayShoes":"Learn to say \"Shoes\"",
        "repeatAfterMeShoes": "Repeat after me Shoes",
                "questionShoes":"Can you find Shoes?",
            "sayBall":"Learn to say \"Ball\"",
        "repeatAfterMeBall": "Repeat after me Ball",
                        "questionBall":"Can you find Ball?",
             "uploadpicture":"Upload Picture",
             "adult": "Adult Verification",
"shoeQuestion":"How many zeros are there in a thousand?",
              "Submit": "Submit",
                            "upload":"Upload picture from your device",
                            "Continue":"Continue",
                              "another":"Upload another picture",
                                          "your":"These are your shoes",
            "yourcook":"These are your Cookies",
                          "yourball":"This is your ball",
                                        "yourcar":"This is your car"









    }
  },
  ur: {
    translation: {
      wonderWorldTitle: "ونڈر ورلڈ گیمز",
      wonderWorldDesc: {
        line1: "روزمرہ اشیاء کو تفریحی انداز میں دریافت کریں",
        line2: "اور جادوئی طریقے سے سیکھیں"
      },
      socialStoryTitle: "سوشل اسٹوری لینڈ",
      socialStoryDesc: {
        line1: "حقیقی زندگی کے حالات کو پُرسکون انداز میں",
        line2: "سیکھیں"
      },
      roccoTitle: "اپنے دوست شیرو کو ہیلو کہیں! اسے باتیں کرنا پسند ہے۔",
      roccoDesc: {
        line1: " اس کے ساتھ اپنا دن، احساسات",
        line2: "اور خیالات شیئر کریں۔"
      },
  "objectLearningTitle": "چیزیں سیکھنے کا کھیل",
  "objectIdentificationTitle": "چیزیں پہچاننے کا کھیل",
  "backButton": "واپس",
  "selectObjectTitle": "سیکھنے کے لیے چیز منتخب کریں",
 "back": " واپس",
    "next": "آگے",
    "repeatAfterMe": "میرے بعد دہرائیں ",
"learnToSay": "بسکٹ کہنا سیکھیں" ,
"question": "بسکٹ ڈھونڈیں",
    "book": "کتاب",
    "moon": "چاند",
    "cookie": "بسکٹ",
        "good":"شاباش!",
  "try":"دوبارہ کھیلیں",
  "saycar":"گاڑی کہنا سیکھیں",
      "repeatAfterMeCar": "میرے بعد دہرائیں ",
       "questioncar":"گاڑی ڈھونڈیں",
  "car":"گاڑی",
  "ball":"گیند",
  "shoes":"جوتے",
   "repeatAfterMeShoes": "میرے بعد دہرائیں ",
    "sayShoes":"جوتے کہنا سیکھیں",
        "questionShoes":"جوتے تلاش کریں",
         "repeatAfterMeBall": "میرے بعد دہرائیں ",
    "sayBall":"گیند کہنا سیکھیں",
       "questionBall":"گیند تلاش کریں",
  "uploadpicture":"تصویر اپ لوڈ کریں",
"adult": "بالغ تصدیق",
"shoeQuestion":"ہزار میں کتنے صفر ہیں؟",
              "Submit": "جمع کریں",
                            "upload":"اپنی ڈیوائس سے تصویر اپ لوڈ کریں",
                                        "Continue":"جاری رکھیں",
            "another":"مزید تصویر اپلوڈ کریں",
            "your":"یہ آپ کے جوتے ہیں",
            "yourcook":"یہ آپ کا بسکٹ ہے",
                          "yourball":"یہ آپ کی گیند ہے",
              "yourcar":"یہ آپ کی گاڑی ہے"


   }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:
      typeof window !== "undefined"
        ? window.localStorage.getItem("app_language") || "en"
        : "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("app_language", lng);
  }
});

export default i18n;
