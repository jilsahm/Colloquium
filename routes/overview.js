var express = require('express');
var router = express.Router();
var dbApi = require('../database/dbapi.js');
var sessionChecker = require('../modules/session.js');
var validator = require('../modules/sanitizer.js');

router.get('/', sessionChecker, async function(req, res, next) {
  res.render('overview', {competitors : await dbApi.fetchAllCompetitors()});
});

router.post('/', sessionChecker, async function(req, res, next) {
  var id = req.body.competitorid;
  var surename = req.body.surename;
  var lastname = req.body.lastname;

  if (validator.isValidCompetitor(id, surename, lastname)){
    if (id == -1){
      await dbApi.createCompetitor(id, surename, lastname);
    } else {
      await dbApi.updateCompetitor(id, surename, lastname);
    }
  }

  res.render('overview', {competitors : await dbApi.fetchAllCompetitors()});
});

router.delete('/', sessionChecker, async function(req, res, next) {
  const id = req.query.competitorid;
  //console.log("DELETE request incoming...")

  if (id && validator.isValidId(id)){
    await dbApi.deleteCompetitor(id);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
