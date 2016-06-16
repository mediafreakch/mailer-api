var fs = require('fs');
var env = require('node-env-file');

// import env variables such as user, pass & from address
env(__dirname + '/../../.env');

module.exports = {
  from: process.env.MAILER_FROM,
  subject : 'Please verify your new e-mail address',
  html : fs.createReadStream(__dirname + '/../views/emails/new-email-to-confirm.html', 'utf8', function (err, data) {
    if (err) throw err;
  })
}
