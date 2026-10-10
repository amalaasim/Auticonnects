import { useEffect } from "react";

// Temporarily off so both orientations can be designed and tested. Flip back to true to re-enable.
const ROTATE_PROMPT_ENABLED = false;

// Full-screen prompt asking touch-device users to turn the device sideways.
// Visibility is driven purely by CSS (see .rotate-device-overlay in index.css),
// so it appears instantly on rotation without a React re-render.
export default function RotateDeviceOverlay() {
  useEffect(() => {
    if (!ROTATE_PROMPT_ENABLED) return;
    // Browsers only honour this in fullscreen / installed-PWA mode; elsewhere it rejects quietly.
    const orientation = typeof window !== "undefined" ? window.screen?.orientation : null;
    orientation?.lock?.("landscape").catch(() => {});
  }, []);

  if (!ROTATE_PROMPT_ENABLED) return null;

  return (
    <div className="rotate-device-overlay" role="alertdialog" aria-live="polite" aria-label="Please rotate your device">
      <svg className="rotate-device-overlay__phone" viewBox="0 0 64 100" aria-hidden="true">
        <rect x="4" y="4" width="56" height="92" rx="10" fill="#fff8e7" stroke="#824D1F" strokeWidth="5" />
        <rect x="11" y="15" width="42" height="64" rx="3" fill="#8fd3f4" />
        <circle cx="32" cy="87" r="3.5" fill="#824D1F" />
      </svg>
      <p className="rotate-device-overlay__title">Please rotate your phone</p>
      <p className="rotate-device-overlay__text">Auti-Connects plays best sideways, in landscape mode.</p>
    </div>
  );
}
