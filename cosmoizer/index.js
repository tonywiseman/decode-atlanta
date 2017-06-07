(function () {
    'use strict';

    var MongoClient = require('mongodb').MongoClient;
    var url = process.env.DocumentDB_CosmosDB;

    var testObject = {
        "origin": "The Garage, Atlanta, GA",
        "departure_time": "1496779536115",
        "bags": 1,
        "oversized_bags": 0,
        "handicap_accessible": "false",
        "transport_mode": "driving",
        "risk_tolerance": 10,
        "segments": []
    };

    var updateObject = {
        "segments": [
            {
                "name": "Drive to airport",
                "duration_in_minutes": 10,
                "confidence_interval": 0.9
            },
            {
                "name": "Parking",
                "duration_in_minutes": 5,
                "confidence_interval": 1
            },
            {
                "name": "Security",
                "duration_in_minutes": 15,
                "confidence_interval": 0.5
            }
        ]
    };

    function addTrip(db, object) {
        return new Promise(function (resolve, reject) {
            db.collection('trips').insertOne(object, function(error, result) {
                if (error) {
                    reject(error);
                }

                resolve(result.ops[0]._id);
            });
        });
    }

    function findTrip(db, id) {
        return new Promise(function (resolve, reject) {
            db.collection('trips').findOne({_id: id}, function(error, data) {
                if (error) {
                    reject(error);
                }

                resolve(data);
            });
        });
    }

    function updateTrip(db, id, updateObject) {
        return new Promise(function (resolve, reject) {
            db.collection('trips').updateOne(
                { _id : id },
                {
                    $set: updateObject,
                    $currentDate: { "lastModified": true }
                },
                function(error, data) {
                    if (error) {
                        reject(error);
                    }

                    resolve(id);
            });
        });
    }

    module.exports = function(context, req) {
        var body = (req && req.body) || testObject,
            id = req && req.id,
            operation = req && req.operation;

        MongoClient.connect(url, function(error, db) {
            if (error) {
                console.log("Error (mongoClient): ", error);
            }

            switch(operation) {
                case "add":
                    addTrip(db, testObject).then(function (id) {
                        console.log({id: id});
                        context.log(data);
                        context.res = { body: data };
                    }).catch(function (error) {
                        console.log("Error (add): ", error);
                        context.error(error);
                    }).finally(function () {
                        db.close();
                        context.close();
                    });
                    break;
                case "find":
                    findTrip(db, id).then(function (data) {
                        console.log(data);
                        context.log(data);
                        context.res = { body: data };
                    }).catch(function (error) {
                        console.log("Error (find): ", error);
                        context.error(error);
                    }).finally(function () {
                        db.close();
                        context.close();
                    });
                    break;
                case "update":
                    updateTrip(db, id, updateObject).then(function (data) {
                        console.log({id: data});
                        context.log(data);
                        context.res = { body: data };
                    }).catch(function (error) {
                        console.log("Error (update): ", error);
                        context.error(error);
                    }).finally(function () {
                        db.close();
                        context.close();
                    });
                    break;
                default:
                    context.error("Operation not supported: ", operation);
            }

        });
    };
}());
