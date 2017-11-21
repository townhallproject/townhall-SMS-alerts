'use strict';

class credential {
  constructor(){
  }
  cert() {
    return this;
  }
}

class firebaseAdmin {
  constructor() {
    this.credential = new credential();
  }
  initializeApp () {
    return this;
  }
  database() {
    return new Database(new dataMocker(mockData));
  }
}

let mockData = {
  'townHalls': {eventId : 'eventId'},
  'zipToDistrict/98122': [{abr:'WA', dis: '09'}, {abr: 'WA', dis: '08'}],
};

class dataMocker {
  constructor(data){
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }
  val(){
    return this.data;
  }
}


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
