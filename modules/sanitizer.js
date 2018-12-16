const Pattern = {
    ANSWER_RATING : /^([0-9]|10)$/,
    CONTENT : /^(\w|[ \.\?',;äöüÄÖÜß]){0,256}$/,
    ID : /^-?[1-9][0-9]{0,7}$/,
    NAME : /^(\w|[äöüÄÖÜß]){1,64}$/,
    TITLE : /^(\w|[ \.\?',;äöüÄÖÜß]){0,128}$/,
    SESSIONSIZE : /^[1-9][0-9]{0,3}$/
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
    }

};

module.exports = Validator;