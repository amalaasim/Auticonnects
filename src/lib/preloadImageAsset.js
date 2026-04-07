export function preloadImageAsset(src) {
  if (!src) return Promise.resolve();

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (typeof image.decode === "function") {
      image.decode().then(resolve).catch(resolve);
    }
  });
}
