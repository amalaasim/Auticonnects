import fs from 'fs';

let code = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

// The new JSX for UploadShoe (just the return block)
const uploadShoeNewReturn = `  return (
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
        maxWidth: "80vw", 
        maxHeight: "80vh", 
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
  );`;

const verifyShoeNewReturn = `return (
  <Box
    sx={{
      cursor: \`url(\${click}) 22 22, auto\`,
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      pointerEvents: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box sx={{ 
      position: "relative", 
      width: "max(65cqw, 80cqh)",
      maxWidth: "80vw", 
      maxHeight: "80vh",
      aspectRatio: "620 / 800",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "column"
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
        }}
      />

      <Box sx={{
        position: "relative",
        width: "60%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 5,
        marginTop: "8%"
      }}>
        <Typography
          sx={{
            fontSize: "max(3cqw, 4.5cqh)",
            fontStyle: "normal",
            lineHeight: "1",
            fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
            color: "#5d2a00",
            opacity: 0.9,
          }}
        >
          {t("adult")}
        </Typography>
        <CloseIcon onClick={closeModal} sx={{
          fontSize: "max(3cqw, 4.5cqh)",
          color: "#5d2a00",
          cursor: "pointer"
        }} />
      </Box>

      {/* Main Content Area */}
      <Box sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "70%",
        marginTop: "10%",
        padding: "4%",
        zIndex: 10000,
        backgroundColor: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
        borderRadius: "10px",
        gap: "max(2cqw, 3cqh)"
      }}>
        <Typography
          sx={{
            fontSize: "max(1.8cqw, 2.7cqh)",
            fontStyle: "normal",
            lineHeight: "1.2",
            fontWeight: "800",
            fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
            color: "#883901",
            textAlign: "center",
            opacity: 0.9,
          }}>
          {t("shoeQuestion")}
        </Typography>

        <TextField
          variant="filled"
          InputProps={{ disableUnderline: true }}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter your answer"
          sx={{
            width: "80%",
            color: "#824D1F",
            backgroundColor: "#824D1F",
            borderRadius: "8px",
            mixBlendMode: "multiply",
            '& input': {
              color: '#c9742e',
              padding: "max(1cqw, 1.5cqh)",
              textAlign: "center",
              fontFamily: "Chewy",
              fontWeight: 400,
              fontSize: "max(1.8cqw, 2.7cqh)",
            }
          }}
        />
        
        {feedback && (
          <Typography sx={{ color: feedback === "Correct!" ? "green" : "red", fontFamily: "Chewy", fontSize: "max(1.2cqw, 1.8cqh)", marginTop: "-max(1cqw, 1cqh)" }}>
            {feedback}
          </Typography>
        )}

        <Box
          onClick={handleSubmit}
          sx={{
            width: "60%",
            height: "max(4cqw, 6cqh)",
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box component='img' src={contin} sx={{ position: "absolute", width: "100%", height: "100%", objectFit: "fill" }} />
          <Typography
            sx={{
              position: "relative",
              zIndex: 2,
              fontFamily: i18n.language === "ur" ? "JameelNooriNastaleeq" : "Chewy",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#482406",
              fontWeight: "900",
              fontSize: "max(1.8cqw, 2.7cqh)",
              pointerEvents: "none",
            }}
          >
            {t("Continue")}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);`;

// Precise replacement using getComponentBody to grab exact block scope,
// then substring replacement of the return block to keep exact function outer shell

function getComponentBody(c, startText) {
  let startIdx = c.indexOf(startText);
  let openBraces = 0;
  for(let i=startIdx; i<c.length; i++){
    if(c[i] === '{') openBraces++;
    if(c[i] === '}') openBraces--;
    if(openBraces === 0 && c[i] === '}' ) {
        return c.substring(startIdx, i+1);
    }
  }
}

// 1. Upload Shoe
let oldUploadShoe = getComponentBody(code, 'export function UploadShoe({ onClose }) {');
let repUStart = oldUploadShoe.indexOf('  return (\n    <motion.div');
let repUEnd = oldUploadShoe.lastIndexOf('}'); // inner closing before function closing brace
let innerUploadShoeOld = oldUploadShoe.substring(repUStart, repUEnd);
let innerUploadShoeNew = uploadShoeNewReturn + '\n';
let newUploadShoe = oldUploadShoe.replace(innerUploadShoeOld, innerUploadShoeNew);

// 2. Verify Shoe
let oldVerifyShoe = getComponentBody(code, 'function Verifyshoe({ closeModal, onVerified }) {');
let repVStart = oldVerifyShoe.indexOf('return(\n\n <Box');
let repVEnd = oldVerifyShoe.lastIndexOf('}'); // inner closing before function closing brace
let innerVerifyShoeOld = oldVerifyShoe.substring(repVStart, repVEnd);
let innerVerifyShoeNew = verifyShoeNewReturn + '\n';
let newVerifyShoe = oldVerifyShoe.replace(innerVerifyShoeOld, innerVerifyShoeNew);

// Final replacement
let finalCode = code.replace(oldUploadShoe, newUploadShoe).replace(oldVerifyShoe, newVerifyShoe);
fs.writeFileSync('src/component/learnobjshoe.js', finalCode, 'utf8');

