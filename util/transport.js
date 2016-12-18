var request     = require('request');
var config      = require('../conf/config.json');
var logger      = require('winston');

logger.level = config.debug ? "debug" : "info";

var transport = {};

transport.sendTextMessage = function(receiver, msgText) {
    logger.info('Outgoing message to %s: [%s]', receiver, msgText);
    msgData = {
        text : msgText
    };
    request({
        url:    'https://graph.facebook.com/v2.6/me/messages',
        qs:     {access_token : config.fbPageAccessToken},
        method: 'POST',
        json: {
            recipient:  {id : receiver},
            message:    msgData,
        }
    }, function(error, response, body) {
        if (error) {
            logger.error('Error sending message [%s] to messenger: %s', msgText, JSON.stringify(error));
        } else if (response.body.error) {
            logger.error('Error sending message [%s] to messenger: %s', msgText, JSON.stringify(response.body.error));
        } else {
            // success
            logger.debug('Successfully sent message [%s] to messenger.', msgText);
        }
    });
};

module.exports = transport;
