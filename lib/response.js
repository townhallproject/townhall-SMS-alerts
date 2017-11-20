'use strict';

// const MessagingResponse = require('twilio').twiml.MessagingResponse;

// module.exports = function(res, message){
//   const twiml = new MessagingResponse();
//   twiml.message(message);
//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.end(twiml.toString());
// };

module.exports = function(message){
  const twilio = require('twilio');

  // Find your account sid and auth token in your Twilio account Console.
  let client = new twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN);

  // Send the text message.
  client.messages.create({
    to: '+14252059367',
    from: '+14252151351',
    body: message,
  });

  client.sendMessage();
};
