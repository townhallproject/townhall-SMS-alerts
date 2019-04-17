#!/usr/bin/env node
const moment = require('moment');
const CronJob = require('cron').CronJob;
const firebasedb = require('../lib/firebaseinit');
const Text = require('../models/texts');

const calculateAndSaveAlertCount = (a) => {
    var counts = db.ref("townHallIds/" + a + "/sms_count");
    counts.transaction(function (current_value) {
        return (current_value || 0) + 1;
    });
};