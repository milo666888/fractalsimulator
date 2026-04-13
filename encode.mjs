import fs from 'fs';
const data = fs.readFileSync('src/assets/company-logo.png');
fs.writeFileSync('src/assets/logoBase64.ts', `export const logoBase64 = "data:image/png;base64,${data.toString('base64')}";`);
console.log('Done');
