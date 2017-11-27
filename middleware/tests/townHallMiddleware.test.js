'use strict';
require('dotenv').config();
const townHallHandler = require('../getDistricts');

let req;
let res;

let resetMocks = () => {
  req = {
    body: {},
    session: {},
  };
  res = {};
  let resWriteHead = jest.fn();
  let resEnd = jest.fn();
  res.writeHead = resWriteHead;
  res.end = resEnd;
};

describe('Town hall middleware', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('check zip', () => {
    test('it verifies a zip code', () => {
      req.body.Body = '98122-4444';
      townHallHandler.checkZip(req, null, () => {
        expect(req.session.zipcode).toEqual('98122');
      });
    });
    test('it sends a message if not a zip', () => {
      req.body.Body = 'bbsdfd';
      let mockNext = jest.fn();
      townHallHandler.checkZip(req, res, mockNext);
      expect(mockNext.mock.calls[0][0].message).toEqual('Hey, if you send us your zip code, we\'ll send you upcoming town halls for your reps.');
    });
  });
  describe('get districts', () => {
    test('it should get an object of states and districts based on a zipcode', () => {
      req.session.zipcode = '98122';
      return townHallHandler.getDistricts(req, res, () => {
        expect(typeof req.session.districts).toEqual('object');
        expect(req.session.districts).toEqual([{'district': '07', 'state': 'WA'}, {'district': '09', 'state': 'WA'}]);
      });
    });
    test('it should return an error if not a zip in the database', () => {
      req.session.zipcode = '11111';
      return townHallHandler.getDistricts(req, res, () => {
        expect(req.session.districts).toEqual();
      });
    });
  });
});
