import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Wraps routes that require authentication.
 * - If loading: shows a spinner.
 * - If not authenticated: redirects to /login.
 * - If authenticated but no profile yet: redirects to /child-profile/name.
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
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setHasProfile(true);
        } else {
          navigate("/child-profile/name", { replace: true });
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
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid rgba(255,255,255,0.2)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;
  if (!hasProfile) return null;

  return children;
}

export default ProtectedRoute;
