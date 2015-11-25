'use strict';

var config = require('./config.json'),
    argv = require('minimist')(process.argv.slice(2), { boolean: ['i', 'o']});

// Verify config
if (!config.company || !config.password || !config.employeeId || !config.employeePin) {
    throw new Error('config.json is not valid');
}

// Verify arguments
if (!argv.i && !argv.o) {
    throw new Error('Argument -i (clock in) or -o (clock out) is required');
} else if (argv.i && argv.o) {
    throw new Error('Use -i or -o, not both.');
}

var loginCompany = require('./resources/login-company'),
    loginUser = require('./resources/login-user'),
    clockIn = require('./resources/clock-in'),
    clockOut = require('./resources/clock-out');

// Login with company and password
loginCompany(function(response, body) {
    loginUser(clockInOrOut);
});

/**
 * Clock in or out
 */
function clockInOrOut() {
    if (argv.i) {
        clockIn(function() {
            console.log('Clocked in!');
        });
    } else if (argv.o) {
        clockOut(function() {
            console.log('Clocked out!');
        });
    }
}