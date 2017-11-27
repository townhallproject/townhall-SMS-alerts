'use strict';

module.exports = function(req, res, next){
  let response = req.body.Body;
  if (response[0].toLowerCase() === 'y'){
    req.subscribe = true;
  }
  console.log('Subscribe: ' ,req.subscribe);
  return next();
};
