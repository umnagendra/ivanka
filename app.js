var express     = require('express');
var health      = require('express-ping')

var app         = express();
var port        = process.env.PORT || 7070;

// ping API
app.use(health.ping());

app.listen(port, function() {
  console.log("Rosie listening on " + port);
});
