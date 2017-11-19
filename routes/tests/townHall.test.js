'use strict';

const firebasemock = require('firebase-mock');
const townHallHandler = require('../townHall');
const proxyquire = require('proxyquire');

let firebaseData = {
  98122: [],
};

let req;
let res;

let resetMocks = () => {
  req = {
    body: {},
  };
  res = {};
  let resWriteHead = jest.fn();
  let resEnd = jest.fn();
  res.writeHead = resWriteHead;
  res.end = resEnd;
};

describe('Town hall middleware', () => {
  beforeAll(() => {
    var mockdatabase = new firebasemock.MockFirebase();
    var mockauth = new firebasemock.MockFirebase();
    var mocksdk = firebasemock.MockFirebaseSdk(function(path) {
      return path ? mockdatabase.child(path) : mockdatabase;
    }, function() {
      return mockauth;
    });
    const mySrc = proxyquire('../../lib/firebaseinit', {
      admin: mocksdk,
    });
    mockdatabase.flush();
  });
  beforeEach(() => {
    resetMocks();
  });

  describe('check zip', () => {
    test('it verifies a zip code', () => {
      req.body.Body = '98122-4444';
      townHallHandler.checkZip(req, null, () => {
        expect(req.zipcode).toEqual('98122');
      });
    });
    test('it sends a message if not a zip', () => {
      req.body.Body = 'bbsdfd';
      let mockNext = jest.fn();
      townHallHandler.checkZip(req, res, mockNext);
      expect(mockNext.mock.calls[0][0].message).toEqual('Please send us a zipcode to get upcoming events for your reps');
    });
  });
  describe('get districts', () => {
    test('it should get an object of states and districts based on a zipcode', () => {
      req.zipcode = '98122';
      return townHallHandler.getDistricts(req, res, () => {
        expect(typeof req.districtObj).toEqual('object');
        expect(req.districtObj).toEqual({ states: [ 'WA', 'WA' ], districts: [ 'WA-7', 'WA-9' ] });
      });
    });
    test('it should return an error if not a zip in the database', () => {
      req.zipcode = '11111';
      let mockNext = jest.fn();
      let errorResponse = townHallHandler.getDistricts(req, res, mockNext);
      expect(req.districtObj).toEqual(undefined);
    });
  });
});
