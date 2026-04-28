import fs from 'fs';

let content = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

function getComponentBody(code, startText) {
  let startIdx = code.indexOf(startText);
  if (startIdx === -1) return null;
  
  let firstBrace = code.indexOf('{', startIdx + startText.length);
  // The logic: wait until we find the block '{' that defines the function body.
  // Actually, function MyComp({ props }) { ... } has TWO opening braces before the closing of the first.
  let openBraces = 0;
  for(let i=startIdx; i<code.length; i++){
    if(code[i] === '{') openBraces++;
    if(code[i] === '}') openBraces--;
    if(openBraces === 0 && code[i] === '}' ) {
        return code.substring(startIdx, i+1);
    }
  }
}

let upShoe = getComponentBody(content, 'export function UploadShoe');
let vShoe = getComponentBody(content, 'function Verifyshoe');

console.log("UploadShoe length: " + upShoe.length);
console.log("Verifyshoe length: " + vShoe.length);

fs.writeFileSync('upShoe.txt', upShoe);
fs.writeFileSync('vShoe.txt', vShoe);
