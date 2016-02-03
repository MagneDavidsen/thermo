var express = require('express');
var netatmo = require('netatmo');
var api = require('./api.js');
var config = require('./config.js');
var devices = require('./devices.js');
var NestApi = require('nest-api');
var nest = require('nest-thermostat').init(process.env.nestUsername, process.env.nestPassword);

var app = express();

const heatersGroupId = "1124573";

var telldusApi = api(config.telldus);
var devices = devices(telldusApi);

var netatmoApi = new netatmo(config.netatmo);

app.get('/', function (req, res) {
    netatmoApi.getStationsData(function(err, stations) {
        var actualTemp = stations[0].dashboard_data.Temperature;
        nest.getInfo(process.env.nestSerial, function(data) {
            var thermostat = data.target_temperature;
            res.send("Temperature: " + actualTemp + ", Thermostat: " + thermostat);
        });
    });
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT);
});
