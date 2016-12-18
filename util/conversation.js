var messages        = require('../conf/messages.json');
var transport       = require('../util/transport');
var session         = require('../bot/session');

var conversation = {};

conversation.welcome = function(thisSession) {
    if (!thisSession || typeof thisSession !== 'object') {
        throw "{thisSession} arg is undefined or not an object";
    }
    transport.sendTextMessage(thisSession.id, messages.MSG_GREETING);
    // transition state to WELCOMED
    thisSession.state = session.STATES.WELCOMED;
};

module.exports = conversation;
