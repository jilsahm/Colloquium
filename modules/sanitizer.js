const Pattern = {
    ID : /^-?[1-9][0-9]{0,7}$/,
    NAME : /^\w{0,64}$/
};

const Validator = {

    isValidCompetitor(id, surename, lastname){
        return Pattern.ID.test(id) && Pattern.NAME.test(surename) && Pattern.NAME.test(lastname);
    }

};

module.exports = Validator;