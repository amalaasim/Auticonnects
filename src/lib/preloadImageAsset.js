const imagePreloadCache = new Map();

export function preloadImageAsset(src) {
  if (!src) return Promise.resolve();
  if (imagePreloadCache.has(src)) return imagePreloadCache.get(src);

  const promise = new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    image.onload = done;
    image.onerror = done;
    image.src = src;

    if (typeof image.decode === "function") {
      image.decode().then(done).catch(done);
    }
  });

  imagePreloadCache.set(src, promise);
  return promise;
}
