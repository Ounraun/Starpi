// scripts/clean.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const targets = [
  // แคชของ Strapi/webpack
  path.join(ROOT, '.cache'),
  path.join(ROOT, '.tmp'),
  path.join(ROOT, 'node_modules', '.cache'),

  // ผล build ที่เคยหลงไปไว้ผิดที่
  path.join(ROOT, 'dist', 'build'),

  // ตำแหน่ง build ของแอดมินที่ Strapi ใช้จริง
  path.join(ROOT, 'node_modules', '@strapi', 'admin', 'dist', 'server', 'server', 'build'),
];

for (const p of targets) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log('Removed:', p);
    } else {
      console.log('Not found:', p);
    }
  } catch (e) {
    console.error('Failed to remove:', p, e.message);
  }
}
