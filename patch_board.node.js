import fs from 'fs';

let text = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

const regex = /\{\/\* Gradient Container behind the blur \*\/\}\s*<Box\s*component="img"\s*src=\{gradient\}/;

const newString = `{/* The missing bird layer on top of the board */}
          <Box
            component="img"
            src={pegion}
            sx={{
              position: "absolute",
              top: "12%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "48%",
              height: "60%",
              zIndex: 2,
              pointerEvents: "none"
            }}
          />

          {/* Gradient Container behind the blur */}
          <Box
            component="img"
            src={gradient}`;

text = text.replace(regex, newString);
fs.writeFileSync('src/component/learnobjshoe.js', text);
console.log("Restored the second pigeon board layer!");
