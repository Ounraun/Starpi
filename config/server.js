// backend/config/server.js
module.exports = ({ env }) => ({
  // แนะนำให้รันหลัง proxy ของ Plesk => เปิด proxy: true และใส่ url
  proxy: true,
  url: env('PUBLIC_URL', 'https://starpi.tec-asia.com'),

  // host/port ใช้ค่าจาก ENV (ตามที่ตั้งไว้ใน Plesk)
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 3000),

  app: {
    keys: env.array('APP_KEYS'),
  },
});
