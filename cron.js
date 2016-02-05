var netatmo = require('netatmo');
var api = require('./api.js');
var devices = require('./devices.js');
var config = require('./config.js');
var nest = require('nest-thermostat').init(process.env.nestUsername, process.env.nestPassword);

const heatersGroupId = "1124573";

var telldusApi = api(config.telldus);
var devices = devices(telldusApi);

var api = new netatmo(config.netatmo);

api.getStationsData(function(err, stations) {
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

          if(away) thermostat -= 3;

          if (actualTemp && thermostat) {
              if(actualTemp > thermostat + 1) {
                  devices.getDevices().then(function(sensors){
                      sensors.filter(x => x.id === heatersGroupId).map(devices.turnOff);
                  });
              }
              else if(actualTemp < thermostat) {
                devices.getDevices().then(function(sensors) {
                    sensors.filter(x => x.id === heatersGroupId).map(devices.turnOn);
                });
            }
        }
    });
});


});
