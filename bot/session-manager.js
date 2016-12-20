var config                  = require('../conf/config.json');
var messages                = require('../conf/messages.json');
var logger                  = require('winston');
var hashmap                 = require('hashmap');
var session                 = require('./session');
var fbClient                = require('../util/facebook-client');
var conversation            = require('../util/conversation');
var sparkCareSessionManager = require('./spark-care-session-manager');

logger.level = config.system.debug ? "debug" : "info";

var _getContactCenterClient = function() {
    switch(config.system.contact_center) {
        case "spark_care":
            return sparkCareSessionManager;

        case "socialminer":
            // TODO
            return undefined;

        default:
            logger.error('Unknown contact center [%s] configured.', config.system.contact_center);
    }
};

var _informCustomerAboutAbort = function(id) {
    fbClient.sendTextMessage(id, messages.MSG_ABORT)
        .then(function(){});
}

// Map <sender ID, session>
var sessionMap = new hashmap();

var contactCenterClient = _getContactCenterClient();

var _createNewSession = function(id) {
    logger.info('Creating new session with ID [%s]', id);
    thisSession = new session.session(id);
    sessionMap.set(id, thisSession);
    return thisSession;
};

var _abortSession = function(id) {
    logger.info('Aborting session with ID [%s]', id);
    _informCustomerAboutAbort(id);
    sessionMap.remove(id);
}

var SessionManager = {};

SessionManager.getSession = function(id) {
    if (id) {
        return sessionMap.get(id);
    }
    return null;
};

SessionManager.createSession = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }

    // STEP 1: Create a new session. (STATE = STARTED)
    var thisSession = _createNewSession(id);

    // STEP 2: Get username from Facebook
    fbClient.getUserNameFromFBId(id,
        function(response) {
            thisSession.user.name = response.first_name;
            logger.debug('Got first name [%s] for id [%s]', thisSession.user.name, id);
        },
        function(error) {
            logger.error('Error retrieving user name from ID [%s]: %s', id, util.inspect(error));
        }
    );

    contactCenterClient.establishSession(thisSession);

    return thisSession;
};

SessionManager.endSession = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }
    contactCenterClient.endChatSession(sessionMap.getSession(id));
    logger.info('Removing existing session with ID [%s]', id);
    sessionMap.remove(id);
};

SessionManager.abortSession = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }
    logger.info('Aborting existing session with ID [%s]', id);
    var thisSession = sessionMap.get(sessionId);
    // cancel the interval
    cancelInterval(thisSession.sparkcare.poller);
    _abortSession(id);
};

SessionManager.isSessionExist = function(id) {
    return sessionMap.has(id);
};

SessionManager.addIncomingMessageToBuffer = function(sessionId, messageText) {
    var thisSession = sessionMap.get(sessionId);

    if (!thisSession) {
        throw "invalid session [ID: " + sessionId + "]";
    }

    thisSession.incomingMessages.buffer.push(messageText);
};

SessionManager.createChat = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }

    var thisSession = sessionMap.get(id);
    if (!thisSession) {
            throw "invalid session [ID: " + id + "]";
    }

    contactCenterClient.createChat(thisSession);
};

SessionManager.sendChatMessage = function(id, messageText) {
    if (!id) {
        throw "{id} param is undefined";
    }

    var thisSession = sessionMap.get(id);
    if (!thisSession) {
            throw "invalid session [ID: " + id + "]";
    }

    contactCenterClient.sendChatMessage(thisSession, messageText);
};

module.exports = SessionManager;
