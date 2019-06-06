var fs = require('fs');
const User = require('../models/user');
var content = fs.readFileSync('./data/users.json');
var jsonContent = JSON.parse(content);


function formatZip (zip) {
  zeropadding = '00000';
  let zipstring = zip.toString();
  zipstring = zipstring.split('-')[0];
  if (isNaN(zipstring)) {
    console.log(zipstring, 'NaN');
  } else {
    updatedZip =
             zeropadding.slice(0, zeropadding.length - zipstring.length) +
             zipstring;
  }
  return updatedZip;
}

function formatPhoneNumber(phoneNumber){
  if (typeof phoneNumber === 'string'){
    phoneNumber = phoneNumber.replace(/[^\d]/g, '');
  }
  return `+1${phoneNumber}`;
}

jsonContent.forEach(person => {
  if (!person.phoneNumber || !person.zipcode) {
    return console.log('no data', person.zipcode, person.phoneNumber);
  }
  person.zipcode = formatZip(person.zipcode);
  person.phoneNumber = formatPhoneNumber(person.phoneNumber);
  if (person.zipcode.length !== 5 || person.phoneNumber.length !== 12){
      return console.log('messed up numbers', person.zipcode, person.phoneNumber);
  }
  newUser = new User(person);
  newUser.getDistricts()
    .then(updatedUser => {
      if (updatedUser){

        updatedUser.writeToFirebase({});
      }
    });
});