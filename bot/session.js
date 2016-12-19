const STATES = {
                  "STARTED"   : "STARTED",
                  "WELCOMED"  : "WELCOMED",
                  "INQUIRED"  : "INQUIRED",
                  "ENDED"     : "ENDED"
               };

Session = function(id, username) {
    this.user = {};
    this.user.id = id;
    this.user.name = username ? username : "Facebook User";
    this.state = STATES.STARTED;
}

module.exports = {
    session : Session,
    STATES : STATES
};
