# Sandbox Setup: 

- Number: 
12058591796
- Account SID: ACebe9355d2716458c9416e28137b4097f
- Auth Token: 3d861c11ce786d64eb68e463cfc8fb0b




# RAVIN-AI

FRIENDLY NAME
Ravin-AI

SID
SK6bb7c4c09f4f599f63a49bbb12c41089

KEY TYPE
Standard

SECRET
cVsMxxp3HSrOm5S3Gt7KJZsosCILHApc


# Ravin AI

Ravin AI

SID
SKad5d6255dd1486c6e619c18203a36487

KEY TYPE
Master

SECRET
Z2CIESfsaiBOR9Moem2NCIKC5zlXVng7

```javascript
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACebe9355d2716458c9416e28137b4097f';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);

client.messages
      .create({
         from: 'whatsapp:+14155238886',
         body: 'Hello there!',
         to: 'whatsapp:+15005550006'
       })
      .then(message => console.log(message.sid));
```

```json
{
  "account_sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "api_version": "2010-04-01",
  "body": "Hello there!",
  "date_created": "Thu, 30 Jul 2015 20:12:31 +0000",
  "date_sent": "Thu, 30 Jul 2015 20:12:33 +0000",
  "date_updated": "Thu, 30 Jul 2015 20:12:33 +0000",
  "direction": "outbound-api",
  "error_code": null,
  "error_message": null,
  "from": "whatsapp:+14155238886",
  "messaging_service_sid": "MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "num_media": "0",
  "num_segments": "1",
  "price": null,
  "price_unit": null,
  "sid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "status": "sent",
  "subresource_uris": {
    "media": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Media.json"
  },
  "to": "whatsapp:+15005550006",
  "uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json"
}
```

```javascript 1.8

```

```javascript 1.8

```

```javascript 1.8

```
