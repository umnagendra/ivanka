const STATES = {
                  STARTED   : 'STARTED',
                  WELCOMED  : 'WELCOMED',
                  INQUIRED  : 'INQUIRED',
                  ENDED     : 'ENDED'
               };

Session = function(id) {
  this.id = id;
  this.state = STATES.STARTED;
}

module.exports = Session;
