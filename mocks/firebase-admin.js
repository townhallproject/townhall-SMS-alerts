'use strict';

class firebaseAdmin {
  constructor() {
    this.credential = {
      cert : () => (this),
    };
  }
  initializeApp () {
    return this;
  }
  database() {
    return new Database(mockData);
  }
}

let mockData = {
  'thisDoesNotExist' : {
    exists: () => (false),
  },
  'townHalls' : {
    val: () => ({eventId : 'eventId'}),
    exists: () => (true),
  },
  'zipToDistrict/98122': {
    exists: () => (true),
    forEach: function(cb) {
      for (var i = 0; i < districtArray.length; i++) {
        cb(districtArray[i]);
      }
    },
  },
};

let districtArray = [{abr: 'WA', dis: '07'}, {abr: 'WA', dis: '09'}];

class Database {
  constructor(data){
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  ref(path) {
    this.lookupPath = path;
    return this;
  }

  once() {
    return new Promise((resolve, reject) => {
      if (!this.lookupPath) {
        reject('needs a path');
      }
      resolve(this[this.lookupPath]);
    });
  }
}

module.exports = new firebaseAdmin();
