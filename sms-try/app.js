var twilio = require('twilio');
var accountSid = 'ACb4cd7dc28b395fa5dc6132a3647801a6'; // Your Account SID from www.twilio.com/console
var authToken = '8c5e40f01d3abf0eee0585e94d63bf4a'; // Your Auth Token from www.twilio.com/console

var client = new twilio(accountSid, authToken);

client.messages.create({
        body: 'Hello from Node',
        to: '972544582766', // Text this number
        from: '+972526287243' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid)).catch((err) => console.log(err))