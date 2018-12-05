var express = require('express');
var router = express.Router();
var dbApi = require('../database/dbapi.js');

router.get('/', function(req, res, next) {
  res.send('TODO');
});

router.post('/', function(req, res, next) {
  res.send(req.body);
  next();
});

router.post('/', function(req, res, next) {
  console.log("Simulated Error");
});

module.exports = router;
