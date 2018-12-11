var express = require('express');
var router = express.Router();
var sessionChecker = require('../modules/session');
var dbApi = require('../database/dbapi');
var sanitizer = require('../modules/sanitizer');

router.get('/', /*sessionChecker,*/ async function(req, res, next) {
    const competitorId = req.query.competitorid;

    if (competitorId && sanitizer.isValidId(competitorId) && competitorId > 0){
        res.render('details', {competitor : await dbApi.fetchOne('competitor', competitorId)});
    } else {
        res.redirect('overview');
    }
});

router.post('/', /*sessionChecker,*/ async function(req, res, next) {
    const topicId = req.body.topicid;
    const competitorId = req.body.competitorid;
    const title = req.body.title;
  
    if (sanitizer.isValidTopic(topicId, title, competitorId)){
        if (id == -1){
            await dbApi.createTopic(topicId, title, competitorId);
        } else {
            await dbApi.updateTopic(topicId, title, competitorId);
        }
    }
  
    res.render('details', {competitor : await dbApi.fetchOne('competitor', competitorId), topics : await dbApi.fetchAll('topic', competitorId)});
  });
  
router.delete('/', /*sessionChecker,*/ async function(req, res, next) {
    const id = req.query.topicid;

    if (id && sanitizer.isValidId(id)){
        await dbApi.deleteTopic(id);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;