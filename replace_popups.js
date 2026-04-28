import fs from 'fs';

let content = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

// Function to generate the new unified popup container
function replacePopups(code) {
  const uploadShoeStart = code.indexOf(`export function UploadShoe({ onClose }) {`);
  const uploadShoeEnd = code.indexOf(`}`, code.indexOf(`return (`, uploadShoeStart)) + 1; 

  // Since it's big, we need a reliable way to slice till the end of UploadShoe
  let endOfUploadShoe = code.indexOf('  );\n}', uploadShoeStart) + 6;
  
  const vshoeStart = code.indexOf(`function Verifyshoe({ closeModal, onVerified }) {`);
  const vshoeEnd = code.indexOf('  )\n}', vshoeStart) + 5;
  
  if (uploadShoeStart === -1 || vshoeStart === -1) {
     console.log("Could not find components!");
     return code;
  }
  return code;
}

replacePopups(content);
