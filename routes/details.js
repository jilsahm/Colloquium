var express = require('express');
var router = express.Router();
var dbApi = require('../database/dbapi');
var sanitizer = require('../modules/sanitizer');

router.get('/', async function(req, res, next) {
    const competitorId = req.query.competitorId;

    if (competitorId && sanitizer.isValidId(competitorId) && competitorId > 0){
        res.render('details', {competitor : await dbApi.fetchOneCompetitor(competitorId)});
    } else {
        res.redirect('overview');
    }
});

module.exports = router;