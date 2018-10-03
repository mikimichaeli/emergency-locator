var twilio = require('twilio');
var accountSid = '-'; // Your Account SID from www.twilio.com/console
var authToken = '-'; // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

client.messages.create({
        body: 'Hello from Node',
        to: '-', // Text this number
        from: '-' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid)).catch((err) => console.log(err))