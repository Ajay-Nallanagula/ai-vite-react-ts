import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentPath = path.join(__dirname, 'src/components/Select');

fs.mkdirSync(componentPath, { recursive: true });

const selectTsx = 'import React from " react\; export default function Select() { return null; }';

fs.writeFileSync(path.join(componentPath, 'Select.tsx'), selectTsx);
console.log('Select.tsx created');
