import fs from 'fs';

let text = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

const regex = /<Box sx=\{\{\s*position: "relative", \s*width: "max\(65cqw, 80cqh\)",[\s\S]*?\{t\("Continue"\)\}\s*<\/Typography>\s*<\/Box>\s*<\/Box>\s*<\/Box>/;

const new_verify = `<Box sx={{ 
        position: "relative", 
        width: "max(65cqw, 80cqh)",
        maxWidth: "80vw", 
        maxHeight: "80vh",
        aspectRatio: "620 / 800",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
            pointerEvents: "none"
          }}
        />

        {/* Gradient Container behind the blur */}
        <Box
          component="img"
          src={gradient}
          sx={{
            width: "55%",
            height: "40%",
            position: "absolute",
            top: "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <Box sx={{
          position: "absolute",
          top: "14%",
          left: "50%",
          transform: "translateX(-48%)",
          width: "70%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 5,
        }}>
          <Typography
            sx={{
              fontSize: "max(3.5cqw, 5cqh)",
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
            cursor: "pointer",
            marginRight: "-5%"
          }} />
        </Box>

        {/* Main Content Area */}
        <Box sx={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "75%",
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
              width: "90%",
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
              width: "70%",
              height: "max(5cqw, 7cqh)",
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
      </Box>`;

text = text.replace(regex, new_verify);
fs.writeFileSync('src/component/learnobjshoe.js', text);
console.log("Forced patch executed!");

