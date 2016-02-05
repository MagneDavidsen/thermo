var express = require('express');
var netatmo = require('netatmo');
var api = require('./api.js');
var config = require('./config.js');
var devices = require('./devices.js');
var nest = require('unofficial-nest-api');

var app = express();

const heatersGroupId = "1124573";

var telldusApi = api(config.telldus);
var devices = devices(telldusApi);

var netatmoApi = new netatmo(config.netatmo);

app.get('/', function (req, res) {
    netatmoApi.getStationsData(function(err, stations) {
        var actualTemp = stations[0].dashboard_data.Temperature;
        nest.login(process.env.nestUsername, process.env.nestPassword, function (err, data) {
            if (err) {
                console.log(err.message);
                process.exit(1);
                return;
            }
            nest.fetchStatus(function (data) {
                var thermostat = data.shared[process.env.nestSerial].target_temperature;
                var away = data.structure['a270ebe0-c9d3-11e5-988d-22000b04888b'].away;
                res.send("Temperature: " + actualTemp + ", Thermostat: " + thermostat + ", Away: " + away);
            });
        });
    });
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT);
});
