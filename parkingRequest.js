(function () {

    'use strict';

    var qs = require("querystring");
    var http = require("http");

    var options = {
        "method": "POST",
        "hostname": "apps.atl.com",
        "port": null,
        "path": "/Passenger/Parking/Default.aspx",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "postman-token": "db3ee968-deeb-6572-c04f-836da3693900"
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.write(
        qs.stringify({
            'ctl00$ScriptManager': 'ctl00$bodySection$TabContainer1$TabPanel1$wucParkingLotStatus$UplParking|ctl00$bodySection$TabContainer1$TabPanel1$wucParkingLotStatus$lnkParking',
            __EVENTTARGET: 'ctl00$bodySection$TabContainer1$TabPanel1$wucParkingLotStatus$lnkParking',
            __ASYNCPOST: 'true'
        })
    );
    req.end();

}());