const fs = require('fs');
const path = require('path');

const dirs = ['.cache', '.tmp', 'build'];
for (const d of dirs) {
  const p = path.join(__dirname, '..', d);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log('Removed', p);
  } else {
    console.log('Not found', p);
  }
}
