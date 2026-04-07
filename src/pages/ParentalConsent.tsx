import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { hasParentalConsent, setParentalConsent } from "@/utils/onboarding";
import LoadingWheel from "@/components/LoadingWheel";
import logo from "../assests/logo.png";
import englishBackground from "../assests/english_bg.png";
import settingsBoard from "../assests/settingsboard.png";
import checkedBox from "../assests/checkedbox.png";
import uncheckedBox from "../assests/uncheckedbox.png";

export default function ParentalConsent() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (hasParentalConsent(user.id)) {
      navigate("/child-profile/name", { replace: true });
    }
  }, [authLoading, navigate, user]);

  const handleContinue = () => {
    if (!user) return;

    if (!accepted) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please confirm parental consent before continuing.",
      });
      return;
    }

    setParentalConsent(user.id, true);
    navigate("/child-profile/name");
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${englishBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <LoadingWheel size={92} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${englishBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: "5%",
          py: 1.25,
          background: "linear-gradient(10deg, rgba(5, 8, 7, 0.6) 0%, rgba(11,61,46,0.4) 100%)",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="AutiConnect"
          sx={{ width: { lg: "17%", md: "25%", sm: "29%", xs: "34%" }, mt: { lg: "0.5%", xs: "2%" } }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pt: { lg: 6, xs: 7 },
        }}
      >
        <Box
          component="img"
          src={settingsBoard}
          alt="Parental consent board"
          sx={{
            width: { lg: "46rem", md: "38rem", sm: "84vw", xs: "90vw" },
            maxWidth: "90vw",
            maxHeight: "calc(100vh - 110px)",
            objectFit: "contain",
          }}
        />

        <Typography
          sx={{
            position: "absolute",
            top: { lg: "calc(12.5% + 2px)", md: "calc(12% + 2px)", sm: "calc(11% + 2px)", xs: "calc(10.5% + 2px)" },
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "Chewy",
            fontSize: { lg: "32px", xs: "22px" },
            lineHeight: "90%",
            color: "#5f2506",
            zIndex: 1,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          Parental Consent
        </Typography>

        <Box
          sx={{
            position: "absolute",
            top: { lg: "calc(20% + 84px)", md: "calc(19% + 84px)", sm: "calc(17% + 84px)", xs: "calc(15% + 84px)" },
            width: { lg: "25rem", md: "21.5rem", sm: "58vw", xs: "64vw" },
            display: "flex",
            flexDirection: "column",
            gap: { lg: "1.15rem", xs: "0.8rem" },
          }}
        >
          <Typography sx={bodyTextSx}>
            To provide personalized support and interactive features, AutiConnect uses the device camera
            and microphone to understand your child's engagement and enable voice-based interaction during
            activities.
          </Typography>

          <Typography sx={bodyTextSx}>
            We do not store or share video or audio recordings. The camera and microphone are used only in
            real-time to enhance the learning experience.
          </Typography>

          <Typography sx={bodyTextSx}>
            Your child's privacy and safety are our priority. All data is handled securely.
          </Typography>

          <Box
            onClick={() => setAccepted((current) => !current)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { lg: "0.9rem", xs: "0.7rem" },
              mt: { lg: 1.5, xs: 1 },
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <Box
              component="img"
              src={accepted ? checkedBox : uncheckedBox}
              alt={accepted ? "Checked consent box" : "Unchecked consent box"}
              sx={{
                width: { lg: "58px", xs: "48px" },
                height: { lg: "58px", xs: "48px" },
                flexShrink: 0,
              }}
            />
            <Typography sx={{ ...bodyTextSx, flex: 1 }}>
              I am a parent/guardian and I agree to the use of camera and microphone for this purpose.
            </Typography>
          </Box>

          <Button
            type="button"
            onClick={handleContinue}
            variant="contained"
            sx={{
              mt: { lg: 1.2, xs: 0.8 },
              borderRadius: "12px",
              background: "linear-gradient(180deg, #d9790d 0%, #b95a00 100%)",
              color: "#fff",
              fontFamily: "Chewy",
              fontSize: { lg: "1.7rem", xs: "1.25rem" },
              textTransform: "none",
              boxShadow: "0 8px 18px rgba(117, 55, 0, 0.28)",
              "&:hover": {
                background: "linear-gradient(180deg, #e28317 0%, #bf6107 100%)",
              },
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const bodyTextSx = {
  fontFamily: "Chewy",
  fontSize: { lg: "1.02rem", xs: "0.82rem" },
  color: "#6c340c",
  lineHeight: 1.55,
};
