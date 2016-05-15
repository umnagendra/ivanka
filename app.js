var express     = require('express');
var health      = require('express-ping');
var bodyParser  = require('body-parser');
var httpLogger  = require('morgan');
var config      = require('./conf/config.json');

// routers
var index       = require('./routes/index');
var fbWebhook   = require('./routes/fb-webhook');

var port        = process.env.PORT || config.serverPort;
var app         = express();

app.use(bodyParser.json());
app.use(httpLogger('short'));
app.use(health.ping());

// setup routes
app.use('/', index);
app.use('/webhook', fbWebhook);

app.listen(port, function() {
  console.log('Rosie listening on ' + port);
});
