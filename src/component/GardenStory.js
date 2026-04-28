import GardenApp from "../../playing-in-the-garden/src/App.jsx";
import i18n from "../i18n";
import { useEffect } from "react";
import { preloadImageAsset } from "@/lib/preloadImageAsset";
import { useFavoriteCharacter } from "@/hooks/useFavoriteCharacter";

const kidsPlayingGif = new URL(
  "../../playing-in-the-garden/public/characters/animations/kids playing.gif",
  import.meta.url
).href;
const settlementGif = new URL(
  "../../playing-in-the-garden/public/characters/animations/settelment.gif",
  import.meta.url
).href;
const dostiGif = new URL(
  "../../playing-in-the-garden/public/characters/animations/dosti.gif",
  import.meta.url
).href;

function GardenStory() {
  const language = i18n.language === "ur" ? "ur" : "en";
  const favoriteCharacter = useFavoriteCharacter();
  const gardenBackgroundSrc =
    favoriteCharacter === "bubbles"
      ? "/assets/Bubbles/bubbles_sgarden_bg.png"
      : "/backgrounds/garden.png";

  useEffect(() => {
    const gardenAssets = [
      gardenBackgroundSrc,
      "/characters/green-try.gif",
      "/characters/talking.gif",
      "/characters/crying_sheru.gif",
      "/characters/final.gif",
      "/assets/Bubbles/bubbles_clapping.gif",
      kidsPlayingGif,
      settlementGif,
      dostiGif,
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
  }, [gardenBackgroundSrc]);

  return (
    <GardenApp
      initialLanguage={language}
      gardenBackgroundSrc={gardenBackgroundSrc}
      favoriteCharacter={favoriteCharacter}
    />
  );
}

export default GardenStory;
