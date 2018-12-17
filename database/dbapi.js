const configs = require('../configs/dbconnections.json');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool(configs.postgres);
const SALT_LEVEL = 12;

async function debug(){
    await pool.query('SELECT * FROM Administrator')
        .then(result => console.log(result.rows[0]))
        .catch(error => console.log(error));
     
    var password = "test";
    var salt = bcrypt.genSaltSync(12);
    var hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    console.log(bcrypt.compareSync(password, hash));
}

class Query{
    constructor(sql, params){
        this.sql = sql;
        this.params = params;
    }
}

class Administrator{
    constructor(id, nickname, password){
        this.id = id;
        this.nickname = nickname;
        this.password = password;
    }
    isValid(password){
        return bcrypt.compareSync(password, this.password);
    }
    create(){
        const salt = bcrypt.genSaltSync(SALT_LEVEL);
        return new Query(
            `INSERT INTO Administrator(Nickname, Passwordhash) VALUES ($1, $2)`,
            [this.nickname, bcrypt.hashSync(this.password, salt)]
        );
    }
    update(){
        const salt = bcrypt.genSaltSync(SALT_LEVEL);
        return new Query(
            `UPDATE Administrator SET Nickname=$1, Passwordhash=$2 WHERE AdministratorID=$3`,
            [this.nickname, bcrypt.hashSync(this.password, salt), this.id]
        );
    }
    delete(){
        return new Query(
            `DELETE FROM Administrator WHERE AdministratorID=$1`,
            [this.id]
        );
    }
}
function factoryAdministrator(data){
    return new Administrator(data.administratorid, data.nickname, data.passwordhash);
}

class Competitor{
    constructor(id, surename, lastname){
        this.id = id;
        this.surename = surename;
        this.lastname = lastname;
    }
    create(){
        return new Query(
            `INSERT INTO Competitor(Lastname, Surename) VALUES ($1, $2)`,
            [this.lastname, this.surename]
        );
    }
    update(){
        return new Query(
            `UPDATE Competitor SET Lastname=$1, Surename=$2 WHERE CompetitorID=$3`,
            [this.lastname, this.surename, this.id]
        );
    }
    delete(){
        return new Query(
            `DELETE FROM Competitor WHERE CompetitorID=$1`,
            [this.id]
        );
    }
}
function factoryCompetitor(data){
    return new Competitor(data.competitorid, data.surename, data.lastname);
}

class Topic{
    constructor(id, title, competitorId, sessionSize){
        this.id = id;
        this.title = title;
        this.competitorId = competitorId;
        this.sessionSize = sessionSize;
    }
    create(){
        return new Query(
            `INSERT INTO Topic(Title, CompetitorID, SessionSizeID) VALUES ($1, $2, $3)`,
            [this.title, this.competitorId, this.sessionSize]
        );
    }
    update(){
        return new Query(
            `UPDATE Topic SET Title=$1, CompetitorID=$2, SessionSizeID=$3 WHERE TopicID=$4`,
            [this.title, this.competitorId, this.sessionSize, this.id]
        );
    }
    delete(){
        return new Query(
            `DELETE FROM Topic WHERE TopicID=$1`,
            [this.id]
        );
    }
}
function factoryTopic(data){
    return new Topic(data.topicid, data.title, data.competitorid, data.sessionsizeid);
}

class SessionSize{
    constructor(id, minutes){
        this.id = id;
        this.minutes = minutes;
    }
    create(){
        return new Query(
            `INSERT INTO SessionSize(Minutes) VALUES ($1)`,
            [this.minutes]
        );
    }
    update(){
        return new Query(
            `UPDATE SessionSize SET Minutes=$1 WHERE SessionSizeID=$2`,
            [this.minutes, this.id]
        );
    }
    delete(){
        return new Query(
            `DELETE FROM SessionSize WHERE SessionSizeID=$1`,
            [this.id]
        );
    }
}
function factorySessionSize(data){
    return new SessionSize(data.sessionsizeid, data.minutes);
}

class Session{
    constructor(id, startTime, endTime, sessionSizeId){
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.sessionSizeId = sessionSizeId;
    }
}
function factorySession(data){
    return new Session(data.sessionid, data.starttime, data.endtime, data.sessionsizeid);
}

