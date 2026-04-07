import GardenApp from "../../playing-in-the-garden/src/App.jsx";
import i18n from "../i18n";
import { useEffect } from "react";
import { preloadImageAsset } from "@/lib/preloadImageAsset";

function GardenStory() {
  const language = i18n.language === "ur" ? "ur" : "en";

  useEffect(() => {
    const gardenAssets = [
      "/backgrounds/garden.png",
      "/characters/green-try.gif",
      "/characters/talking.gif",
      "/characters/final.gif",
      "/characters/AliAndFatima.png",
      "/characters/AliAndFatima-Push.png",
      "/characters/AliAndFatima-Cry.png",
      "/characters/AliAndFatima-Pick.png",
      "/characters/AliAndFatima-Reconcile.png",
    ];

    const preload = () => {
      gardenAssets.forEach((asset) => {
        void preloadImageAsset(asset);
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1000 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preload, 100);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return <GardenApp initialLanguage={language} />;
}

export default GardenStory;
