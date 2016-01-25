var express = require('express');
var netatmo = require('netatmo');
var api = require('./api.js');
var devices = require('./devices.js');
var MemJS = require("memjs").Client

var memjs = MemJS.create();
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

app.get('/', function (req, res) {
  api.getStationsData(function(err, stations) {
    var actualTemp = stations[0].dashboard_data.Temperature;
    memjs.get("thermostat", function(err, thermostat) {
       if (thermostat) {res.send("Temperature: " + actualTemp + ", Thermostat: " + thermostat); }
       else { res.send("Temperature: " + actualTemp + ", Thermostat: No value "); }
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
