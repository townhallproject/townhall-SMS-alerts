'use strict';

const admin = require('firebase-admin');
const server = require('../../lib/server');
const app = require('express')();
const firebasedb = require('../../lib/firebaseinit');
const User = require('../user');
const testUserData = require('./mockUser');
let port = 5000;
let req = {};

beforeAll(() => {
  server.start(app, port);
});
afterAll(server.stop);

describe('class User', () =>{

  test('it should return an instance of the User Model', () => {
    let userObject = new User(testUserData);
    expect(userObject).toEqual(userObject);
  });
});
