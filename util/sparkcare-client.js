var request     = require('request-promise-native');
var config      = require('../conf/config.json');
var logger      = require('winston');

// constants
var SPARK_CARE_API_VERSION        = "v1";
var SPARK_CARE_CONTROL_API_URL    = "https://chatc.produs1.ciscoccservice.com/chatc/" + SPARK_CARE_API_VERSION;

logger.level = config.debug ? "debug" : "info";

var _constructCreateChatPayload = function(session) {
    var payload = {};
    payload.customerIdentity = {};
    payload.customerIdentity.Context_First_Name = session.user.name;
    payload.customerIdentity.Context_Work_Email = session.user.email;
    payload.reason = session.user.reason;
    payload.orgId = config.sparkCareOrgId;

    return payload;
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

sparkCareClient.createChat = function(session) {
    logger.info('Creating a chat from customer [%s] to Spark Care as part of org [%s] ...', session.user.name, config.sparkCareOrgId);
    var data = _constructCreateChatPayload(session);
    var options = {
        uri: SPARK_CARE_CONTROL_API_URL + '/chat',
        method: 'POST',
        headers: {
            'Cisco-On-Behalf-Of' : config.sparkCareOrgId,
            'Bubble-Origin' : config.sparkCareClientOrigin,
            'Accept' : 'application/json',
            'Bubble-Authorization' : session.sparkcare.sessiontoken
        },
        body: data,
        json: true
    };
    return request(options);
};

module.exports = sparkCareClient;
