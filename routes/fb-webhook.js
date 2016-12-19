var express         = require('express');
var config          = require('../conf/config.json');
var util            = require('util');
var logger          = require('winston');
var SessionManager  = require('../bot/session-manager');
var conversation    = require('../util/conversation');

logger.level = config.debug ? "debug" : "info";

var router = express.Router();

router.get('/', function (req, res) {
    logger.debug('Received GET request: ' + util.inspect(req.query, false, null));
    if (req.query['hub.verify_token'] === config.fbWebhookToken) {
        res.send(req.query['hub.challenge']);
    } else {
        logger.error('Wrong validation token [%s] received from facebook. Expected [%s]', req.query['hub.verify_token'], config.fbWebhookToken);
        res.send('Error, wrong validation token');
    }
});

router.post('/', function (req, res) {
    logger.debug('Received POST request: ' + util.inspect(req.body, false, null));
    var messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        var event = messaging_events[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text;
            logger.info('Incoming message: [%s]', text);

            // check if an existing session exists for this sender
            if (SessionManager.isSessionExist(sender) && SessionManager.getSession(sender).state !== "STARTED") {
                // TODO lookup existing session state, and handle accordingly
            } else {
                // new sender, so create a session
                var thisSession = SessionManager.createSession(sender);
                conversation.welcome(thisSession);
                SessionManager.addMessageToBuffer(thisSession.user.id, text);
                // start asking him questions
            }
        }
    }
    logger.debug('State of the session [ID: %s] is: %s', sender, util.inspect(SessionManager.getSession(sender)));
    res.sendStatus(200);
});

module.exports = router;
