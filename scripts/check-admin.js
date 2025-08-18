const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  '@strapi',
  'admin',
  'dist',
  'server',
  'server',
  'build',
  'index.html'
);

console.log('Expect admin index at:\n', target);
console.log('Exists =', fs.existsSync(target));
