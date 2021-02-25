const clearCache = require('./clear-testing-cache');
const User = require('../models/user');
const constants = require('../constants');

const { ALERT_SENT } = constants;
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
        sessionType: ALERT_SENT,
      };
      return newUser.updateCache(settings)
        .then(() => User.getUserFromCache(user.body.From)
          .then((userCache) => {
            expect(userCache.sessionType).toEqual(ALERT_SENT);
            expect(userCache.hasbeenasked).toEqual(false);
          }));
    });
    test('it returns an empty object if user doesnt exist', () => User.getUserFromCache(testingTextQueueNumber)
      .then((userCache) => {
        expect(userCache).toEqual({});
      }));
  });
});