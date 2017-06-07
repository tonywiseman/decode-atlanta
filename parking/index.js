(function () {
    'use strict';

    var request = require('request-promise');
    var cheerio = require('cheerio');

    module.exports = function (context) {
        var options = {
            method: 'POST',
            uri: 'http://apps.atl.com/Passenger/Parking/Default.aspx',
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        request(options).then((data) => {
            var parking = [];

            data('div#bodySection_TabContainer1_TabPanel1_wucParkingLotStatus_UplParking')
            .children()
            .toArray()
            .forEach((value, index) => {
                if (index === 0) {
                    return;
                }

                var location = data(value).children('.col-xs-9').text(),
                    status = data(value).children('.col-xs-3').text();

                if (location !== "" && status !== "") {
                    parking.push({ location: location, status: status });
                }
            });

            context.res = { body: JSON.stringify(parking, null, 2) };
            context.done();
        }).catch((error) => {
            context.log('error: ', error);
            context.done();
        });
    };

}());