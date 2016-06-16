var fs = require('fs');
var env = require('node-env-file');

// import env variables such as user, pass & from address
env(__dirname + '/../../.env');

module.exports = {
  from: process.env.MAILER_FROM,
  to: process.env.MAILER_TOOLD,
  subject : 'Your E-Mail address has been changed',
  html : fs.createReadStream(__dirname + '/../views/emails/notify-about-email-changed.html', 'utf8', function (err, data) {
    if (err) throw err;
  })
};
