var express     = require('express');
var health      = require('express-ping')

var app         = express();
var port        = process.env.PORT || 7070;

// ping API
app.use(health.ping());

// webhook API
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'valar_morghulis') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.listen(port, function() {
  console.log("Rosie listening on " + port);
});