class Question{
    constructor(id, content, answerRating, topicId, timesAsked = 0){
        this.id = id;
        this.content = content;
        this.answerRating = answerRating;
        this.topicId = topicId;
        this.timesAsked = timesAsked;
    }
    create(){
        return new Query(
            `INSERT INTO Question(Content, TimesAsked, AnswerRating, TopicID) VALUES ($1, 1, $2, $3)`,
            [this.content, this.answerRating, this.topicId]
        );
    }
    update(){
        return new Query(
            `UPDATE Question SET Content=$1, AnswerRating=$2 WHERE QuestionID=$3`,
            [this.content, this.answerRating, this.id]
        );
    }
    delete(){
        return new Query(
            `DELETE FROM Question WHERE QuestionID=$1`,
            [this.id]
        );
    }
}
function factoryQuestion(data){
    return new Question(data.questionid, data.content, data.answerrating, data.topicid, data.timesasked);
}

class Critique{
    //TODO
}

class Statistics{
    constructor(numberOfSessions, averageSessionTime, averageAnswerRating){
        this.numberOfSessions = numberOfSessions;
        this.averageSessionTime = averageSessionTime;
        this.averageAnswerRating = averageAnswerRating;
    }
}
function factoryStatistics(data){
    return new Statistics(data.numberOfSessions, data.averageSessionTime, data.averageAnswerRating);
}

