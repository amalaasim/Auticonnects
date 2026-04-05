const isEmbeddedInParentApp = window.location.pathname.startsWith("/sheru-bot/");

export function assetUrl(path: string) {
  if (path.startsWith("/models/")) {
    return path;
  }

  return isEmbeddedInParentApp ? `/sheru-bot${path}` : path;
}

export function appEntryUrl(path: string) {
  return isEmbeddedInParentApp ? `.${path}` : path;
}
