import { useState } from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "../assests/logo.png";
import changePwdBg from "../assests/changepwdbg.png";
import changePwdBoard from "../assests/changepwdboard.png";
import eyeIcon from "../assests/eye.png";
import backNew from "../assests/backnew.png";

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast({
        variant: "destructive",
        title: "Password Required",
        description: "Enter and confirm your new password.",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Your new password must be at least 6 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Do Not Match",
        description: "The new password and confirm password must match.",
      });
      return;
    }

    setIsSaving(true);

    const { error } = await updatePassword(newPassword);

    if (error) {
      toast({
        variant: "destructive",
        title: "Password Update Failed",
        description: error.message,
      });
      setIsSaving(false);
      return;
    }

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setIsSaving(false);
    navigate("/settings");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${changePwdBg})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="AutiConnect"
        sx={{
          position: "absolute",
          top: { lg: "28px", xs: "22px" },
          left: { lg: "48px", xs: "24px" },
          width: { lg: "270px", xs: "210px" },
          objectFit: "contain",
        }}
      />

      <Box
        component="img"
        src={changePwdBoard}
        alt="Reset password board"
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: { lg: "650px", md: "575px", sm: "68vw", xs: "76vw" },
          height: { lg: "876px", md: "772px", sm: "auto", xs: "auto" },
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />

      <Typography
        sx={{
          position: "absolute",
          top: { lg: "31%", md: "30%", sm: "28%", xs: "26%" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { lg: "430px", md: "390px", sm: "54vw", xs: "62vw" },
          fontFamily: "Chewy",
          fontWeight: 400,
          fontSize: { lg: "34px", xs: "28px" },
          lineHeight: "90%",
          letterSpacing: "0%",
          color: "#5f2506",
          zIndex: 1,
        }}
      >
        Reset Password
      </Typography>

      <Box
        sx={{
          position: "absolute",
          top: { lg: "37%", md: "36%", sm: "33%", xs: "31%" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { lg: "400px", md: "360px", sm: "50vw", xs: "58vw" },
          display: "flex",
          flexDirection: "column",
          gap: { lg: 2.6, xs: 1.8 },
          zIndex: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              mb: 1,
              fontFamily: "Chewy",
              fontWeight: 400,
              fontSize: { lg: "18px", xs: "15px" },
              lineHeight: "90%",
              letterSpacing: "0%",
              color: "#7e3f0b",
            }}
          >
            Password
          </Typography>
          <TextField
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            fullWidth
            InputProps={{
              sx: {
                borderRadius: "12px",
                backgroundColor: "#783600",
                color: "#f5c37d",
                fontFamily: "Chewy",
                minHeight: { lg: "48px", xs: "40px" },
                "& input": {
                  color: "#f5c37d",
                  fontFamily: "Chewy",
                  fontSize: { lg: "18px", xs: "15px" },
                  py: 0.45,
                },
                "& fieldset": {
                  border: "none",
                },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="button"
                    onClick={() => setShowNewPassword((current) => !current)}
                    sx={{
                      minWidth: "auto",
                      p: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={eyeIcon}
                      alt="Toggle password visibility"
                      sx={{
                        width: { lg: "20px", xs: "17px" },
                        height: { lg: "20px", xs: "17px" },
                        objectFit: "contain",
                      }}
                    />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              mb: 1,
              fontFamily: "Chewy",
              fontWeight: 400,
              fontSize: { lg: "18px", xs: "15px" },
              lineHeight: "90%",
              letterSpacing: "0%",
              color: "#7e3f0b",
            }}
          >
            Confirm Password
          </Typography>
          <TextField
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            fullWidth
            InputProps={{
              sx: {
                borderRadius: "12px",
                backgroundColor: "#783600",
                color: "#f5c37d",
                fontFamily: "Chewy",
                minHeight: { lg: "48px", xs: "40px" },
                "& input": {
                  color: "#f5c37d",
                  fontFamily: "Chewy",
                  fontSize: { lg: "18px", xs: "15px" },
                  py: 0.45,
                },
                "& fieldset": {
                  border: "none",
                },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    sx={{
                      minWidth: "auto",
                      p: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={eyeIcon}
                      alt="Toggle confirm password visibility"
                      sx={{
                        width: { lg: "20px", xs: "17px" },
                        height: { lg: "20px", xs: "17px" },
                        objectFit: "contain",
                      }}
                    />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={isSaving}
          sx={{
            alignSelf: "center",
            width: "100%",
            borderRadius: "12px",
            background: "linear-gradient(180deg, #d97a08 0%, #b75d00 100%)",
            color: "#fff",
            fontFamily: "Chewy",
            fontSize: { lg: "22px", xs: "18px" },
            textTransform: "none",
            py: 0.8,
            boxShadow: "0 8px 18px rgba(122,61,16,0.28)",
            "&:hover": {
              background: "linear-gradient(180deg, #c86f08 0%, #a85400 100%)",
            },
            "&.Mui-disabled": {
              color: "#fff",
              opacity: 0.8,
            },
          }}
        >
          {isSaving ? "Saving..." : "Continue"}
        </Button>
      </Box>

      <Box
        component="img"
        src={backNew}
        alt="Back"
        onClick={() => navigate("/change-password")}
        sx={{
          position: "absolute",
          left: { lg: "42px", sm: "18px", xs: "14px" },
          bottom: { lg: "41px", sm: "27px", xs: "25px" },
          width: { lg: "210px", sm: "170px", xs: "150px" },
          height: { lg: "250px", sm: "210px", xs: "180px" },
          objectFit: "contain",
          cursor: "pointer",
          zIndex: 2,
          "&:hover": {
            transform: "scale(1.04)",
          },
        }}
      />
    </Box>
  );
}
