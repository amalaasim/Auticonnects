import GardenApp from "../../playing-in-the-garden/src/App.jsx";
import i18n from "../i18n";

function GardenStory() {
  const language = i18n.language === "ur" ? "ur" : "en";

  return <GardenApp initialLanguage={language} />;
}

export default GardenStory;
