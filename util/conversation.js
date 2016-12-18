var messages        = require('../conf/messages.json');
var transport       = require('../util/transport');
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
    transport.sendTextMessage(thisSession.id, messages.MSG_GREETING,
        function(response) {
            // success
            logger.debug('Successfully sent message [%s] to messenger.', messages.MSG_GREETING);
            // transition state to WELCOMED
            thisSession.state = session.STATES.WELCOMED;
        },
        function(error) {
            logger.error('Error sending message [%s] to messenger: %s', messages.MSG_GREETING, util.inspect(error));
            // clean-up session
            sessionManager.removeSession(thisSession.id);
        }
    );
};

module.exports = conversation;
