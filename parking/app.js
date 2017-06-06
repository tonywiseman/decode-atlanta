var rp = require('request-promise');
var cheerio = require('cheerio'); // Basically jQuery for node.js 
var options = {
  method: 'POST',
  uri: 'http://apps.atl.com/Passenger/Parking/Default.aspx',
  transform: function (body) {
    return cheerio.load(body);
  }
}
rp(options)
.then(($) => {
  var ret = {}
  $('div#bodySection_TabContainer1_TabPanel1_wucParkingLotStatus_UplParking').children().toArray().forEach((val,index)=>{
    if(index === 0) return;
    var key = $(val).children('.col-xs-9').text();
    var value = $(val).children('.col-xs-3').text();
    if(key != "" && value != "")
      ret[key] = value;
  });
  console.log(JSON.stringify(ret, null, 2));
  return Promise.resolve(ret);
})
.catch(err => console.log('error',err));