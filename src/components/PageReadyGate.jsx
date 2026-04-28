import { useEffect, useRef, useState } from "react";
import LoadingWheel from "./LoadingWheel";

const MAX_WAIT_MS = 9000;
const SETTLE_DELAY_MS = 120;

function getBackgroundUrls(root) {
  const urls = new Set();
  const elements = [root, ...root.querySelectorAll("*")];
  const urlPattern = /url\((['"]?)(.*?)\1\)/g;

  elements.forEach((element) => {
    const backgroundImage = window.getComputedStyle(element).backgroundImage;
    if (!backgroundImage || backgroundImage === "none") return;

    let match;
    while ((match = urlPattern.exec(backgroundImage)) !== null) {
      if (match[2]) urls.add(match[2]);
    }
  });

  return [...urls];
}

function waitForImageElement(image) {
  image.loading = "eager";

  if (image.complete && image.naturalWidth > 0) {
    return typeof image.decode === "function"
      ? image.decode().catch(() => {})
      : Promise.resolve();
  }

  return new Promise((resolve) => {
    const done = () => {
      image.removeEventListener("load", done);
      image.removeEventListener("error", done);
      resolve();
    };

    image.addEventListener("load", done, { once: true });
    image.addEventListener("error", done, { once: true });
  }).then(() =>
    typeof image.decode === "function" ? image.decode().catch(() => {}) : undefined
  );
}

function preloadImageUrl(src) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const image = new Image();
    const done = () => resolve();

    image.onload = done;
    image.onerror = done;
    image.src = src;

    if (image.complete) {
      done();
    }
  }).then(() => {
    const image = new Image();
    image.src = src;
    return typeof image.decode === "function" ? image.decode().catch(() => {}) : undefined;
  });
}

function waitForVisibleAssets(root) {
  const imageElements = [...root.querySelectorAll("img")];
  const backgroundUrls = getBackgroundUrls(root);
  const fontPromise = document.fonts?.ready?.catch?.(() => {}) || Promise.resolve();

  return Promise.all([
    ...imageElements.map(waitForImageElement),
    ...backgroundUrls.map(preloadImageUrl),
    fontPromise,
  ]);
}

export default function PageReadyGate({ children, routeKey }) {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    let cancelled = false;
    let generation = 0;
    let settleTimer = null;
    let maxWaitTimer = null;

    setIsReady(false);

    const reveal = () => {
      if (!cancelled) setIsReady(true);
    };

    const scheduleCheck = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        const currentGeneration = ++generation;
        waitForVisibleAssets(root).then(() => {
          if (!cancelled && currentGeneration === generation) {
            reveal();
          }
        });
      }, SETTLE_DELAY_MS);
    };

    const observer = new MutationObserver(scheduleCheck);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset", "style", "class"],
    });

    requestAnimationFrame(scheduleCheck);
    maxWaitTimer = window.setTimeout(reveal, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(settleTimer);
      window.clearTimeout(maxWaitTimer);
    };
  }, [routeKey]);

  return (
    <div style={{ position: "relative", minHeight: "100dvh" }}>
      {!isReady && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#080f01",
          }}
        >
          <LoadingWheel size={84} />
        </div>
      )}
      <div
        ref={containerRef}
        aria-busy={!isReady}
        style={{
          minHeight: "100dvh",
          visibility: isReady ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
