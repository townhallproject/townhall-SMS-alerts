'use strict';

module.exports = function(req, res, next){
  req.subscribe = false;
  let response = req.body.Body.split(' ');
  console.log(req.subscribe);
  if(response[0].toLowerCase() === 'subscribe'){
    req.subscribe = true;
  }
  console.log(req.subscribe);
  return next();
};
