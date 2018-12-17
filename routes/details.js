var express = require('express');
var router = express.Router();
var sessionChecker = require('../modules/session');
var dbApi = require('../database/dbapi');
var sanitizer = require('../modules/sanitizer');

async function renderDetails(competitorId, res){
    var competitor = await dbApi.fetchOne('competitor', competitorId);
    var topics = await dbApi.fetchAll('topic', competitorId);
    var sessionSizes = await dbApi.fetchAll('sessionsize');

    res.render('details', {
        competitor : competitor,
        topics : topics,
        sessionSizes : sessionSizes
    });
}

router.get('/', /*sessionChecker,*/ async function(req, res, next) {
    const competitorId = req.query.competitorid;

    if (competitorId && sanitizer.isValidId(competitorId) && competitorId > 0){
        renderDetails(competitorId, res);
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
    renderDetails(competitorId, res);
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

async function renderSessions(competitorId, topicId, res){
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

    const competitor = await dbApi.fetchOne('competitor', competitorId);
    const topic = await dbApi.fetchOne('topic', topicId);
    const minutes = await dbApi.fetchOne('sessionsize', topic.sessionSize);
    const questions = await dbApi.fetchAll('question', topicId);

    res.render('session', {
        competitor : competitor,
        minutes : minutes.minutes,
        topic : topic,
        statistic : dummyStatistics,
        sessions : dummySessions,
        questions : questions
    });
}

router.get('/session', /*sessionChecker,*/ async function(req, res, next){
    const topicId = req.query.topicid;
    const competitorId = req.query.competitorid;

    //console.log(await dbApi.fetchOne('statistics', topicId));   

    if (sanitizer.isValidId(topicId) && sanitizer.isValidId(competitorId)){
        renderSessions(competitorId, topicId, res);
    } else {
        res.redirect('/overview');
    }
});

router.put('/session', /*sessionChecker,*/ async function(req, res, next){
    if (req.query.questionid){
        const questionId = req.query.questionid;
        const questionMod = req.query.mod;

        if (sanitizer.isValidId(questionId) && sanitizer.isValidId(questionMod)){
            dbApi.modifyQuestionCount();
        }
    } else {
        const sessionDate = req.query.sessiondate;
        const elapsedTime = req.query.elapsedtime;
        console.log(sessionDate, elapsedTime);
    }   
    res.sendStatus(200); 
});

router.post('/session', /*sessionChecker,*/ async function(req, res, next){
    const questionId = req.body.questionid;
    const competitorId = req.body.competitorid;
    const topicId = req.body.topicid;
    const question = req.body.question;
    const answerRating = req.body.answerrating;

    if (sanitizer.isValidQuestion(questionId, question, answerRating, topicId)){
        if (-1 == questionId){
            dbApi.create('question', [questionId, question, answerRating, topicId]);
        } else {
            dbApi.update('question', [questionId, question, answerRating]);
        }
    }
    renderSessions(competitorId, topicId, res);
});

router.delete('/session', /*sessionChecker,*/ async function(req, res, next){
    const type = req.query.type;
    const id = req.query.id;

    if (type && id && sanitizer.isValidType(type) && sanitizer.isValidId(id)) {
        await dbApi.deleteOne(type, id);
    }
    res.sendStatus(200);
});

module.exports = router;