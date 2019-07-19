const clearCache = require('./clear-testing-cache');
const firebasedb = require('../lib/firebaseinit');
const Text = require('../models/texts');
const TownHall = require('../models/event');
const User = require('../models/user');
const constants = require('../constants');

const {
  ALERT_SENT,
} = constants;
const townhalldata = require('../models/tests/mockTownHall');
const testingTextQueueNumber = '+12222222222';

describe('Text Queue', () => {
  afterEach((done) => {
    clearCache(testingTextQueueNumber).then(done);
  });

  describe('write and remove', () => {
    test('it removes a text from the queue', ()=> {
      let user = {
        phoneNumber: testingTextQueueNumber,
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      let writeKey = `${newtext.phoneNumber}${newtext.eventId}`;
      let path = `sms-queue/${writeKey}`;
      let ref = firebasedb.ref(path);
      return newtext.writeToFirebase()
        .then(() => {
          ref.once('value', (snapshot) => {
            expect(snapshot.exists()).toEqual(true);
            expect(snapshot.key).toEqual(writeKey);
            return newtext.remove(writeKey)
              .then(() => {
                ref.once('value', (snapshot)=> {
                  expect(snapshot.exists()).toEqual(false);
                });
              });
          });
        });
    });
  });
  describe('send alert', () => {
    test('it sends alert and then updates cache', async () => {
      let user = {
        phoneNumber: testingTextQueueNumber,
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      newtext.key = 'key';
      const sent = await newtext.sendAlert(testingTextQueueNumber);
      expect(sent.sessionType).toEqual(ALERT_SENT);
      expect(sent.stateDistrict).toEqual('TX-33');
    });

    test('wont send if the user has already received alert', () => {
      let userReq = {
        body: {
          From: testingTextQueueNumber,
        },
        zipcode: 99999,
      };
      let user = new User(userReq);
      user.updateCache({
        sessionType: ALERT_SENT,
      });

      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      return newtext.sendAlert(testingTextQueueNumber)
        .then((sent) => {
          expect(sent.sessionType).toEqual(null);
        });
    });
  });
});