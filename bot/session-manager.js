var config      = require('../conf/config.json');
var logger      = require('winston');
var session     = require('./session');
var hashmap     = require('hashmap');
var messages    = require('../conf/messages.json');

logger.level = config.debug ? "debug" : "info";

// Map <sender ID, session>
var sessionMap = new hashmap();

var SessionManager = {};

SessionManager.getSession = function(id) {
    if (id) {
        return this.sessionMap.get(id);
    }
    return null;
};

SessionManager.createSession = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }
    logger.info('Creating new session with ID [' + id + ']');
    thisSession = new session.session(id);
    sessionMap.set(id, thisSession);
    return thisSession;
}

SessionManager.removeSession = function(id) {
    if (!id) {
        throw "{id} param is undefined";
    }
    logger.info('Removing existing session with ID [' + id + ']');
    sessionMap.remove(id);
}

SessionManager.isSessionExist = function(id) {
    return sessionMap.has(id);
}

module.exports = SessionManager;
