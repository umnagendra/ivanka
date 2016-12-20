var config          = require('../conf/config.json');
var logger          = require('winston');
var sparkCareClient = require('../util/sparkcare-client');

logger.level = config.system.debug ? "debug" : "info";

var SparkCareSessionManager = {};

SparkCareSessionManager.establishSession = function(thisSession) {
    // Get session authorization from Spark Care
    sparkCareClient.getSessionAuthorization()
        .then(function(response) {
            logger.debug('Got response. Value of `Set-Bubble-Authorization` is ' + response.headers['set-bubble-authorization']);
            thisSession.sparkcare.sessiontoken = response.headers['set-bubble-authorization'];
        }).catch(function(error) {
           logger.error('Error getting session authorization from Spark Care:' + error);
        });
};

SparkCareSessionManager.createChat = function(thisSession) {
    sparkCareClient.createChat(thisSession)
        .then(function(response) {
            logger.info('Chat created successfully. MediaURL = ' + response.mediaUrl);
            thisSession.sparkcare.mediaURL = response.mediaUrl;
            thisSession.sparkcare.poller = setInterval(sparkCareClient.pollForChatEvents, config.contact_center.spark_care.eventPollingIntervalMS, thisSession);
        })
        .catch(function(error) {
            logger.error('Error creating chat:' + error);
        });
};

SparkCareSessionManager.sendChatMessage = function(thisSession, messageText) {
    sparkCareClient.encryptAndPushToContactCenter(thisSession, messageText);
};

SparkCareSessionManager.endChatSession = function(thisSession) {
    // TODO
}

SparkCareSessionManager.isLiveSupportAvailable = function() {
    var agentStats = sparkCareClient.getAgentStats();
    return agentStats.agentsLoggedIn ? true : false;
};

SparkCareSessionManager.createCallback = function(thisSession) {
    sparkCareClient.createCallback(thisSession)
        .then(function(response) {
            logger.info('Callback created successfully. MediaURL = ' + response.mediaUrl);
        }).catch(function(error) {
            logger.error('Error creating callback:' + error);
        });
};

module.exports = SparkCareSessionManager;