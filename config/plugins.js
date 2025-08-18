// backend/config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      sizeLimit: 700 * 1024 * 1024, // 700MB
      providerOptions: {},
    },
  },
});
