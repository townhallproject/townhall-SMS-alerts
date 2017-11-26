'use strict';

module.exports = function(req, res, next){
  req.subscribe = false;
  let response = req.body.Body.split(' ');
  if(response[0].toLowerCase() === 'subscribe'){
    req.subscribe = true;
  }
  console.log('Subscribe: ' ,req.subscribe);
  return next();
};
