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

            console.log(JSON.stringify(parking, null, 2));
            context.log(JSON.stringify(parking, null, 2));
            context.res = { body: JSON.stringify(parking, null, 2) };
            context.done();
            Promise.resolve(parking);
        }).catch((error) => {
            console.log(error);
            context.log('error: ', error);
            context.done();
            Promise.reject(error);
        });
    };

}());