'use strict';
require('dotenv').config();
const scripts = require('../../lib/scripts');
const townHallHandler = require('../townHallLookup');

let req;
let res;

let resetMocks = () => {
  req = {
    body: {},
    twiml: {
      message: jest.fn(),
    },
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
      req.body.From = '1111111111';
      townHallHandler.checkZip(req, null, () => {
        expect(req.zipcode).toEqual('98122');
      });
    });
    test('it sends a message if not a zip', () => {
      req.body.Body = 'bbsdfd';
      req.body.From = '1111111111';
      let mockNext = jest.fn();
      townHallHandler.checkZip(req, res, mockNext);
      expect(req.twiml.message.mock.calls[0][0]).toEqual(scripts.default);
    });
  });
  describe('get districts', () => {
    test('it should get an object of states and districts based on a zipcode', () => {
      req.zipcode = '98122';
      req.body.From = '1111111111';
      return townHallHandler.getDistricts(req, res, () => {
        expect(typeof req.districts).toEqual('object');
        expect(req.districts).toEqual([{'district': '07', 'state': 'WA'}, {'district': '09', 'state': 'WA'}]);
      });
    });
    test('it should return an error if not a zip in the database', () => {
      req.zipcode = '11111';
      req.body.From = '1111111111';
      return townHallHandler.getDistricts(req, res, () => {
        expect(req.districts).toEqual();
      });
    });
  });
});
