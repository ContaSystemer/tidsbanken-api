'use strict';

var fs = require('fs'),
    fileExists = require('file-exists');

var logFile = getLogFileName();

/**
 * Log check-in / check-out entries
 */
function Logger(action) {
    if (!fileExists(logFile)) {
        createFile(function() {
            log(action);
        });
    } else {
        log(action);
    }
}

/**
 * Attempt to create file
 */
function log(action) {
    var file = require(logFile);

    var entryDate = new Date();

    var entry = {
        type: action,
        time: entryDate.toString()
    };

    var day = entryDate.getDate() < 10 ? '0' + entryDate.getDate() : entryDate.getDate();

    if (!file[day]) {
        file[day] = [];
    }

    file[day].unshift(entry);

    updateFile(file, function() {
        console.log('Clocked ' + action + ' at: ' + getNorwegianDate(entryDate));

        if (action === 'out') {
            var lastClockIn = getLastClockIn(file[day]);

            if (lastClockIn) {
                console.log('Session lasted: ' + getDiffBetweenClockInAndOut(lastClockIn.time, entryDate));
            }
        }
    });
}

/**
 * Attempt to create file
 */
function createFile(callback) {
    console.log(logFile + ' does not exist, trying to create...');

    fs.writeFile(logFile, '{}', function(err) {
        if(err) {
            throw err;
        }

        console.log(logFile + ' was created successfully!');

        callback(logFile);
    });
}

/**
 * Attempt to save file
 */
function updateFile(string, callback) {
    var prettify = JSON.stringify(string, null, 4);

    fs.writeFile(logFile, prettify, function(err) {
        if(err) {
            throw err;
        }

        callback();
    });
}

/**
 * Get log file name
 */
function getLogFileName() {
     var date = new Date();

     var month = date.getMonth() + 1;

     var theMonth = month < 10 ? "0" + month : month;
     var theYear = date.getFullYear();

     return __dirname + '/logs/' + theYear + '-' + theMonth + '.json';
}

/**
 * Get Norwegian Date
 */
function getNorwegianDate(date) {
    var getMonth = date.getMonth() + 1;

    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = getMonth < 10 ? '0' + getMonth : getMonth;
    var year = date.getFullYear();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    return hour + ':' + minutes + ' ' + day + '.' + month + '.' + year;
}
/**
 * Get last clock in, if any
 */
function getLastClockIn(entries) {
    if (entries.length === 0) {
        return undefined;
    }

    for (var i = 0; i < entries.length; i++) {
        if (entries[i].type === 'in') {
            entries[i].time = new Date(entries[i].time);
            return entries[i];
        }
    }

    return undefined;
}

/**
 * Get diff between in and out clock in hours and minutes
 */
function getDiffBetweenClockInAndOut(inDate, outDate) {
    var diffMs = (outDate - inDate) / 1000;
    var diffHrs = Math.round((diffMs % 86400) / 3600);
    var diffMins = Math.round(((diffMs % 86400) % 3600) / 60);

    return diffHrs + 'h ' + diffMins + 'm';
}

module.exports = Logger;