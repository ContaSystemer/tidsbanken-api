'use strict';

var request = require('request');
var config = require('../config.json');

function LoginCompany(callback) {
    var options = {
        url: 'http://ur9l.tidsbanken.net/velk-js.asp?a=login',
        method: 'POST',
        useQuerystring: true,
        form: { fir: config.company, pas: config.password },
        json: true,
        jar: true
    };

    request(options, function(err, response, body) {
        if (err) {
            throw err;
        }

        if (body.ok !== true) {
            console.error(body);

            throw new Error('Company could not log in.');
        } 

        callback(response, body);
    });
}

module.exports = LoginCompany;