(function () {
    'use strict';

    var request = require('request-promise');
    var cheerio = require('cheerio');
    var _ = require('lodash');

    module.exports = function (context, req) {
        var options = {
                method: 'POST',
                uri: 'http://apps.atl.com/Passenger/Parking/Default.aspx',
                transform: function (body) {
                    return cheerio.load(body);
                }
            },
            terminal,
            terminalPriority = {
                'North Daily': 3,
                'North Economy': 2,
                'North Hourly': 5,
                'Park-Ride-A': 4,
                'Park-Ride-C': 4,
                'South Daily': 3,
                'South Economy': 2,
                'South Hourly': 5,
                'West Economy': 1,
                'International Hourly': 2,
                'International Park-Ride': 1,
            };

        if (req.query && req.query.terminal) {
            terminal = req.query.terminal;
        }

        request(options).then(($) => {
            var parking = [];

            $('div#bodySection_TabContainer1_TabPanel1_wucParkingLotStatus_UplParking')
            .children()
            .toArray()
            .forEach((value, index) => {
                if (index === 0) {
                    return;
                }

                var location = $(value).children('.col-xs-9').text(),
                    status = $(value).children('.col-xs-3').text();

                // This will only put parking lots that are relevant to the terminal passed in. A bit convoluted, could probably be cleaned up
                // If no terminal is passed in, then include all of them. Ignore full lots
                if (location !== "" && status !== "" && status !== 'Full') {
                    if (terminal) {
                        if (terminal === 'international' && _.startsWith(location, 'International')) {
                            parking.push({ location: location, status: status, priority:  terminalPriority[location]});
                        } else if (terminal === 'domestic' && !_.startsWith(location, 'International')) {
                            parking.push({ location: location, status: status, priority:  terminalPriority[location]});
                        }
                    } else {
                        parking.push({ location: location, status: status, priority:  terminalPriority[location]});
                    }
                }
            });

            // Sort lots by priority
            parking = _.sortBy(parking, (lot) => lot.priority );

            context.log(`Return ${JSON.stringify(parking[0], null, 2)}`);
            // Only return the first element
            context.res = { body: parking[0] };
            context.done();
        }).catch((error) => {
            context.log('error: ', error);
            context.done();
        });
    };

}());