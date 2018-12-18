const Pattern = {
    ANSWER_RATING : /^([0-9]|10)$/,
    CONTENT : /^(\w|[ \.\?\-',;äöüÄÖÜß]){0,256}$/,
    ELAPSED_TIME : /^([1-9][0-9]{0,9}|0)(\.[0-9]{1,14})?$/,
    ID : /^-?[1-9][0-9]{0,7}$/,

    // 00:00:00.000 - 23:59:59.999
    // (([01][0-9]|2[0-3])(:([0-5][0-9])){2}|24:00:00)\.[0-9]{3}(Z|[+-]([0][0-9]|1[01]))(:[0-5][0-9])?
    ISO8601 : /^(([+-][0-9][0-9]?)?|[+-]?)[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3])(:([0-5][0-9])){2}|24:00:00)\.[0-9]{3}(Z|[+-]([0][0-9]|1[01]))(:[0-5][0-9])?$/,
    
    NAME : /^(\w|[äöüÄÖÜß]){1,64}$/,
    SESSIONSIZE : /^[1-9][0-9]{0,3}$/,
    TITLE : /^(\w|[ \.\?\-',;äöüÄÖÜß]){0,128}$/,
    TYPE : /^(critique|question|session)$/
};

const Validator = {

    isValidCompetitor(id, surename, lastname){
        return Pattern.ID.test(id) && Pattern.NAME.test(surename) && Pattern.NAME.test(lastname);
    },

    isValidId(id){
        return Pattern.ID.test(id);
    },

    isValidTopic(topicId, title, competitorId){
        return Pattern.ID.test(topicId) && Pattern.TITLE.test(title) && Pattern.ID.test(competitorId);
    },

    isValidQuestion(questionId, content, answerRating, topicId){
        return Pattern.ID.test(questionId) && Pattern.CONTENT.test(content) && Pattern.ANSWER_RATING.test(answerRating) && Pattern.ID.test(topicId);
    },

    isValidISO8601(dateString){
        return Pattern.ISO8601.test(dateString);
    },

    isValidSession(sessionDate, elapsedTime, topicId){
        return Pattern.ISO8601.test(sessionDate) && Pattern.ELAPSED_TIME.test(elapsedTime) && Pattern.ID.test(topicId);
    },

    isValidType(type){
        return Pattern.TYPE.test(type);
    }

};

module.exports = Validator;