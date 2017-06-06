(function () {

    'use strict';

    var request = require('request-promise');
    var cheerio = require('cheerio'); // Basically jQuery for node.js

    module.exports = function (context) {
        var options = {
            method: 'POST',
            uri: 'http://apps.atl.com/Passenger/Parking/Default.aspx',
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        request(options).then((data) => {
            var parking = {};

            data('div#bodySection_TabContainer1_TabPanel1_wucParkingLotStatus_UplParking')
            .children()
            .toArray()
            .forEach((val, index) => {
                if (index === 0) {
                    return;
                }

                var location = data(val).children('.col-xs-9').text();
                var status = data(val).children('.col-xs-3').text();

                if (location !== "" && status !== "") {
                    parking[location] = status;
                }
            });

            console.log(JSON.stringify(parking, null, 2));
            context.res(Promise.resolve(parking));
            context.done();
        }).catch(error => {
            console.log('error: ', error);
        });
    };

}());