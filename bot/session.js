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
    this.incomingMessages.buffer = [];
    this.incomingMessages.latestTimestamp = null;
    this.user.id = id;
    this.user.name = 'Facebook User' + '.' + id;
    this.user.email = null;
    this.user.reason = null;
    this.sparkcare.sessiontoken = null;
    this.state = STATES.STARTED;
    this.questionsAsked = 0;
}

module.exports = {
    session : Session,
    STATES : STATES
};
