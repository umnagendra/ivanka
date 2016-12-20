var STATES = {
    "STARTED"     : "STARTED",
    "INFO"        : "INFO",
    "WAITING"     : "WAITING",
    "TALKING"     : "TALKING",
    "ENDED"       : "ENDED"
};

Session = function(id) {
    this.user = {
        id          : id,
        name        : 'Facebook User(' + id + ')',
        email       : null,
        reason      : null
    };

    this.incomingMessages = {
        buffer: []
    };

    this.outgoingMessages = {
        buffer: []
    };

    this.state = STATES.STARTED;

    this.questionsAsked = 0;

    this.sparkcare = {
        sessiontoken        : null,
        mediaURL            : null,
        keyURL              : null,
        encryptionKey       : null,
        decryptionKey       : null
    };

    this.socialminer = {
        // TODO
    };
}

module.exports = {
    session : Session,
    STATES : STATES
};
