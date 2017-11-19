'use strict';
const townHallHandler = require('../townHall');
let req = {
  body: {},
};

let res = {};


describe('Town hall middleware', () => {
  describe('check zip', () => {
    test('it verifies a zip code', () => {
      req.body.Body = '98122';
      townHallHandler.checkZip(req, res, () => {
        expect(arguments.length).toEqual(7);
        expect(req.zipcode).toEqual('98122');
      });
    });

  });
});
