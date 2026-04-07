import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { hasParentalConsent } from "@/utils/onboarding";
import LoadingWheel from "@/components/LoadingWheel";

/**
 * Wraps routes that require authentication.
 * - If loading: shows a spinner.
 * - If not authenticated: redirects to /login.
 * - If authenticated but onboarding is incomplete: redirects to parental consent / child profile flow.
 * - Otherwise: renders children.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Check if a profile row exists for this user
    supabase
      .from("profiles")
      .select("id, child_name, child_age, favorite_character")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const onboardingComplete =
          !!data?.child_name &&
          data?.child_age != null &&
          !!data?.favorite_character;

        if (onboardingComplete) {
          setHasProfile(true);
        } else {
          const nextOnboardingRoute = hasParentalConsent(user.id)
            ? "/child-profile/name"
            : "/child-profile/consent";
          navigate(nextOnboardingRoute, { replace: true });
        }
        setProfileChecked(true);
      });
  }, [user, loading, navigate]);

  if (loading || (!profileChecked && user)) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080f01",
        }}
      >
        <LoadingWheel size={88} />
      </div>
    );
  }

  if (!user) return null;
  if (!hasProfile) return null;

  return children;
}

export default ProtectedRoute;
