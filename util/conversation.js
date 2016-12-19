var messages        = require('../conf/messages.json');
var util            = require('util');
var fbClient        = require('../util/facebook-client');
var session         = require('../bot/session');
var sessionManager  = require('../bot/session-manager');
var config          = require('../conf/config.json');
var logger          = require('winston');

logger.level = config.debug ? "debug" : "info";
var conversation = {};

conversation.welcome = function(thisSession) {
    if (!thisSession || typeof thisSession !== 'object') {
        throw "{thisSession} arg is undefined or not an object";
    }
    fbClient.sendTextMessage(thisSession.user.id, messages.MSG_GREETING,
        function(response) {
            // success
            logger.debug('Successfully sent message [%s] to messenger.', messages.MSG_GREETING);
        },
        function(error) {
            logger.error('Error sending message [%s] to messenger: %s', messages.MSG_GREETING, util.inspect(error.error));
            // clean-up session
            sessionManager.removeSession(thisSession.id);
        }
    );
};

conversation.askQuestion = function(thisSession) {
    // TODO ask question
    if(true) {
        thisSession.state = session.STATES.WAITING;
    }
};

conversation.captureAnswer = function(thisSession, messageText) {
    // TODO update session attributes from answer
    thisSession.user.name = 'Facebook User' + '.' + id;
    thisSession.user.email = this.user.id + '@facebook.com';
    thisSession.user.reason = 'Placeholder problem ' + (new Date).getTime();
};

module.exports = conversation;
