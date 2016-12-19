var request     = require('request-promise-native');
var config      = require('../conf/config.json');
var logger      = require('winston');
var util        = require('util');

// constants
var FB_GRAPH_API_VERSION        = "v2.8";
var FB_GRAPH_API_URL            = "https://graph.facebook.com/" + FB_GRAPH_API_VERSION;
var FB_PAGE_ACCESS_TOKEN_PARAM  = "access_token=" + config.fbPageAccessToken;

logger.level = config.debug ? "debug" : "info";

var transport = {};

transport.sendTextMessage = function(receiver, msgText, success, error) {
    if (!success || !error || typeof success !== "function" || typeof error !== "function") {
        throw "{success} and/or {error} args are either undefined or not valid functions";
    }
    logger.info('Outgoing message to %s: [%s]', receiver, msgText);
    var msgData = {
        text : msgText
    };
    var options = {
        uri: FB_GRAPH_API_URL + '/me/messages',
        qs: {access_token : config.fbPageAccessToken},
        method: 'POST',
        body: {recipient: {id : receiver}, message: msgData},
        json: true
    };
    request(options).then(success).catch(error);
};

transport.getUserNameFromFBId = function(fbId, success, error) {
    if(!fbId || !success || !error || typeof success !== "function" || typeof error !== "function") {
        throw "{fbId} is undefined, or {success} and/or {error} args are either undefined or not valid functions";
    }
    logger.debug('Getting facebook user name for ID: ' + fbId);
    var options = {
        uri: FB_GRAPH_API_URL + '/' + fbId + '?fields=first_name,last_name' + '&' + FB_PAGE_ACCESS_TOKEN_PARAM,
        method: 'GET',
        json: true
    };
    request(options).then(success).catch(error);
}

module.exports = transport;
