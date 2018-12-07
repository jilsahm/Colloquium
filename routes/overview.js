var express = require('express');
var router = express.Router();
var dbApi = require('../database/dbapi.js');
var sessionChecker = require('../modules/session.js');

router.get('/', sessionChecker, function(req, res, next) {
  res.send('TODO');
});

module.exports = router;
