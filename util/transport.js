var request     = require('request-promise-native');
var config      = require('../conf/config.json');
var logger      = require('winston');
var util        = require('util');

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
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token : config.fbPageAccessToken},
        method: 'POST',
        body: {recipient: {id : receiver}, message: msgData},
        json: true
    };
    request(options).then(success).catch(error);
};

module.exports = transport;
