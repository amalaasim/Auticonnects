import * as React from "react";
import { Box } from "@mui/material";
import volumeOnNew from "../assests/volumeon-new.png";
import volumeOffNew from "../assests/volumeoff-new.png";

const MUSIC_SELECTOR = 'audio[data-background-music="true"]';
const STORAGE_KEY = "app_music_muted";

function applyMuteState(muted) {
  const audioElements = document.querySelectorAll(MUSIC_SELECTOR);
  audioElements.forEach((audio) => {
    audio.muted = muted;
  });
}

export default function TopBarVolumeIcon({ sx = {}, alt = "Volume" }) {
  const [muted, setMuted] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  });

  React.useEffect(() => {
    applyMuteState(muted);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, String(muted));
    }
  }, [muted]);

  const handleToggle = () => {
    setMuted((current) => !current);
  };

  return (
    <Box
      component="img"
      src={muted ? volumeOffNew : volumeOnNew}
      alt={alt}
      onClick={handleToggle}
      sx={{
        ...sx,
        cursor: "pointer",
      }}
    />
  );
}
