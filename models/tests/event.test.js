'use strict';

const TownHall = require('../event');
const testTownHallData = require('./mockTownHall');
const moment = require('moment');

describe('class TownHall', () => {
  describe('townhall constructor', () => {
    test('it should return an instance of townhall', () => {
      let testTownHallObject = new TownHall(testTownHallData);
      expect(testTownHallObject.moc).toEqual(testTownHallData.Member);

    });
  });

  describe('includeTownHall method', () => {

    test('it should return true if the given district matches the townhall district', () => {
      let districts = [
        {
          state: 'TX',
          district: '33',
        },
      ];
      let location = {
        lat: 32,
        lng: -97,
      };
      let newTownHall = new TownHall(testTownHallData);
      newTownHall.dateObj = moment().add(7, 'days');
      let include = newTownHall.includeTownHall(districts, location);
      expect(include).toBe(true);
    });

    test('it should return false if the given district does not match the townhall district', () => {
      let districts = [
        {
          state: 'CA',
          district: '09',
        },
      ];
      let location = {
        lat: 32,
        lng: -97,
      };
  
      let newTownHall = new TownHall(testTownHallData);
      let include = newTownHall.includeTownHall(districts, location);
      expect(include).toBe(false);
    });

    test('it should return false if the given district does not match the townhall district', () => {
      let districts = [];
      let location = {
        lat: 32,
        lng: -97,
      };
      let newTownHall = new TownHall(testTownHallData);
      let failure = function() {
        newTownHall.includeTownHall(districts, location);
      };
      expect(failure).toThrow('The requested state not found');
    });

    test('it should return a message if townhalls exsist', ()=> {
      let newTownHall = new TownHall(testTownHallData);
      let include = newTownHall.print();
      expect(include).toEqual(
        ' Marc Veasey is holding a Tele-Town Hall at 9:30 AM, Fri, Nov 17, 2017. Address: TCC South Campus Recital Hall, 5301 Campus Dr, Fort Worth, TX 76119.'
      );
    });
  });

  test('it should return false if the event doesnt have all the info', () => {
    let newTownHall = new TownHall(testTownHallData);
    newTownHall.date = null;
    let include = newTownHall.includeTownHall();
    expect(include).toBe(false);
  });

  describe('includeInQueue method', () => {

    test('it should return false if the town hall is not in person and in the past', () => {
      let newTownHall = new TownHall(testTownHallData);
      let include = newTownHall.includeInQueue();
      expect(include).toBe(false);
    });

    test('it should return false if the event doesnt have all the info', () => {
      let newTownHall = new TownHall(testTownHallData);
      newTownHall.meetingType = null;
      let include = newTownHall.includeInQueue();
      expect(include).toBe(false);
    });

    test('it should return true if town hal is in person and in the future', () => {

      let newTownHall = new TownHall(testTownHallData);
      newTownHall.dateObj = moment().add(7, 'days');
      newTownHall.iconFlag = 'in-person';
      let include = newTownHall.includeInQueue();
      expect(include).toBe(true);
    });
  });
});
