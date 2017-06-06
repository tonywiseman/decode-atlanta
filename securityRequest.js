(function () {

    'use strict';

    var qs = require("querystring");
    var http = require("http");

    var options = {
        "method": "POST",
        "hostname": "apps.atl.com",
        "port": null,
        "path": "/Passenger/FlightInfo/Default.aspx",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "postman-token": "853e67b4-8cd8-a205-4987-d359a1ccc46d"
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
            'ctl00$ScriptManager': 'ctl00$bodySection$wucSecurityWaitTimes$upnWaitTime|ctl00$bodySection$wucSecurityWaitTimes$lnkWaittimes',
            __EVENTTARGET: 'ctl00$bodySection$wucSecurityWaitTimes$lnkWaittimes',
            __ASYNCPOST: 'true'
        })
    );
    req.end();

}());