const dbApi = {

    // Fetch methods

    /**
     * Fetchs one specific dataset from the database. It will automaticly transformed into an object.
     * @param {*} type A String with the name of the desired object. 
     * Possible types: "administrator", "competitor", "question", "topic", "sessionsize", "statistics"
     * @param {*} specifier The ID of the desired Object
     * @returns An Object of the desired type or undefined if no dataset was found.
     */
    fetchOne: async function(type, specifier) {
        var object = undefined;
        var query = undefined;
        var factory = undefined;

        switch (type){
            case 'administrator': 
                query = 'SELECT * FROM Administrator WHERE nickname=$1';
                factory = factoryAdministrator;
                break;
            case 'competitor':
                query = 'SELECT * FROM Competitor WHERE CompetitorID=$1';
                factory = factoryCompetitor;
                break;
            case 'question':
                query = 'SELECT * FROM Question WHERE QuestionID=$1';
                factory = factoryQuestion;
                break;
            case 'topic':
                query = 'SELECT * FROM Topic WHERE TopicID=$1';
                factory = factoryTopic;
                break;
            case 'sessionsize':
                query = 'SELECT * FROM SessionSize WHERE SessionSizeID=$1';
                factory = factorySessionSize;
                break;
            case 'statistics':
                query = `SELECT COUNT(s.SessionID) AS numberOfSessions,
                        AVG(s.Endtime - s.Starttime) AS averageSessionTime,
                        AVG(q.AnswerRating) AS averageAnswerRating 
                        FROM Session AS s, Question AS q                        
                        WHERE s.TopicID=$1 AND s.TopicID = q.TopicID`;
                factory = factoryStatistics;
                break;
        }
        if (query){
            await pool.query(query, [specifier])
                .then(result => {
                    if (result.rowCount === 1){
                        object = factory(result.rows[0]);
                    }
                })
                .catch(error => console.log(error));
        }
        return object;
    },

    /**
     * Fetchs all datasets from the database. It will automaticly transform then into objects.
     * @param {*} type A String with the name of the desired objects. 
     * Possible types: "administrator", "competitor", "question", "topic", "sessionsize"
     * @return An array of objects of the desired type. If no datasets are fetched the array is empty.
     */
    fetchAll: async function(type, specifier) {
        var objects = [];
        var query = undefined;
        var factory = undefined;

        switch (type){
            case 'administrator': 
                query = 'SELECT * FROM Administrator';
                factory = factoryAdministrator;
                break;
            case 'competitor':
                query = 'SELECT * FROM Competitor';
                factory = factoryCompetitor;
                break;
            case 'question':
                query = 'SELECT * FROM Question WHERE TopicID=$1';
                factory = factoryQuestion;
                break;
            case 'topic':
                query = 'SELECT * FROM Topic WHERE CompetitorID=$1';
                factory = factoryTopic;
                break;
            case 'sessionsize':
                query = 'SELECT * FROM SessionSize';
                factory = factorySessionSize;
                break;
        }
        if (query){
            var params = [];
            if (specifier){
                params.push(specifier);
            }
            await pool.query(query, params)
                .then(result => {
                    if (result.rowCount > 0){
                        for (let row of result.rows){
                            objects.push(factory(row));
                        }                        
                    }
                })
                .catch(error => console.log(error));
        }
        return objects;
    },

    /**
     * Saving a dataset to the Database.
     * @param {*} type Type of the objecttype to be saved or an objetc which implements the create method.
     * Possible types: "question", "topic", "sessionsize"
     * @param {*} params Constructor parameters array for the object. Dont uses this if the type is already an object.
     */
    create : async function(type, params, justUpdate = false){
        var query = undefined;

        if (params){
            var object = undefined;
            var constructor = undefined;            

            switch (type){
                case 'question':
                    constructor = Question;
                    break;
                case 'topic':
                    constructor = Topic;
                    break;
                case 'sessionsize':
                    constructor = SessionSize;
                    break;
            }
            if (constructor){
                object = new constructor(...params);
                query = (justUpdate) ? object.update() : object.create();

                pool.query(query.sql, query.params)
                    .catch(error => console.log(error));
            }
        } else {
            query = (justUpdate) ? type.update() : type.create();
            pool.query(query.sql, query.params)
                    .catch(error => console.log(error));
        }        
    },

    /**
     * Updating a dataset in the Database.
     * @param {*} type TODO
     * @param {*} params TODO
     */
    update : async function(type, params){
        this.create(type, params, true);
    },

    /**
     * Deletes an object from the database or, if the id and typename is given, the corresponding data.
     * @param {*} type Either an object which implements the delete method or on of the following typenames:
     * "critique", "question".
     * @param {*} id The id of the dataset. Leave it undefined if type is an object.
     */
    deleteOne : async function(type, id){
        var query = undefined;

        if (id) {
            switch (type) {
                case 'critique':
                    query = 'DELETE FROM Critique WHERE CritiqueID = $1';
                    break;
                case 'question':
                    query = 'DELETE FROM Question WHERE QuestionID = $1';
                    break;
            }
            if (query) {
                pool.query(query, [id]).catch(error => console.log(error));
            }
        } else {
            query = type.delete();
            pool.query(query.sql, query.params).catch(error => console.log(error));
        }        
    },

    //TODO
    deleteAll(type, specifier){
        var query = undefined;

        switch (type){
            // TODO
        }
    },

    modifyQuestionCount : async function(questionId, questionMod){
        const query = 'UPDATE Question SET TimesAsked = TimesAsked + $1 WHERE QuestionID = $2';
        const modifier = (-1 == questionMod) ? -1 : 1;
        pool.query(query, [modifier, questionId]).catch(error => console.log(error));
    },

    // Administrator CRUD
    // TODO
    // Hell, need to get rid of this...

    createAdministrator : function(administrator){
        const query = administrator.create();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    updateAdministrator : function(administrator){
        const query = administrator.update();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    deleteAdministrator : function(administrator){
        const query = administrator.delete();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    // Competitor CRUD

    fetchOneCompetitor : async function(competitorId){
        const query = "SELECT * FROM Competitor WHERE CompetitorId=$1";
        return pool.query(query, [competitorId])
            .then(result => {
                if (result.rowCount !== 1){
                    return undefined;
                }
                return factoryCompetitor(result.rows[0]);
            })
            .catch(error => console.log(error));
    },

    fetchAllCompetitors : async function(){
        const query = 'SELECT * FROM Competitor';
        var competitors = [];
        await pool.query(query)
            .then(result => {
                result.rows.forEach(row => {
                    competitors.push(factoryCompetitor(row));
                })
            })
            .catch(error => console.log(error));
        console.log(competitors);
        return competitors;
    },

    createCompetitor : async function(competitor, surename, lastname){
        if (surename && lastname){
            competitor = new Competitor(competitor, surename, lastname);
        }

        const query = competitor.create();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    updateCompetitor : async function(competitor, surename, lastname){
        if (surename && lastname){
            competitor = new Competitor(competitor, surename, lastname);
        }

        const query = competitor.update();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    deleteCompetitor : async function(competitor){        
        if (competitor.delete){
            const query = competitor.delete();
            pool.query(query.sql, query.params)
                .catch(error => console.log(error));
        } else {
            const query = `DELETE FROM Competitor WHERE CompetitorID=$1`;
            pool.query(query, [competitor])
                .catch(error => console.log(error));
        }         
    },

    // Topic CRUD

    createTopic : async function(topic, title, competitorId, sessionSize){
        if (title && competitorId){
            topic = new Topic(topic, title, competitorId, sessionSize);
        }

        const query = topic.create();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    updateTopic : async function(topic, title, competitorId, sessionSize){
        if (title && competitorId){
            topic = new Topic(topic, title, competitorId, sessionSize);
        }

        const query = topic.update();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    deleteTopic : async function(topic){        
        if (topic.delete){
            const query = topic.delete();
            pool.query(query.sql, query.params)
                .catch(error => console.log(error));
        } else {
            const query = `DELETE FROM Topic WHERE TopicID=$1`;
            pool.query(query, [topic])
                .catch(error => console.log(error));
        }         
    }

};

module.exports = dbApi;