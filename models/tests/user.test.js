'use strict';

const admin = require('firebase-admin');
const server = require('../../lib/server');
const app = require('express')();
const firebasedb = require('../../lib/firebaseinit');
const User = require('../user');
const testUserData = require('./mockUser');
let port = 5000;

let resetMocks = () => {
  req = {
    body: {},
    session: {},
  };
};
let req = {body:
  {From:'+1504997866'},
session: {zipcode: '98122'}};

beforeAll(() => {
  server.start(app, port);
});
afterAll(server.stop);

describe('class User', () =>{

  test('it should return an instance of the User Model', () => {
    let userObject = new User(req);
    expect(userObject).toEqual({'phoneNumber': '+1504997866', 'zipcode': '98122'});
  });
});
