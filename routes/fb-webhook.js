var express         = require('express');
var config          = require('../conf/config.json');
var messages        = require('../conf/messages.json');
var util            = require('util');
var logger          = require('winston');
var session         = require('../bot/session');
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
            if (SessionManager.isSessionExist(sender)
                    && (SessionManager.getSession(sender).state !== session.STATES.STARTED
                    || SessionManager.getSession(sender).state !== session.STATES.ENDED)) {
                var thisSession = SessionManager.getSession(sender);
                switch(thisSession.state) {
                    case session.STATES.INFO:
                        conversation.captureAnswer(thisSession, text);
                        conversation.askQuestion(thisSession);
                        if(thisSession.questionsAsked === config.totalQuestions) {
                            thisSession.state = session.STATES.WAITING;
                            conversation.sendTextMessage(thisSession, messages.MSG_WAIT);
                            // TODO check for agent availability. If no, sleep a bit and do callback
                            SessionManager.createChat(thisSession.user.id);
                        }
                        break;

                    case session.STATES.TALKING:
                        // TODO drain any msgs in buffer
                        // TODO push message to spark care
                        break;

                    default:    // this is the 'WAITING' state
                        SessionManager.addMessageToBuffer(thisSession.user.id, text);
                        break;
                }
            } else {
                // new sender, so create a session
                var thisSession = SessionManager.createSession(sender);
                conversation.welcome(thisSession);
                SessionManager.addMessageToBuffer(thisSession.user.id, text);
                thisSession.state = session.STATES.INFO;
                conversation.askQuestion(thisSession);
            }
        }
    }
    logger.debug('State of the session [ID: %s] is: %s', sender, util.inspect(SessionManager.getSession(sender)));
    res.sendStatus(200);
});

module.exports = router;
