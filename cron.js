var netatmo = require('netatmo');
var api = require('./api.js');
var devices = require('./devices.js');
var config = require('./config.js');
var MemJS = require("memjs").Client

var memjs = MemJS.create();

const heatersGroupId = "1124573";

var telldusApi = api(config.telldus);
var devices = devices(telldusApi);

var api = new netatmo(config.netatmo);

api.getStationsData(function(err, stations) {
  var actualTemp = stations[0].dashboard_data.Temperature;
  memjs.get("thermostat", function(err, thermostat) {
     if (actualTemp && thermostat) {
       if(actualTemp > thermostat + 1) {
          devices.getDevices().then(function(sensors){
              sensors.filter(x => x.id === heatersGroupId).map(devices.turnOff);
           });
        } else if(actualTemp < thermostat) {
          devices.getDevices().then(function(sensors) {
              sensors.filter(x => x.id === heatersGroupId).map(devices.turnOn);
          });
        }
       }
     });
   });
