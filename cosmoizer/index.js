(function () {
    'use strict';

    var MongoClient = require('mongodb').MongoClient;
    var url = process.env.DOCDBCONNSTR_CosmosDB;

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
                    return;
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
                    return;
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
                        return;
                    }
                    resolve(id);
                }
            );
        });
    }

    module.exports = function(context, req) {
        var body = (req && req.body) || testObject,
            id = req && req.query && req.query.id,
            operation = req && req.query && req.query.operation;

        MongoClient.connect(url, function(error, db) {
            if (error) {
                console.log("Error (mongoClient): ", error);
            }

            switch(operation) {
                case "add":
                    addTrip(db, body).then(function (id) {
                        console.log({id: id});
                        context.log({id: id});
                        context.res = { body: id };
                    }).catch(function (error) {
                        console.log("Error (add): ", error);
                        context.log("Error (add): ", error);
                    }).finally(function () {
                        db.close();
                        context.done();
                    });
                    break;
                case "find":
                    findTrip(db, id).then(function (data) {
                        console.log(data);
                        context.log(data);
                        context.res = { body: data };
                    }).catch(function (error) {
                        console.log("Error (find): ", error);
                        context.log("Error (find): ", error);
                    }).finally(function () {
                        db.close();
                        context.done();
                    });
                    break;
                case "update":
                    updateTrip(db, id, updateObject).then(function (data) {
                        console.log({id: data});
                        context.log({id: data});
                        context.res = { body: data };
                    }).catch(function (error) {
                        console.log("Error (update): ", error);
                        context.log("Error (update): ", error);
                    }).finally(function () {
                        db.close();
                        context.done();
                    });
                    break;
                default:
                    context.log("Operation not supported: ", operation);
                    db.close();
                    context.done();
            }

        });
    };
}());
