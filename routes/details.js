var express = require('express');
var router = express.Router();
var sessionChecker = require('../modules/session');
var dbApi = require('../database/dbapi');
var sanitizer = require('../modules/sanitizer');

router.get('/', /*sessionChecker,*/ async function(req, res, next) {
    const competitorId = req.query.competitorid;

    if (competitorId && sanitizer.isValidId(competitorId) && competitorId > 0){
        var competitor = await dbApi.fetchOne('competitor', competitorId);
        var topics = await dbApi.fetchAll('topic', competitorId);
        var sessionSizes = await dbApi.fetchAll('sessionsize');

        res.render('details', {
            competitor : competitor,
            topics : topics,
            sessionSizes : sessionSizes
        });
    } else {
        res.redirect('overview');
    }
});

router.post('/', /*sessionChecker,*/ async function(req, res, next) {
    const topicId = req.body.topicid;
    const competitorId = req.body.competitorid;
    const title = req.body.title;
    const sessionSize = req.body.sessionsize;
  
    if (sanitizer.isValidTopic(topicId, title, competitorId, sessionSize)){
        if (topicId == -1){
            await dbApi.create("topic", [topicId, title, competitorId, sessionSize]);
        } else {
            await dbApi.updateTopic(topicId, title, competitorId, sessionSize);
        }
    }

    var competitor = await dbApi.fetchOne('competitor', competitorId);
    var topics = await dbApi.fetchAll('topic', competitorId);
    var sessionSizes = await dbApi.fetchAll('sessionsize');

    res.render('details', {
        competitor : competitor,
        topics : topics,
        sessionSizes : sessionSizes
    });
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

// Session view
router.get('/session', /*sessionChecker,*/ async function(req, res, next){
    const topicId = req.query.topicid;
    const competitorId = req.query.competitorid;

    const dummyStatistics = {
        numberOfSessions : 3,
        averageSessionTime : 14.34,
        averageAnswerRating : 7.8
    }
    if (Pattern.ID.test(topicId) && Pattern.ID.test(competitorId)){
        res.render('session', {statistic : dummyStatistics})
    } else {
        res.redirect('/overview');
    }
});

module.exports = router;