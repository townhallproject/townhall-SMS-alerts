'use strict';

module.exports = function(req, res, next){
  let response = req.body.Body;
  if (response[0].toLowerCase() === 'y'){
    req.subscribe = true;
  }
  if (response[0].toLowerCase() === 'u'){
    req.unsubscribe = true;
  }
  console.log('Subscribe: ' ,req.subscribe);
  console.log('Unsubscribe: ', req.unsubscribe);
  return next();
};
