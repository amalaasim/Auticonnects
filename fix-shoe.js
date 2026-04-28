import fs from 'fs';

let content = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');
let vsStart = content.indexOf('function Verifyshoe({');
let vsEnd = content.indexOf('export default', vsStart); 
console.log("VS", vsStart, "END", vsEnd);
