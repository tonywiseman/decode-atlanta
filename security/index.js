(function () {
    'use strict';

    var request = require('request-promise');
    var cheerio = require('cheerio'); // Basically jQuery for node.js

    module.exports = function (context) {
        var options = {
            method: 'POST',
            uri: 'http://apps.atl.com/Passenger/FlightInfo/Default.aspx',
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        request(options).then(function (data) {
            var security = [];

            data('div#bodySection_wucSecurityWaitTimes_upnWaitTime')
            .children()
            .toArray()
            .forEach(function (value, index) {
                if (index > 3) {
                    return;
                }

                var checkpoint = data(value).text(),
                    location = checkpoint.split(" Checkpoint : ")[0],
                    status = checkpoint.split(" Checkpoint : ")[1];

                security.push({location: location, status: status});
            });

            context.res = { body: JSON.stringify(security, null, 2) };
            Promise.resolve(security);
            context.done();
        }).catch(function (error) {
            context.log('error: ', error);
            Promise.reject(error);
            context.done();
        });
    };

}());