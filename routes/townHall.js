'use strict';
const firebasedb = require('../lib/firebaseinit');
const TownHall = require('../models/event.js');

const townHallLookup = module.exports = {};

townHallLookup.getDistricts = function(zip) {
  //return state and a district as arrays;
  return new Promise(function(resolve, reject) {
    let districtObj = {
      states:[],
      districts:[],
    };
    firebasedb.ref(`zipToDistrict/${zip}`).once('value').then((districtsData) => {
      districtsData.forEach((district) => {
        districtObj.states.push(district.val().abr);
        districtObj.districts.push(`${district.val().abr}-${Number(district.val().dis)}`);
      });
      console.log(districtObj);
      resolve(districtObj);
    }).catch((err) => {
      reject(err);
    });
  });
};

townHallLookup.getEvents = function(districtObj) {
  //return an array of events matching this set of states and districts
  return new Promise(function(resolve, reject) {
    let townHalls = [];
    firebasedb.ref(`townHalls`).once('value')
      .then((snapshot) => {
        snapshot.forEach((fbtownhall) => {
          let townhall = new TownHall(fbtownhall.val());

          if (townhall.includeTownHall(districtObj)) {
            townHalls.push(townhall);
          }
        });

        if (townHalls.length > 0) {
          resolve(townHalls);
        }
        reject('There are not any upcoming town halls in your area.');
      });
  });
};
