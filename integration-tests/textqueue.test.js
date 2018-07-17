const firebasedb = require('../lib/firebaseinit');
const Text = require('../models/texts');
const TownHall = require('../models/event');
const townhalldata = require('../models/tests/mockTownHall');

describe('Text Queue', () => {
  describe('write and remove', () => {
    test('it removes a text from the queue', ()=> {
      let user = {
        phoneNumber: 'number',
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
        phoneNumber: '+1111111111',
      };
      let newtownhall = new TownHall(townhalldata);
      let newtext = new Text(user, newtownhall);
      return newtext.sendAlert()
        .then((sent) => {
          expect(sent.alertSent).toEqual(true);
          expect(sent.stateDistrict).toEqual('TX-33');
        });
    });
  });
});