# Configuration

After cloning the repo, put a `.env` file into the root directory of the project.
Then, set the following variables inside:

```
MAILER_HOST=<your smtp server>
MAILER_USER=<username to login on the smtp server>
MAILER_PASS=<password corresponding to your user>
MAILER_FROM=<e-mail address corresponding to the sender of the e-mail (your logged-in user needs to have the rights to send from this e-mail)>
MAILER_TOOLD=<e-mail address to send the change notification to>
```

# Run

After configuration, run `npm start`.
Now you can send requests to the configured routes.

# Routes

## `/users/:id/email`

Parameters (URL):
- `:id` - customerId you want to change the e-mail of

Payload:
- `data.email` - the new e-mail address the user wishes to assign

Response:
```
{ status: 'success', message: 'We sent you an e-mail', data: { email: 'foo@bar.com' } }
```

## `/users/:id/email/verify`

Parameters (URL):
- `:id` - customerId you want to verify the e-mail of

Payload:
- `data.token` - the token that you received from the user's e-mail. used to verify if the change is legitimate.

Response:
```
// Response: { status: 'success', message: 'E-Mail sucessfully updated', data: { email: 'foo@bar.com' } }
```
