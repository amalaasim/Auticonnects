import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useFavoriteCharacter() {
  const { user } = useAuth();
  const [favoriteCharacter, setFavoriteCharacter] = React.useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem("favoriteCharacter") || "";
  });

  React.useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const loadFavoriteCharacter = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("favorite_character")
        .eq("user_id", user.id)
        .maybeSingle();

      if (ignore || !data?.favorite_character) return;

      setFavoriteCharacter(data.favorite_character);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("favoriteCharacter", data.favorite_character);
      }
    };

    loadFavoriteCharacter();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  return favoriteCharacter;
}
