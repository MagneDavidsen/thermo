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
