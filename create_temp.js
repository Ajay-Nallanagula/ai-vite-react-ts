const fs = require('fs');
const path = require('path');

const componentPath = 'src/components/Select';
fs.mkdirSync(componentPath, { recursive: true });

const selectTsx = 'import React from \" react\\\; export default function Select() { return null; }';

fs.writeFileSync(path.join(componentPath, 'Select.tsx'), selectTsx);
console.log('Select.tsx created');
