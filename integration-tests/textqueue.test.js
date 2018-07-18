const clearCache = require('./clear-testing-cache');
const firebasedb = require('../lib/firebaseinit');
const Text = require('../models/texts');
const TownHall = require('../models/event');
const User = require('../models/user');

const townhalldata = require('../models/tests/mockTownHall');
const testingTextQueueNumber = '+12222222222';

describe('Text Queue', () => {
  beforeEach(() => {
    clearCache(testingTextQueueNumber);
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
    test('it sends alert and then updates cache', () => {
      let user = {
        phoneNumber: testingTextQueueNumber,
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      return newtext.sendAlert(testingTextQueueNumber)
        .then((sent) => {
          console.log(sent);
          expect(sent.alertSent).toEqual(true);
          expect(sent.stateDistrict).toEqual('TX-33');
        });
    });

    test('wont send if the user has already recieved alert', () => {
      let userReq = {
        body: {
          From: testingTextQueueNumber,
        },
        zipcode: 99999,
      };
      let user = new User(userReq);
      user.updateCache({alertSent: true});
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      return newtext.sendAlert(testingTextQueueNumber)
        .then((sent) => {
          console.log(sent);
          expect(sent.alertSent).toEqual(false);
        });
    });
  });
});