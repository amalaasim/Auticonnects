export function getParentalConsentStorageKey(userId: string) {
  return `parental-consent:${userId}`;
}

export function hasParentalConsent(userId: string) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(getParentalConsentStorageKey(userId)) === "true";
}

export function setParentalConsent(userId: string, accepted: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getParentalConsentStorageKey(userId), accepted ? "true" : "false");
}
