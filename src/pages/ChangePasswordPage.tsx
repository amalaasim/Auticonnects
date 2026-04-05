import { useState } from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "../assests/logo.png";
import changePwdBg from "../assests/changepwdbg.png";
import layer1Board from "../assests/layer1board.png";
import layer2Board from "../assests/layer2board.png";
import blurLayerBoard from "../assests/blurlayerboard.png";
import backNew from "../assests/backnew.png";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  const handleContinue = async () => {
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "We could not verify your account. Please log in again.",
      });
      return;
    }

    if (!currentPassword.trim()) {
      toast({
        variant: "destructive",
        title: "Password Required",
        description: "Enter your current password to continue.",
      });
      return;
    }

    setIsCheckingPassword(true);

    const { error } = await signIn(user.email, currentPassword);

    if (error) {
      toast({
        variant: "destructive",
        title: "Incorrect Password",
        description: error.message,
      });
    } else {
      toast({
        title: "Password Confirmed",
        description: "Your current password is correct.",
      });
      navigate("/new-password");
    }

    setIsCheckingPassword(false);
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
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={layer1Board}
          alt="Change password board base"
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: { lg: "42rem", md: "34rem", sm: "80vw", xs: "86vw" },
            maxHeight: "74vh",
            objectFit: "contain",
          }}
        />

        <Box
          component="img"
          src={layer2Board}
          alt="Change password board front"
          sx={{
            position: "absolute",
            top: { lg: "calc(11.5% + 170px)", md: "calc(11.5% + 170px)", sm: "calc(11% + 170px)", xs: "calc(10.5% + 170px)" },
            width: { lg: "42rem", md: "35rem", sm: "82vw", xs: "88vw" },
            maxHeight: "66vh",
            objectFit: "contain",
            pointerEvents: "none",
          }}
        />

        <Box
          component="img"
          src={blurLayerBoard}
          alt="Change password board blur layer"
          sx={{
            position: "absolute",
            top: { lg: "calc(11.5% + 205px)", md: "calc(11.5% + 205px)", sm: "calc(11% + 205px)", xs: "calc(10.5% + 205px)" },
            ml: { lg: "10px", md: "10px", sm: "10px", xs: "10px" },
            width: { lg: "29rem", md: "24rem", sm: "56vw", xs: "62vw" },
            maxHeight: "66vh",
            objectFit: "contain",
            pointerEvents: "none",
          }}
        />

        <Typography
          sx={{
            position: "absolute",
            top: { lg: "calc(31% + 70px)", md: "calc(29% + 70px)", sm: "calc(27% + 70px)", xs: "calc(25% + 70px)" },
            left: { lg: "calc(50% + 10px)", md: "50%", sm: "50%", xs: "50%" },
            transform: "translateX(-50%)",
            fontFamily: "Chewy",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: { lg: "38px", xs: "28px" },
            lineHeight: "90%",
            letterSpacing: "0%",
            color: "#5f2506",
            pointerEvents: "none",
          }}
        >
          Change Password
        </Typography>

        <Box
          sx={{
            position: "absolute",
            top: { lg: "50%", md: "47%", sm: "43%", xs: "40%" },
            width: { lg: "24rem", md: "21rem", sm: "48vw", xs: "56vw" },
            ml: { lg: "30px", md: "30px", sm: "30px", xs: "30px" },
            display: "flex",
            flexDirection: "column",
            gap: { lg: 2.2, xs: 1.4 },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Chewy",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: { lg: "18px", xs: "15px" },
              lineHeight: "90%",
              letterSpacing: "0%",
              color: "#7e3f0b",
            }}
          >
            Enter your current password
          </Typography>

          <TextField
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            fullWidth
            InputProps={{
              sx: {
                borderRadius: "12px",
                backgroundColor: "#783600",
                color: "#f5c37d",
                fontFamily: "Chewy",
                minHeight: { lg: "50px", xs: "42px" },
                "& input": {
                  color: "#f5c37d",
                  fontFamily: "Chewy",
                  fontSize: { lg: "18px", xs: "15px" },
                  py: 0.55,
                },
                "& fieldset": {
                  border: "none",
                },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    sx={{
                      minWidth: "auto",
                      p: 0,
                      color: "#f5c37d",
                      fontFamily: "Chewy",
                      textTransform: "none",
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="button"
            onClick={handleContinue}
            disabled={isCheckingPassword}
            sx={{
              alignSelf: "center",
              width: { lg: "24rem", md: "21rem", sm: "48vw", xs: "56vw" },
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
            {isCheckingPassword ? "Checking..." : "Continue"}
          </Button>
        </Box>
      </Box>

      <Box
        component="img"
        src={backNew}
        alt="Back"
        onClick={() => navigate("/settings")}
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
