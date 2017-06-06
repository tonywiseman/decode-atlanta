(function () {

    'use strict';

    var request = require("request");

    var options = {
        method: 'POST',
        url: 'http://apps.atl.com/Passenger/FlightInfo/Default.aspx',
        headers: {
            'postman-token': 'b4041a10-5b2c-03b1-7b7b-85e01c19d22e',
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded'
        },
        form: {
            'ctl00$ScriptManager': 'ctl00$bodySection$wucSecurityWaitTimes$upnWaitTime|ctl00$bodySection$wucSecurityWaitTimes$lnkWaittimes',
            '__EVENTTARGET': 'ctl00$bodySection$wucSecurityWaitTimes$lnkWaittimes',
            '__ASYNCPOST': 'true'
        }
    };

    request(options, function (error, response, body) {
        if (error) {
            throw new Error(error);
        }

        console.log(response.statusCode);
        console.log(body);
    });

}());