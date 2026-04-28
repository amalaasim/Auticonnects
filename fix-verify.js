import fs from 'fs';

let content = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

// I am just testing JS replacement
let updated = content.replace(/function Verifyshoe.*(?=export default)/s, 'REPLACED\n');
console.log(updated.length !== content.length ? "Regex matches" : "Regex failed");
