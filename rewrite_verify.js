import fs from 'fs';

let code = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

let start = code.indexOf('return(\n\n <Box');
let end = code.indexOf('  )\n}\n', start) + 5;
if(start === -1) start = code.indexOf('return (\n\n <Box');

let oldBlock = code.substring(start, end);

let newBlock = `return (
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
)`;

fs.writeFileSync('src/component/learnobjshoe.js', code.replace(oldBlock, newBlock));
