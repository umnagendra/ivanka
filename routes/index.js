var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.send("You are not supposed to be here. Rosie is a server-only app. See https://github.com/umnagendra/rosie");
});

module.exports = router;
