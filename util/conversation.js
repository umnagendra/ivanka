var messages        = require('../conf/messages.json');
var util            = require('util');
var fbClient        = require('../util/facebook-client');
var session         = require('../bot/session');
var sessionManager  = require('../bot/session-manager');
var config          = require('../conf/config.json');
var logger          = require('winston');

logger.level = config.debug ? "debug" : "info";
var conversation = {};

conversation.welcome = function(thisSession) {
    if (!thisSession || typeof thisSession !== 'object') {
        throw "{thisSession} arg is undefined or not an object";
    }
    fbClient.sendTextMessage(thisSession.user.id, messages.MSG_GREETING)
        .then(function(response) {
            // success
            logger.debug('Successfully sent message [%s] to messenger.', messages.MSG_GREETING);
        }).catch(function(error) {
            logger.error('Error sending message [%s] to messenger: %s', messages.MSG_GREETING, util.inspect(error.error));
            sessionManager.abortSession(thisSession.id);
        });
};

conversation.askQuestion = function(thisSession) {
    if (thisSession.questionsAsked === 0) {
        fbClient.sendTextMessage(thisSession.user.id, messages.MSG_ASK_EMAIL)
            .then(function(response) {
                thisSession.questionsAsked++;
            }).catch(function(error) {
                logger.error('Error sending message [%s] to messenger: %s', messages.MSG_ASK_EMAIL, util.inspect(error.error));
                sessionManager.abortSession(thisSession.id);
            });
    } else if (thisSession.questionsAsked === 1) {
        var question = messages.MSG_ASK_REASON_1 + thisSession.user.name + messages.MSG_ASK_REASON_2;
        fbClient.sendTextMessage(thisSession.user.id, question)
            .then(function(response) {
                thisSession.questionsAsked++;
            })
            .catch(function(error) {
                logger.error('Error sending message [%s] to messenger: %s', question, util.inspect(error.error));
                sessionManager.abortSession(thisSession.id);
            });
    }
    // TODO ask question
    if(thisSession.questionsAsked === config.totalQuestions) {
        thisSession.state = session.STATES.WAITING;
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
