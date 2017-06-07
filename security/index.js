(function () {
    'use strict';

    var request = require('request-promise');
    var cheerio = require('cheerio'); // Basically jQuery for node.js

    exports.handler = function (context, req) {
        var options = {
            method: 'POST',
            uri: 'http://apps.atl.com/Passenger/FlightInfo/Default.aspx',
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        request(options).then(function (data) {
            var international = (req && req.query && req.query.international) || false,
                line,
                lineCounter = 0,
                security = [],
                selection,
                selectionRating;

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

                if (status.toLowerCase !== "closed") {
                    security.push({ location: location, status: status });
                }
            });

            for (lineCounter; lineCounter < security.length; lineCounter += 1) {
                line = security[lineCounter];

                if (international) {
                    if (line.location.toLowerCase() === "international") {
                        selection = line;
                        break;
                    }
                } else {
                    if (line.location.toLowerCase() !== "international") {
                        switch (line.status.toLowerCase()) {
                        case "less than 15 minutes":
                            selection = line;
                            selectionRating = 1;
                            break;
                        case "15 - 30 minutes":
                            if (selectionRating > 2) {
                                selection = line;
                                selectionRating = 2;
                            }
                            break;
                        case "30 - 45 minutes":
                            if (selectionRating > 3) {
                                selection = line;
                                selectionRating = 3;
                            }
                            break;
                        case "45 - 60 minutes":
                            if (selectionRating > 4) {
                                selection = line;
                                selectionRating = 4;
                            }
                            break;
                        default:
                            selection = line;
                            selectionRating = 5;
                        }
                    }
                }
            }

            context.res = { body: JSON.stringify(selection, null, 2) };
            context.done();
        }).catch(function (error) {
            context.log('error: ', error);
            context.done();
        });
    };

}());