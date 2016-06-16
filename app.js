var express = require('express');
var nodemailer = require('nodemailer');
var env = require('node-env-file');
var bodyParser = require('body-parser');
var app = express();
var notifyOldEmailOptions = require('./src/config/notifyOldEmailOptions');
var verifyEmailOptions = require('./src/config/verifyEmailOptions');
var smtpOptions = require('./src/config/smtpOptions');

// register bodyparser to process request
app.use( bodyParser.json() );

// configure smtp
var smtp = nodemailer.createTransport(smtpOptions);

/*------------------Routing Started ------------------------*/
app.post('/users/:id/email', function(req, res) {
  // Request: { data: { email: '' } }
  // Response: { status: 'success', message: 'We sent you an e-mail', data: { email: 'foo@bar.com' } }

  // check if params have been supplied
  if (req.body.data.email) {

    verifyEmailOptions.to = req.body.data.email;

    smtp.sendMail(verifyEmailOptions, function(error, info) {
     if (error) {
      res.json({ status: 'error', message: error });
     } else {
      res.json({
          status: 'success',
          message: 'Confirmation E-Mail has been sent',
          data: {
            email: req.body.data.email
          }
        });
     }
    });
  }
});

app.post('/users/:id/email/verify', function(req, res) {
  // Request: { data: { token: '' } }
  // Response: { status: 'success', message: 'E-Mail sucessfully updated', data: { email: 'foo@bar.com' } }

  if (req.body.data.token) {
    // Todo: validate token
    smtp.sendMail(notifyOldEmailOptions, function(error, info){
     if (error) {
      console.log(error);
      res.json({ status: 'error', message: error });
     } else {
      res.json({
          status: 'success',
          message: 'E-Mail address has sucessfully been updated'
        });
     }
    });
  }
});

/*------------------Init Server ------------------------*/
app.listen(3000, function() {
  console.log("Express Started on Port 3000");
});
