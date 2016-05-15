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
      console.log("RECEIVED: " + text);
      // TODO - For every message:
      // TODO - 1. Check if the sender is greeting you (hi, hello, hii, hey)
      // TODO - 2. If greeting, greet him back, and ask him how you can help him
      // TODO - 3. Then let him send his problem stmt - stem + tokenize, and match keywords
      // TODO - If direct match with keywords, check if it falls under known FAQs and present answers
      // TODO - Does that answer his question (ask)? If (no, not, really, kinda, kind of somewhat), then fwd request to SM
      // TODO - If no direct match, say sorry and present a structured msg with problem stmts
      // TODO - Get choice postback and send a request into SM and tell him to hold on
    }
  }
  res.sendStatus(200);
});

app.listen(port, function() {
  console.log("Rosie listening on " + port);
});
