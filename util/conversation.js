var messages        = require('../conf/messages.json');
var util            = require('util');
var fbClient        = require('../util/facebook-client');
var sessionManager  = require('../bot/session-manager');
var config          = require('../conf/config.json');
var logger          = require('winston');

logger.level = config.system.debug ? "debug" : "info";

var _askQuestion = function(thisSession, question) {
    conversation.sendTextMessage(thisSession, question, true)
        .then(function(response) {
            thisSession.questionsAsked++;
        })
        .catch(function(error) {
            logger.error('Error sending message [%s] to messenger: %s', question, util.inspect(error.error));
            sessionManager.abortSession(thisSession.user.id);
        });
};

var conversation = {};

conversation.sendTextMessage = function(thisSession, messageText, deferred = false) {
    if (!thisSession || typeof thisSession !== 'object') {
            throw "{thisSession} arg is undefined or not an object";
    }

    if (deferred) {
        return fbClient.sendTextMessage(thisSession.user.id, messageText);
    }

    fbClient.sendTextMessage(thisSession.user.id, messageText)
        .then(function(response) {
            // success
            logger.debug('Successfully sent message [%s] to messenger.', messageText);
        })
        .catch(function(error) {
            logger.error('Error sending message [%s] to messenger: %s', messageText, util.inspect(error.error));
            sessionManager.abortSession(thisSession.user.id);
        });
};

conversation.welcome = function(thisSession) {
    conversation.sendTextMessage(thisSession, messages.MSG_GREETING);
};

conversation.askQuestion = function(thisSession) {
    if (thisSession.questionsAsked === 0) {
        _askQuestion(thisSession, messages.MSG_ASK_EMAIL);
    } else if (thisSession.questionsAsked === 1) {
        var question = messages.MSG_ASK_REASON_1 + thisSession.user.name + messages.MSG_ASK_REASON_2;
        _askQuestion(thisSession, question);
    }
};

conversation.captureAnswer = function(thisSession, messageText) {
    if (thisSession.questionsAsked === 1) {
        thisSession.user.email = messageText;
    } else if (thisSession.questionsAsked === 2) {
        thisSession.user.reason = messageText;
    }
};

module.exports = conversation;
