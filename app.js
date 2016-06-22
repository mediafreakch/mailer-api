var express = require('express');
var nodemailer = require('nodemailer');
var env = require('node-env-file');
var bodyParser = require('body-parser');
var app = express();
var notifyOldEmailOptions = require('./src/config/notifyOldEmailOptions');
var verifyEmailOptions = require('./src/config/verifyEmailOptions');
var smtpOptions = require('./src/config/smtpOptions');
var authy = require('authy')(process.env.AUTHY_KEY);
var Promise = require('promise');

// some fixtures for testing:
var user = {
  email: process.env.AUTHY_SAMPLE_EMAIL,
  phone: process.env.AUTHY_SAMPLE_PHONE
}

// register bodyparser to process request
app.use( bodyParser.json() );
// apply headers to every response
app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'accept, content-type');
  next();
});

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
  // Request: { data: { token: 123 } }
  // Response: { status: 'success', message: 'E-Mail sucessfully updated', data: { email: 'foo@bar.com' } }

  if (req.body.data.token) {
    // Todo: validate token
    smtp.sendMail(notifyOldEmailOptions, function(error, info){
     if (error) {
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

app.post('/users/:id/phone/request-sms', function(req, res) {
  // Request: { data: { } }
  // Response: { status: 'success', message: 'SMS token sent', body: { authyId: 123 } }
  var p = registerUser(user.email, user.phone);

  p.then(function(data) {
    authy.request_sms(data.user.id, function(error, result) {
      if (error || req.body.data.error) res.status(500).json({ status: 'error', message: error.message });
      else res.json({ status: 'success', message: result.message, body: { authyId: data.user.id } });
    })
  }, function(error) {
      res.status(500).json({ status: 'error', message: error.message });
  });
});

app.post('/users/:id/phone/request-call', function(req, res) {
  // Request: { data: { } }
  // Response: { status: 'success', message: 'Call requested', body: { authyId: 123 } }

  var p = registerUser(user.email, user.phone);
  p.then(function(data) {
    authy.request_call(data.user.id, function(error, result) {
      if (error || req.body.data.error) res.status(500).json({ status: 'error', message: error.message });
      else res.json({ status: 'success', message: result.message, body: { authyId: data.user.id } });
    });
  }, function(error) {
      res.status(500).json({ status: 'error', message: error.message + '\n' + error.errors.join('\n') });
  });
});

app.post('/users/:id/phone/verify', function(req, res) {
  // Request: { data: { authyId: 123, authyToken: 123 } }
  // Response: { status: 'success', message: 'Token validated' }

  authy.verify(req.body.data.authyId, req.body.data.authyToken, function (err, result) {
    if (err || req.body.data.error) res.status(500).json({ status: 'error', message: err.message });
    else res.json({ status: 'success', message: result.message });
  });
});

/*------------------Init Server ------------------------*/
app.listen(3000, function() {
  console.log("Express Started on Port 3000");
});

/*------------------Private Function ------------------------*/
var registerUser = function(email, phone) {
  return new Promise(function(resolve, reject) {
    authy.register_user(email, phone, 41, function(err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
};
