const path = require('path');
 
/** @type { import('pm2').StartOptions } */
module.exports = {
  apps: [
    {
      name: 'calfus-game',
      cwd: __dirname,
      script: path.join(__dirname, 'node_modules/.bin/next'),
      args: 'dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      watch: false,
      autorestart: true,
    },
  ],
};