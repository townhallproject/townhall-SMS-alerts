#!/usr/bin/env node
const firebasedb = require('../lib/firebaseinit');

const calculateAndSaveAlertCount = (a) => {
  var counts = firebasedb.ref('townHallIds/' + a + '/sms_count');
  counts.transaction(function (current_value) {
    return (current_value || 0) + 1;
  });
};

module.exports = calculateAndSaveAlertCount;
