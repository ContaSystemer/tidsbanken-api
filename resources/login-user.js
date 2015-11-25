'use strict';

var request = require('request');
var config = require('../config.json');

function LoginUser(callback) {
    var options = {
        url: 'http://ur9l.tidsbanken.net/15/logginn.asp?a=anspin',
        method: 'POST',
        useQuerystring: true,
        form: { ans: config.employeeId, pin: config.employeePin },
        json: true,
        jar: true
    };

    request(options, function(err, response, body) {
        if (err) {
            throw err;
        }

        if (body.ok !== true) {
            console.error(body);

            throw new Error('Employee could not log in.');
        } 

        callback(response, body);
    });
}

module.exports = LoginUser;