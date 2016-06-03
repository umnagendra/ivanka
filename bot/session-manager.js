var session     = require('./session');
var hashmap     = require('hashmap');
var messages    = require('../conf/messages.json');

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
  console.log('Creating new session with ID [' + id + ']');
  session = new session(id);
  sessionMap.set(id, session);
  return session;
}

SessionManager.removeSession = function(id) {
  if (!id) {
    throw "{id} param is undefined";
  }
  console.log('Removing existing session with ID [' + id + ']');
  sessionMap.remove(id);
}

SessionManager.isSessionExist = function(id) {
  return sessionMap.has(id);
}

module.exports = SessionManager;
