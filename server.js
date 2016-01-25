var express = require('express');
var netatmo = require('netatmo');
var api = require('./api.js');
var devices = require('./devices.js');

var app = express();

var auth = {
  "client_id": "52950de91877595f647d369d",
  "client_secret": process.env.netatmoSecret,
  "username": "magne.davidsen@gmail.com",
  "password": process.env.netatmoPassword,
};

  var config = {
    telldusPublicKey: "FEHUVEW84RAFR5SP22RABURUPHAFRUNU",
    telldusPrivateKey: process.env.telldusPrivateKey,
    telldusToken: "ea3741286e268b223f7565879ec674c6056a65cc4",
    telldusTokenSecret: process.env.telldusTokenSecret
  },
  tellusApi = api(config),
  devices = devices(tellusApi);

var api = new netatmo(auth);

var wantedTemp = 20;
process.env.thermostat = 25;

app.get('/', function (req, res) {
  api.getStationsData(function(err, stations) {
    var actualTemp = stations[0].dashboard_data.Temperature;

    if(actualTemp > wantedTemp) {
      devices.getDevices().then(function(sensors){
          sensors.map(devices.turnOff);
      });
    } else if(actualTemp < wantedTemp) {
      devices.getDevices().then(function(sensors){
          sensors.map(devices.turnOn);
      });
    }
    res.send("Temperature: " + actualTemp + ", Thermostat: " + wantedTemp);
  });
});

app.get('/settemp/:wantedTemp', function (req, res) {
  var responseText = "";
  if(req.params.wantedTemp && !isNaN(req.params.wantedTemp)){
      responseText = "Thermostat was changed from " + wantedTemp + " to " + req.params.wantedTemp;
      wantedTemp = req.params.wantedTemp;
  } else {
      responseText = "Thermostat was not changed, still on " + wantedTemp;
  }
    res.send(responseText);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
