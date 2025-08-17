// server.js (Application Startup File)
const fs = require('fs');
const path = require('path');
const LOG_PATH = process.env.BOOT_LOG || path.join(__dirname, 'logs', 'boot.log');
fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });

// --- logger helper ---
const log = (...a) => {
  const line = `[${new Date().toISOString()}] ` + a.map(x =>
    (x && x.stack) ? x.stack : (typeof x === 'string' ? x : JSON.stringify(x))
  ).join(' ') + '\n';
  try { fs.appendFileSync(LOG_PATH, line, 'utf8'); } catch {}
  // ❌ อย่าเรียก process.stdout.write(line) เพราะเราติด tap stdout ไว้แล้ว
};
// tap stdout/stderr so Strapi (pino) logs land in boot.log too
const origStdoutWrite = process.stdout.write.bind(process.stdout);
process.stdout.write = (chunk, ...args) => {
  try { fs.appendFileSync(LOG_PATH, chunk instanceof Buffer ? chunk : String(chunk)); } catch {}
  return origStdoutWrite(chunk, ...args);
};
const origStderrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = (chunk, ...args) => {
  try { fs.appendFileSync(LOG_PATH, chunk instanceof Buffer ? chunk : String(chunk)); } catch {}
  return origStderrWrite(chunk, ...args);
};

// --- process handlers ---
process.on('uncaughtException', e => { log('UNCAUGHT', e); process.exit(1); });
process.on('unhandledRejection', e => { log('UNHANDLED', e); process.exit(1); });
process.on('exit', (c) => { log('[EXIT]', c); });
process.on('SIGTERM', () => { log('[SIGTERM]'); process.exit(0); });
process.on('SIGINT', () => { log('[SIGINT]'); process.exit(0); });

// === trace whoever calls process.exit ===
const _realExit = process.exit.bind(process);
process.exit = (code) => {
  const err = new Error('process.exit called');
  log('[EXIT_CALL]', code, err.stack);
  _realExit(code);
};
process.on('beforeExit', (c) => log('[BEFORE_EXIT]', c));


log('[BOOT] starting Strapi', 'PORT=', process.env.PORT, 'HOST=', process.env.HOST, 'NODE_ENV=', process.env.NODE_ENV);

(async () => {
  try {
    log('[STEP1] require @strapi/strapi');
    const mod = require('@strapi/strapi');

    log('[STEP2] createStrapi / factory');
    const factory =
      (mod && typeof mod.createStrapi === 'function') ? mod.createStrapi :
      (typeof mod === 'function') ? mod :
      (mod && typeof mod.default === 'function') ? mod.default : null;
    if (!factory) throw new Error('Unsupported @strapi/strapi module shape');

    const app = await factory();
    log('[STEP3] instance created');

    const cfg = app.config.get('server');
    log('[STEP4] config', cfg);

    // วัดเมมทุก 2 วิระหว่าง start (จับเคส OOM)
    const iv = setInterval(() => {
      const m = process.memoryUsage();
      log('[WATCH]', `rss=${(m.rss/1024/1024).toFixed(0)}MB`,
          `heap=${(m.heapUsed/1024/1024).toFixed(0)}/${(m.heapTotal/1024/1024).toFixed(0)}MB`);
    }, 2000);

    await app.start();

    clearInterval(iv);
    log('[STEP5] started OK');
  } catch (err) {
    log('[BOOT_ERROR]', err);
    process.exit(1);
  }
})();
