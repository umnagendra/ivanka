var config          = require('../conf/config.json');
var util            = require('util');
var logger          = require('winston');
var session         = require('./session');
var hashmap         = require('hashmap');
var messages        = require('../conf/messages.json');
var fbClient        = require('../util/facebook-client');
var sparkCareClient = require('../util/sparkcare-client');
var conversation    = require('../util/conversation');

logger.level = config.debug ? "debug" : "info";

// Map <sender ID, session>
var sessionMap = new hashmap();

var _createNewSession = function(id) {
    logger.info('Creating new session with ID [%s]', id);
    thisSession = new session.session(id);
    sessionMap.set(id, thisSession);
    return thisSession;
};

var _abortSession = function(id) {
    logger.info('Aborting session with ID [%s]', id);
    // TODO inform customer about aborting session due to internal error
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

    // STEP 3: Get session authorization from Spark Care
    sparkCareClient.getSessionAuthorization()
        .then(function(response) {
            logger.debug('Got response. Value of `Set-Bubble-Authorization` is ' + response.headers['set-bubble-authorization']);
            thisSession.sparkcare.sessiontoken = response.headers['set-bubble-authorization'];

            // STEP 5: Trigger chat or callback
            // TODO
        }).catch(function(error) {
           logger.error('Error getting session authorization from Spark Care:' + error);
           _abortSession(id);
        });

    return thisSession;
};

SessionManager.removeSession = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }
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

    sparkCareClient.createChat(thisSession)
        .then(function(response) {
            logger.info('Chat created successfully. MediaURL = ' + response.mediaUrl);
            thisSession.sparkcare.mediaURL = response.mediaUrl;
            thisSession.sparkcare.poller = setInterval(sparkCareClient.pollForChatEvents, config.customerPollingIntervalMS, thisSession);
        })
        .catch(function(error) {
            logger.error('Error creating chat:' + error);
            _abortSession(id);
        });
};

SessionManager.sendChatMessage = function(id, messageText) {
    if (!id) {
        throw "{id} param is undefined";
    }

    var thisSession = sessionMap.get(id);
    if (!thisSession) {
            throw "invalid session [ID: " + id + "]";
    }

    sparkCareClient.encryptAndPushToContactCenter(thisSession, messageText);
};

module.exports = SessionManager;
