import * as React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function TopBarLogoutIcon({ src, alt = "Account", sx = {} }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onClick={handleLogout}
      sx={{
        ...sx,
        cursor: "pointer",
      }}
    />
  );
}
