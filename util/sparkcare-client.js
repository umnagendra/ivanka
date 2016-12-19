var request     = require('request-promise-native');
var util        = require('util');
var session     = require('../bot/session');
var config      = require('../conf/config.json');
var logger      = require('winston');

// constants
var SPARK_CARE_API_VERSION        = "v1";
var SPARK_CARE_CONTROL_API_URL    = "https://chatc.produs1.ciscoccservice.com/chatc/" + SPARK_CARE_API_VERSION;

logger.level = config.debug ? "debug" : "info";

var _constructCreateChatPayload = function(thisSession) {
    var payload = {};
    payload.customerIdentity = {};
    payload.customerIdentity.Context_First_Name = thisSession.user.name;
    payload.customerIdentity.Context_Work_Email = thisSession.user.email;
    payload.reason = thisSession.user.reason;
    payload.orgId = config.sparkCareOrgId;

    return payload;
};

var _getChatEvents = function(session) {
    logger.debug('GETting chat events from session ID [%s] using mediaURL [%s] ...', session.user.id, session.sparkcare.mediaURL);
    var options = {
        uri: session.sparkcare.mediaURL,
        method: 'GET',
        headers: {
            'Cisco-On-Behalf-Of' : config.sparkCareOrgId,
            'Bubble-Origin' : config.sparkCareClientOrigin,
            'Accept' : 'application/json',
            'Bubble-Authorization' : session.sparkcare.sessiontoken
        },
        json: true
    };
    return request(options);
};

var _processChatEvents = function(thisSession, msgArray) {
    if (! msgArray instanceof Array) {
        throw '{msgArray} is not an Array';
    }
    for(var i = 0; i < msgArray.length; i++) {
        var data = msgArray[i].data;
        if (!data || !data.eventType) {
            continue;
        }
        switch(data.eventType) {
            case 'encryption.encrypt_key':
                thisSession.sparkcare.encryptionKey = data.keyValue;
                break;

            case 'participant.info':
                thisSession.state = session.STATES.TALKING;
                _encryptAndPushToContactCenter(thisSession);
                break;

            case 'conversation.activity':
                _decryptAndPublishToCustomer(thisSession, data.msg);
                break;

            case 'encryption.decrypt_key':
                thisSession.sparkcare.decryptionKey = data.keyValue;
                break;

            default:
                logger.error('Unknown chat event with type [%s] received. Ignoring...', data.eventType);
        }
    }
};

var _encryptAndPushToContactCenter = function(thisSession) {
    logger.debug('Encrypting messages in buffer [%s] using encryption key [%s]', util.inspect(thisSession.incomingMessages.buffer), thisSession.sparkcare.encryptionKey);
    // TODO
};

var _decryptAndPublishToCustomer = function(thisSession, cipherText) {
    logger.debug('Decrypting message [%s] using decryption key [%s]', cipherText, thisSession.sparkcare.decryptionKey);
    // TODO
};

var sparkCareClient = {};

sparkCareClient.getSessionAuthorization = function() {
    logger.info('Asking for authorization from Spark Care for orgId [%s] from client origin [%s] ...', config.sparkCareOrgId, config.sparkCareClientOrigin);
    var options = {
        uri: SPARK_CARE_CONTROL_API_URL + "/chat/session",
        method: 'POST',
        headers: {
            'Cisco-On-Behalf-Of' : config.sparkCareOrgId,
            'Bubble-Origin' : config.sparkCareClientOrigin,
            'Accept' : 'application/json',
        },
        json: true,
        resolveWithFullResponse: true
    };
    return request(options);
};

sparkCareClient.createChat = function(thisSession) {
    logger.info('Creating a chat from customer [%s] to Spark Care as part of org [%s] ...', thisSession.user.name, config.sparkCareOrgId);
    var data = _constructCreateChatPayload(thisSession);
    var options = {
        uri: SPARK_CARE_CONTROL_API_URL + '/chat',
        method: 'POST',
        headers: {
            'Cisco-On-Behalf-Of' : config.sparkCareOrgId,
            'Bubble-Origin' : config.sparkCareClientOrigin,
            'Accept' : 'application/json',
            'Bubble-Authorization' : thisSession.sparkcare.sessiontoken
        },
        body: data,
        json: true
    };
    return request(options);
};

sparkCareClient.pollForChatEvents = function(thisSession) {
    _getChatEvents(thisSession)
        .then(function(response) {
            logger.debug('Response from polling chat events: ' + util.inspect(response));
            _processChatEvents(thisSession, response.messages);
        })
        .catch(function(error) {
            logger.error('Error polling for chat events:' + error);
            sessionManager.abortSession(thisSession.user.id);
        });
};

module.exports = sparkCareClient;
