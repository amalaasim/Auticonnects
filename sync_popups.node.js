import fs from 'fs';

const shoeCode = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

// Extract the two components from learnobjshoe.js
const regex = /(export function UploadShoe[\s\S]*?)export default function Learnobjshoe\(\) /;
const match = shoeCode.match(regex);

if (!match) {
  console.error("Could not extract components from learnobjshoe.js");
  process.exit(1);
}

let newComponents = match[1];

// Make the cookie-specific replacements inside the extracted code
newComponents = newComponents.replace(/getCachedGameImage\("shoe"\)/g, 'getCachedGameImage("cookie")');
newComponents = newComponents.replace(/loadSavedGameImage\("shoe"\)/g, 'loadSavedGameImage("cookie")');
newComponents = newComponents.replace(/saveGameImage\("shoe"/g, 'saveGameImage("cookie"');
newComponents = newComponents.replace(/GAME_IMAGE_CONFIG\.shoe\.route/g, 'GAME_IMAGE_CONFIG.cookie.route');
newComponents = newComponents.replace(/Failed to save shoe image/g, 'Failed to save cookie image');
newComponents = newComponents.replace(/Failed to load shoe image/g, 'Failed to load cookie image');
// Maybe shoeQuestion is correct for shoe and cookieQuestion exists? I'll change it just in case they added a cookieQuestion
newComponents = newComponents.replace(/t\("shoeQuestion"\)/g, 't("cookieQuestion")');

// Now read learnobject.js and replace its UploadShoe and Verifyshoe components
let objectCode = fs.readFileSync('src/component/learnobject.js', 'utf8');

const replaceRegex = /(export function UploadShoe[\s\S]*?)function Learnobj\(\) /;
if (!objectCode.match(replaceRegex)) {
  console.error("Could not find the target area in learnobject.js");
  process.exit(1);
}

objectCode = objectCode.replace(replaceRegex, newComponents + '\nfunction Learnobj() ');

fs.writeFileSync('src/component/learnobject.js', objectCode);
console.log("Successfully synced popups from learnobjshoe over to learnobject!");
