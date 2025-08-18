// scripts/postbuild-copy-admin.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// แหล่งไฟล์ build ของแอดมิน (TS จะอยู่ dist/build, JS จะอยู่ build)
const srcTS = path.join(ROOT, 'dist', 'build');
const srcJS = path.join(ROOT, 'build');
const src = fs.existsSync(srcTS) ? srcTS : (fs.existsSync(srcJS) ? srcJS : null);

if (!src) {
  console.log('[postbuild] admin build not found at', srcTS, 'or', srcJS);
  process.exit(0);
}

// เป้าหมายที่ Strapi runtime ใช้จริง
const adminPkg = require.resolve('@strapi/admin/package.json', { paths: [ROOT] });
const targetDir = path.join(path.dirname(adminPkg), 'dist', 'server', 'server', 'build');

console.log('[postbuild] copy from:', src);
console.log('[postbuild] to:', targetDir);

try {
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });
  // Node 16+ มี fs.cpSync
  fs.cpSync(src, targetDir, { recursive: true });
  console.log('[postbuild] done');
} catch (e) {
  console.error('[postbuild] failed:', e.message);
  process.exit(1);
}
