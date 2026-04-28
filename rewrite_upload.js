import fs from 'fs';

let code = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

// Replacement for the ENTIRE return block of UploadShoe
let start = code.indexOf('  return (\n    <motion.div');
let end = code.indexOf('  );\n}\n', start) + 6;

let oldBlock = code.substring(start, end);

let newBlock = `  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10001,
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ 
        cursor: \`url(\${click}) 122 122, auto\`, 
        position: "relative", 
        width: "max(65cqw, 80cqh)",
        maxWidth: "80vw", // Limits 80% screen width
        maxHeight: "80vh", // Limits 80% screen height
        aspectRatio: "620 / 800",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Background Image Board */}
        <Box
          component="img"
          src={pegion}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "fill",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Close Button */}
        <CloseIcon
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "5%",
            right: "8%",
            fontSize: "max(3cqw, 4.5cqh)",
            color: "#5d2a00",
            zIndex: 4,
            cursor: "pointer",
          }}
        />

        {/* Gradient Container */}
        <Box
          component="img"
          src={gradient}
          sx={{
            width: "55%",
            height: "40%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -10%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Upload Box inside gradient relative position */}
        <Box
          onClick={handleUploadClick}
          sx={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            height: "22%",
            backgroundColor: "#783600",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3,
            overflow: "hidden"
          }}
        >
          {previewImage ? (
            <Box component="img" src={previewImage} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <Typography sx={{ color: "#c9742e", textAlign: "center", fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq":"chewy", 
                     fontSize: { lg: i18n.language === "ur" ? "max(2.5cqw, 3.5cqh)" : "max(1.8cqw, 2.5cqh)", sm: "max(1.5cqw, 2.2cqh)" } }}>
              <FileUploadIcon sx={{ fontSize: "max(3cqw, 4cqh)" }} /><br />{t("upload")}
            </Typography>
          )}
        </Box>

        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

        {/* Continue / Another Buttons Container */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50%",
            height: "8%",
            display: "flex",
            flexDirection: "row",
            gap: "5%",
            zIndex: 3,
          }}
        >
          {/* Continue Button */}
          <Box
            onClick={handleContinue}
            sx={{
              flex: previewImage ? 1 : "0 0 100%",
              height: "100%",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box component="img" src={contin} sx={{ position: "absolute", width: "100%", height: "100%", objectFit: "fill" }} />
            <Typography sx={{
              position: "relative",
              zIndex: 2,
              color: "#482406",
              fontWeight: "900",
              fontSize: "max(1.8cqw, 2.5cqh)",
              fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
              pointerEvents: "none",
            }}>{t("Continue")}</Typography>
          </Box>

          {/* Another Button (only if image uploaded) */}
          {previewImage && (
            <Box
              onClick={handleAnotherClick}
              sx={{
                flex: 1,
                height: "100%",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box component="img" src={contin} sx={{ position: "absolute", width: "100%", height: "100%", objectFit: "fill" }} />
              <Typography sx={{
                position: "relative",
                zIndex: 2,
                color: "#482406",
                fontWeight: "900",
                fontSize: "max(1.4cqw, 2cqh)",
                fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
                pointerEvents: "none",
              }}>{t("another")}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}`;

fs.writeFileSync('src/component/learnobjshoe.js', code.replace(oldBlock, newBlock));
