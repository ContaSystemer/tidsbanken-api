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

    var entry = {
        type: action,
        time: new Date()
    };

    file.unshift(entry);

    updateFile(file, function() {
        console.log('Clocked ' + action + ' at: ' + getNorwegianDate(entry.time));
    });
}

/**
 * Attempt to create file
 */
function createFile(callback) {
    console.log(logFile + ' does not exist, trying to create...');

    fs.writeFile(logFile, '[]', function(err) {
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

     return './logs/' + theMonth + '.json';
}

/**
 * Get Norwegian Date
 */
function getNorwegianDate(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minutes= date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    
    return hour + ':' + minutes + ' ' + day + '.' + month + '.' + year;
}

module.exports = Logger;