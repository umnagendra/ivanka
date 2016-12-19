var STATES = {
    "STARTED"     : "STARTED",
    "INFO"        : "INFO",
    "WAITING"     : "WAITING",
    "TALKING"     : "TALKING",
    "ENDED"       : "ENDED"
};

Session = function(id) {
    this.user = {};
    this.sparkcare = {};
    this.incomingMessages = {};
    this.outgoingMessages = {};
    this.incomingMessages.buffer = [];
    this.outgoingMessages.buffer = [];
    this.user.id = id;
    this.user.name = 'Facebook User' + '.' + id;
    this.user.email = null;
    this.user.reason = null;
    this.sparkcare.sessiontoken = null;
    this.sparkcare.mediaURL = null;
    this.sparkcare.keyURL = null;
    this.sparkcare.encryptionKey = null;
    this.sparkcare.decryptionKey = null;
    this.state = STATES.STARTED;
    this.questionsAsked = 0;
}

module.exports = {
    session : Session,
    STATES : STATES
};
