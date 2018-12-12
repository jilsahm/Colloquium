const Pattern = {
    ID : /^-?[1-9][0-9]{0,7}$/,
    NAME : /^\w{0,64}$/,
    TITLE : /^(\w| ){0,128}$/,
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
    }

};

module.exports = Validator;