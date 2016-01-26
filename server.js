var express = require('express');
var netatmo = require('netatmo');
var api = require('./api.js');
var config = require('./config.js');
var devices = require('./devices.js');
var MemJS = require("memjs").Client

var memjs = MemJS.create();
var app = express();

const heatersGroupId = "1124573";

var telldusApi = api(config.telldus);
var devices = devices(telldusApi);

var netatmoApi = new netatmo(config.netatmo);

app.get('/', function (req, res) {
  netatmoApi.getStationsData(function(err, stations) {
    var actualTemp = stations[0].dashboard_data.Temperature;
    memjs.get("thermostat", function(err, thermostat) {
      devices.getDevices().then(function(sensors){

          if (thermostat) {res.send("Heat on: " + sensors.filter(x => x.id === heatersGroupId)[0].state + ", Temperature: " + actualTemp + ", Thermostat: " + thermostat); }
          else { res.send("Temperature: " + actualTemp + ", Thermostat: No value "); }

       });

       });
     });
   });

app.get('/settemp/:thermostat', function (req, res) {
  var responseText = "";
  memjs.get("thermostat", function(err, thermostat) {
    if(req.params.thermostat && !isNaN(req.params.thermostat)){
      responseText = "Thermostat was changed from " + thermostat + " to " + req.params.thermostat;
      memjs.set("thermostat", req.params.thermostat);
  } else {
      responseText = "Thermostat was not changed, still on " + thermostat;
  }
    res.send(responseText);
});
});


app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT);
});
