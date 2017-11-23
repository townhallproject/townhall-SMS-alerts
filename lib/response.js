'use strict';

const messaging = module.exports = {};

messaging.sendAndWrite = function(res, message){
  let twiml = messaging.send(req, message);
  messaging.end(res, twiml);
};

messaging.send = function(req, message){
  req.twiml.message(message);
  return (req.twiml);
};

messaging.end = function(res, twiml) {
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
};
