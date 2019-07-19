'use strict';
const User = require('../models/user');

module.exports = function (req, res, next) {
  if (!req.body.From || !req.body.Body){
    return next(new Error('No data'));
  }
  return User.getUserFromCache(req.body.From)
    .then(user => {
      req.zipcode = user.zipcode;
      req.sessionType = user.sessionType || null;
      req.messageCount = user.messageCount || 0;
      req.hasbeenasked = user.hasbeenasked || false;
      req.districts = user.districts || null;
      req.eventId = user.eventId || null;
      req.stateDistrict = user.stateDistrict || null;
      req.messages = user.messages || [];
      req.sessionType = user.sessionType || null;
      return next();
    }).catch(err=>{
      console.log(err);
      return next();
    });
};