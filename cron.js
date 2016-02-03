var netatmo = require('netatmo');
var api = require('./api.js');
var devices = require('./devices.js');
var config = require('./config.js');
var MemJS = require("memjs").Client
var nest = require('nest-thermostat').init(process.env.nestUsername, process.env.nestPassword);

var memjs = MemJS.create();

const heatersGroupId = "1124573";

var telldusApi = api(config.telldus);
var devices = devices(telldusApi);

var api = new netatmo(config.netatmo);

api.getStationsData(function(err, stations) {
  var actualTemp = stations[0].dashboard_data.Temperature;
  nest.getInfo(process.env.nestSerial, function(data) {
      var thermostat = data.target_temperature;
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
  	console.log('Currently ' + data.current_temperature + ' degrees celcius');
  	console.log('Target is ' + data.target_temperature + ' degrees celcius');
  });
 });
