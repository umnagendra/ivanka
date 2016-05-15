var express     = require('express');
var health      = require('express-ping');
var bodyParser  = require('body-parser');

var app         = express();
var port        = process.env.PORT || 7070;

// parse application/json
app.use(bodyParser.json());

// ping API
app.use(health.ping());

// webhook token verify API
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'valar_morghulis') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// Receives messages on the fb page
app.post('/webhook', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log("Received text on fb page: [" + text + "]");
      // TODO actual bot stuff
    }
  }
  res.sendStatus(200);
});

app.listen(port, function() {
  console.log("Rosie listening on " + port);
});
