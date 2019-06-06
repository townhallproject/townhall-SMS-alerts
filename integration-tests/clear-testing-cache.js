const User = require('../models/user');

module.exports = (testingTextQueueNumber) => {
  const testingUser = {
    body: {
      From: testingTextQueueNumber,
    },
    zipcode: 99999,
  };
    
  let newUser = new User(testingUser);
  return newUser.deleteFromCache();
};