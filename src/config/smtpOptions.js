var env = require('node-env-file');

// import env variables such as user, pass & from address
env(__dirname + '/../../.env');

module.exports = {
  host: process.env.MAILER_HOST,
  secureConnection: false,
  port: 25,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  }
};
