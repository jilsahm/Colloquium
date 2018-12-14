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

    console.log(await dbApi.fetchOne('statistics', topicId));

    const dummyStatistics = {
        numberOfSessions : 3,
        averageSessionTime : 14.34,
        averageAnswerRating : 7.8
    };
    const dummySessions = [
        {
            date : '2017-14-12',
            duration : 14.14,
            critiques : [
                {
                    content : 'More colores!'
                },
                {
                    content : 'More animations!'
                },
                {
                    content : 'Usage of to many fill words...'
                }
            ]
        },
        {
            date : '2017-14-11',
            duration : 14.55,
            critiques : [
                {
                    content : 'More colores!'
                },
                {
                    content : 'More animations!'
                },
                {
                    content : 'Usage of to many fill words...'
                }
            ]
        }
    ];
    const dummyQuestions = [
        {
            id : 1,
            content : 'What the heck is...?',
            timesAsked : 1,
            answerRating: 8.6
        },
        {
            id : 2,
            content : 'What the hell is...?',
            timesAsked : 2,
            answerRating: 7.0
        }
    ];

    const competitor = await dbApi.fetchOne('competitor', competitorId);
    const topic = await dbApi.fetchOne('topic', topicId);

    if (sanitizer.isValidId(topicId) && sanitizer.isValidId(competitorId)){
        res.render('session', {
            competitor : competitor,
            topic : topic,
            statistic : dummyStatistics,
            sessions : dummySessions,
            questions : dummyQuestions
        });
    } else {
        res.redirect('/overview');
    }
});

module.exports = router;