'use strict';

var request = require('request');
var config = require('../config.json');

function ClockIn(callback) {
    var options = {
        url: 'http://ur9l.tidsbanken.net/15/stemple4-js.asp?q=inn',
        method: 'POST',
        json: true,
        jar: true
    };

    request(options, function(err, response, body) {
        if (err) {
            throw err;
        }

        if (body.ok !== true) {
            console.error(body);

            throw new Error('Could not clock in.');
        } 

        callback('in');
    });
}

module.exports = ClockIn;