import { supabase } from "@/integrations/supabase/client";

export const GAME_IMAGE_CONFIG = {
  cookie: {
    localStorageKey: "uploadedCookie",
    route: "/showCookie",
  },
  car: {
    localStorageKey: "uploadedCar",
    route: "/car",
  },
  shoe: {
    localStorageKey: "uploadedShoe",
    route: "/showShoe",
  },
  ball: {
    localStorageKey: "uploadedball",
    route: "/showball",
  },
};

function getConfig(gameKey) {
  const config = GAME_IMAGE_CONFIG[gameKey];
  if (!config) {
    throw new Error(`Unsupported game image key: ${gameKey}`);
  }
  return config;
}

export function getCachedGameImage(gameKey) {
  if (typeof window === "undefined") return null;
  const { localStorageKey } = getConfig(gameKey);
  return window.localStorage.getItem(localStorageKey);
}

export function cacheGameImage(gameKey, imageData) {
  if (typeof window === "undefined") return;
  const { localStorageKey } = getConfig(gameKey);

  if (imageData) {
    window.localStorage.setItem(localStorageKey, imageData);
    return;
  }

  window.localStorage.removeItem(localStorageKey);
}

export async function loadSavedGameImage(gameKey) {
  const cachedImage = getCachedGameImage(gameKey);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return cachedImage;
  }

  const { data: savedImage, error: fetchError } = await supabase
    .from("game_uploaded_images")
    .select("image_data")
    .eq("user_id", data.user.id)
    .eq("game_key", gameKey)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  const imageData = savedImage?.image_data || null;
  if (imageData) {
    cacheGameImage(gameKey, imageData);
  }

  return imageData || cachedImage;
}

export async function saveGameImage(gameKey, imageData) {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("User must be signed in to save a game image.");
  }

  const { error: upsertError } = await supabase
    .from("game_uploaded_images")
    .upsert(
      {
        user_id: data.user.id,
        game_key: gameKey,
        image_data: imageData,
      },
      { onConflict: "user_id,game_key" }
    );

  if (upsertError) {
    throw upsertError;
  }

  cacheGameImage(gameKey, imageData);
  return imageData;
}
