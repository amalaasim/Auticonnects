import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import learnbg from '../assests/verify_shoe.png';
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import click from '../assests/click.png';
import pegion from '../assests/pegion.png';
import FileUploadIcon from '@mui/icons-material/FileUpload';

export function UploadShoe() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fileInputRef = React.useRef(null);
  const [imageFile, setImageFile] = React.useState(null);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Convert file to Base64 and store in localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("uploadedShoe", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: "100vh" }}
    >
      <Box sx={{ cursor: `url(${click}) 122 122, auto` }}>
        <Box
          sx={{
            backgroundImage: `url(${learnbg})`,
            width: "100%",
            height: "733px",
            backgroundSize: "cover",
            position: "relative",
          }}
        >
          <Box sx={{ backgroundColor: "#090909", width: "100%", height: "733px", opacity: "0.85", pointerEvents: "none" }} />
          <Box component="img" src={pegion} sx={{ width: "35%", height: "77%", marginLeft: "32%", marginTop: "-42%", position: "absolute" }} />

          {/* Upload Box */}
          <Box
            onClick={handleUploadClick}
            sx={{
              position: "absolute",
              marginTop: "-23.4%",
              marginLeft: "36%",
              width: "25%",
              height: "18%",
              backgroundColor: "#783600",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "#c9742e", textAlign: "center" }}>
              <FileUploadIcon sx={{ fontSize: 40 }} /><br />{t("upload")}
            </Typography>
          </Box>

          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

          <Button
            variant="contained"
            sx={{ backgroundColor: "#d56509", color: "#482406", position: "absolute", marginTop: "-14%", marginLeft: "36.2%", width: "25%" }}
            onClick={() => {
              const savedImage = localStorage.getItem("uploadedShoe");
              if (savedImage) {
                navigate("/showShoe", { state: { uploadedImage: savedImage } });
              } else {
                alert("Please upload an image first");
              }
            }}
          >
            {t("Continue")}
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
