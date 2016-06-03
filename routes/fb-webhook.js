var express         = require('express');
var config          = require('../conf/config.json');
var SessionManager  = require('../bot/session-manager');
var conversation    = require('../util/conversation');

var router = express.Router();

router.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === config.fbWebhookToken) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

router.post('/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log('RECEIVED: ' + text);

      // check if an existing session exists for this sender
      if (SessionManager.isSessionExist(sender)) {
        // TODO lookup existing session state, and handle accordingly
      } else {
        // new sender, so create a session
        session = SessionManager.createSession(sender);
        conversation.welcome(session);
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
  }
  res.sendStatus(200);
});

module.exports = router;
