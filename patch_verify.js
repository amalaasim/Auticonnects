const fs = require('fs');
let code = fs.readFileSync('src/component/learnobjshoe.js', 'utf8');

const lines = code.split('\n');

// 460    </Box>
// 461  );
// 462
// 463  return(

// Remove from 462 up to 657. At 462 we just put `}`
// We must carefully replace the entire file instead of using sed line numbers because line numbers shift.
