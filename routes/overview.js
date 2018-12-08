var express = require('express');
var router = express.Router();
var dbApi = require('../database/dbapi.js');
var sessionChecker = require('../modules/session.js');

const testData = {
  competitors : [
    {
      surename : 'Eve',
      lastname : 'Ling',
      numberOfSessions : 6
    }
  ]
}

router.get('/', sessionChecker, async function(req, res, next) {
  res.render('overview', {competitors : await dbApi.fetchAllCompetitors()});
});

module.exports = router;
