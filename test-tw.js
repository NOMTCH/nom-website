const fs = require('fs');
const { execSync } = require('child_process');

fs.writeFileSync('test.css', '@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));');
fs.writeFileSync('test.html', '<div class="dark:bg-black"></div>');

execSync('npx tailwindcss -i test.css -o out.css', { stdio: 'inherit' });
const out = fs.readFileSync('out.css', 'utf8');
console.log(out.includes('@media (prefers-color-scheme: dark)'));
