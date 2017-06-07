(function () {
  'use strict';
  var Promise = require('bluebird');

  var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyD-_R9M5iqKoqsOd7CDGqp9CflPlxYcugA'
  });
  var geocode = Promise.promisify(googleMapsClient.geocode);
  var directions = Promise.promisify(googleMapsClient.directions);
  module.exports = function (context, req) {

    if (!req.query.address) {
      return context.done('No origin address entered');
    }
    Promise.all([
        geocode({ address: '6000 N Terminal Pkwy, Atlanta, GA 30320' }), // Airport address
        geocode({ address: req.query.address })
      ])
      .spread((airport_geocode, origin_geocode) => {
        context.log('Origin', JSON.stringify(origin_geocode.json.results[0].geometry.location, null, 2));
        context.log('Destination', JSON.stringify(airport_geocode.json.results[0].geometry.location, null, 2));
        return directions({
          origin: origin_geocode.json.results[0].geometry.location,
          destination: airport_geocode.json.results[0].geometry.location
        });
      })
      .then((results) => {
        context.log('Directions routes', JSON.stringify(results.json.routes[0], null, 2));
        context.res = { body: results.json.routes[0].legs[0].duration };
        context.done();
      });
  }
})();