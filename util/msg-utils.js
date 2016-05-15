var request     = require('request');
var config      = require('../conf/config.json');

var msgUtils = {};

msgUtils.sendTextMessage = function(receiver, msgText) {
  console.log('Sending message [' + msgText + '] to ' + receiver + '...');
  console.log('fb page access token is ' + config.fbPageAccessToken);
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
      console.error('Error sending message [' + msgText + '] to messenger: ', error);
    } else if (response.body.error) {
      console.log('Error sending message [' + msgText + '] to messenger: ', response.body.error);
    }
  });
};

module.exports = msgUtils;
