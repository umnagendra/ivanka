var request     = require('request');
var config      = require('../conf/config.json');

var transport = {};

transport.sendTextMessage = function(receiver, msgText) {
  console.log('Sending message [' + msgText + '] to ' + receiver + '...');
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
                console.error('Error sending message [' + msgText + '] to messenger: ', response.body.error);
              } else {
                // success
                console.log('Successfully sent message [' + msgText + '] to messenger.');
              }
          });
};

module.exports = transport;
