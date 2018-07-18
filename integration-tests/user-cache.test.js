const clearCache = require('./clear-testing-cache');
const User = require('../models/User');
const testingTextQueueNumber = '+11234567890';

describe('user cache', () => {
  beforeEach(() => {
    clearCache(testingTextQueueNumber);
  });

  describe('get user from cache', () => {
    test('it gets a user from the cache', () => {
      let user = {
        body: {
          From: testingTextQueueNumber,
        },
        zipcode: 98122,
      };
      let newUser = new User(user);
      let settings = {
        alertSent: true,
      };
      return newUser.updateCache(settings)
        .then(() => {
          return User.getUserFromCache(user.body.From)
            .then((userCache) => {
              expect(userCache.alertSent).toEqual(true);
              expect(userCache.hasbeenasked).toEqual(false);
            });
        });
    });
    test('it returns an empty object if user doesnt exist', () => {
      return User.getUserFromCache(testingTextQueueNumber)
        .then((userCache) => {
          expect(userCache).toEqual({});
        });
    });
  });
});