import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/email-verified",
  "/child-profile/name",
  "/child-profile/age",
  "/child-profile/character",
  "/child-profile/language",
]);

function GameLogout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || AUTH_ROUTES.has(location.pathname)) return null;

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      title="Sign Out"
      style={{
        position: "fixed",
        top: "12px",
        right: "12px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "rgba(0,0,0,0.55)",
        color: "#fff",
        border: "1.5px solid rgba(255,255,255,0.25)",
        borderRadius: "8px",
        padding: "6px 12px",
        fontSize: "13px",
        fontWeight: 600,
        backdropFilter: "blur(6px)",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(0,0,0,0.8)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(0,0,0,0.55)")
      }
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign Out
    </button>
  );
}

export default GameLogout;
