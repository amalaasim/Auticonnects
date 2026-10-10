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
        position: "relative",
        overflow: "hidden",
        containerType: "size",
      }}
    >
      <Box
        component="img"
        src={englishBackground}
        alt=""
        aria-hidden="true"
        sx={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          objectPosition: "center",
        }}
      />
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          height: "10cqh",
          px: "3.5cqh",
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0.656) 6.88%, rgba(0, 0, 0, 0) 94.56%)",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="AutiConnect"
          sx={{
            height: "5.8cqh",
            width: "auto",
            maxWidth: "32cqh",
            objectFit: "contain",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "5%",
          [PHONE_LANDSCAPE]: { bottom: "2dvh" },
          [PHONE_PORTRAIT]: { bottom: "auto", top: "50%", transform: "translate(-50%, -45%)" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "min(92vw, calc(80vh * 986 / 821))",
            aspectRatio: "986 / 821",
            containerType: "size",
            [PHONE_LANDSCAPE]: { width: "min(96vw, calc(94dvh * 986 / 821))" },
            [PHONE_PORTRAIT]: { width: "104vw" },
          }}
        >
          <Box
            component="img"
            src={settingsBoard}
            alt="Parental consent board"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />

          <Typography
            sx={{
              position: "absolute",
              top: "6.7%",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "Chewy",
              fontSize: "4.6cqh",
              [PHONE]: { fontSize: "5.4cqh" },
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
              top: "28.5%",
              left: "22.5%",
              width: "55%",
              display: "flex",
              flexDirection: "column",
              gap: "1.75cqh",
              // Phones: wider text column bounded by the paper; the notice scrolls while the
              // checkbox and Continue button stay visible at the bottom.
              [PHONE]: { top: "26%", bottom: "11.5%", left: "21%", width: "59%", gap: "1.4cqh" },
            }}
          >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1.75cqh",
              [PHONE]: {
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
                pr: "1.2cqh",
                gap: "1.4cqh",
                WebkitOverflowScrolling: "touch",
                // Fade the last line so it reads as "scroll for more" rather than cut off.
                maskImage: "linear-gradient(to bottom, #000 80%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, #000 80%, transparent)",
                pb: "2cqh",
              },
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
          </Box>

          <Box
            onClick={() => setAccepted((current) => !current)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1.3cqh",
              mt: "1.8cqh",
              cursor: "pointer",
              userSelect: "none",
              flexShrink: 0,
              [PHONE]: { mt: "0.6cqh" },
            }}
          >
            <Box
              component="img"
              src={accepted ? checkedBox : uncheckedBox}
              alt={accepted ? "Checked consent box" : "Unchecked consent box"}
              sx={{
                width: "7.2cqh",
                height: "7.2cqh",
                flexShrink: 0,
                transform: "translateY(-0.4cqh)",
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
              mt: "1.5cqh",
              borderRadius: "1.25cqh",
              background: "linear-gradient(180deg, #d9790d 0%, #b95a00 100%)",
              color: "#fff",
              fontFamily: "Chewy",
              fontSize: "3.1cqh",
              minHeight: "7.2cqh",
              flexShrink: 0,
              [PHONE]: { mt: "0.4cqh", minHeight: "9cqh", fontSize: "3.8cqh" },
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
    </Box>
  );
}

// Same breakpoints as the Tailwind `mland` / `mport` / `phone` screens.
const PHONE_LANDSCAPE = "@media (orientation: landscape) and (max-height: 500px)";
const PHONE_PORTRAIT = "@media (orientation: portrait) and (max-width: 600px)";
const PHONE = `${PHONE_LANDSCAPE}, (orientation: portrait) and (max-width: 600px)`;

const bodyTextSx = {
  fontFamily: "Chewy",
  fontSize: "2.45cqh",
  color: "#6c340c",
  lineHeight: 1.55,
  [PHONE]: { fontSize: "3.4cqh", lineHeight: 1.4 },
};
