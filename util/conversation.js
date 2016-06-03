var messages        = require('../conf/messages.json');
var transport       = require('../util/transport');
var session         = require('../bot/session');

var conversation = {};

conversation.welcome = function(session) {
  if (!session || typeof session !== 'object') {
    throw "{session} arg is undefined or not an object";
  }
  transport.sendTextMessage(session.id, messages.MSG_GREETING);
  // transition state to WELCOMED
  session.state = session.STATES.WELCOMED;
};

module.exports = conversation;
