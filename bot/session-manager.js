var config          = require('../conf/config.json');
var util            = require('util');
var logger          = require('winston');
var session         = require('./session');
var hashmap         = require('hashmap');
var messages        = require('../conf/messages.json');
var transport       = require('../util/transport.js');
var conversation    = require('../util/conversation');

logger.level = config.debug ? "debug" : "info";

// Map <sender ID, session>
var sessionMap = new hashmap();

var _createNewSession = function(id, username) {
    logger.info('Creating new session with ID [%s] for user [%s]', id, username);
    thisSession = new session.session(id, username);
    sessionMap.set(id, thisSession);
    return thisSession;
};

var SessionManager = {};

SessionManager.getSession = function(id) {
    if (id) {
        return this.sessionMap.get(id);
    }
    return null;
};

SessionManager.createSession = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }
    transport.getUserNameFromFBId(id,
        function(response) {
            var username = response.first_name + ' ' + response.last_name;
            var thisSession = _createNewSession(id, username);
            conversation.welcome(thisSession);
        },
        function(error) {
            logger.error('Error retrieving user name from ID [%s]: %s', id, util.inspect(error));
            // create a session anyway, with a default username
            var thisSession = _createNewSession(id, null);
            conversation.welcome(thisSession);
            // TODO more
        }
    );
}

SessionManager.removeSession = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }
    logger.info('Removing existing session with ID [%s]', id);
    sessionMap.remove(id);
}

SessionManager.isSessionExist = function(id) {
    return sessionMap.has(id);
}

module.exports = SessionManager;
