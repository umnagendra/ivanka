var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('You are not supposed to be here. Ivanka is a server-only app. See https://github.com/umnagendra/ivanka');
});

module.exports = router;
