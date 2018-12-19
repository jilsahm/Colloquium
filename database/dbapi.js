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

function calculateDuration(elapsedTime){
    var milliseconds = elapsedTime;
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000 / 100);
    var minuteHelper = (10 > minutes) ? '0' : '';
    var secondsHelper = (10 > seconds) ? '0' : '';
    return `${minuteHelper}${minutes}:${secondsHelper}${seconds}.${milliseconds}`;
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
    constructor(id, sessionDate, elapsedTime, topicId){
        this.id = id;
        this.sessionDate = sessionDate;
        this.elapsedTime = elapsedTime;
        this.topicId = topicId;
    }
    printDuration(){
        return calculateDuration(this.elapsedTime);
    }
    create(){
        return new Query(
            `INSERT INTO Session(SessionDate, ElapsedTime, TopicID) VALUES ($1, $2, $3)`,
            [this.sessionDate, this.elapsedTime, this.topicId]
        );
    }
    update(){
        return new Query(
            `UPDATE Session SET SessionDate=$1, ElapsedTime=$2 WHERE SessionID=$3`,
            [this.sessionDate, this.elapsedTime, this.id]
        );
    }
    delete(){
        return new Query(
            `DELETE FROM Session WHERE SessionID=$1`,
            [this.id]
        );
    }
}
function factorySession(data){
    return new Session(data.sessionid, data.sessiondate, data.elapsedtime, data.topicdd);
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
    constructor(id, content, positive, sessionId){
        this.id = id;
        this.content = content;
        this.positive = positive;
        this.sessionId = sessionId;
    }
    create(){
        return new Query(
            `INSERT INTO Critique(Content, Positive, SessionID) VALUES ($1, $2, $3)`,
            [this.content, this.positive, this.sessionId]
        );
    }
    update(){
        return new Query(
            `UPDATE Critique SET Content=$1, Positive=$2 WHERE CritiqueID=$3`,
            [this.content, this.positive, this.id]
        );
    }
    delete(){
        return new Query(
            `DELETE FROM Critique WHERE CritiqueID=$1`,
            [this.id]
        );
    }
}
function factoryCritique(data){
    return new Critique(data.critiqueid, data.content, data.positive, data.sessionid);
}

class Statistics{
    constructor(numberOfSessions, averageSessionTime, averageAnswerRating){
        this.numberOfSessions = (numberOfSessions) ? numberOfSessions : 0;
        this.averageSessionTime = (averageSessionTime) ? calculateDuration(averageSessionTime) : '00:00.0';
        this.averageAnswerRating = (averageAnswerRating) ? parseFloat(averageAnswerRating).toFixed(1) : '0.0';
    }
}
function factoryStatistics(data){
    return new Statistics(data.numberofsessions, data.averagesessiontime, data.averageanswerrating);
}

const dbApi = {

    // Fetch methods

    /**
     * Fetchs one specific dataset from the database. It will automaticly transformed into an object.
     * @param {*} type A String with the name of the desired object. 
     * Possible types: "administrator", "competitor", "critique", "question", "topic", "session", "sessionsize", "statistics"
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
            case 'critique':
                query = 'SELECT * FROM Critique WHERE CritiqueID=$1';
                factory = factoryCritique;
                break;
            case 'question':
                query = 'SELECT * FROM Question WHERE QuestionID=$1';
                factory = factoryQuestion;
                break;
            case 'topic':
                query = 'SELECT * FROM Topic WHERE TopicID=$1';
                factory = factoryTopic;
                break;
            case 'session':
                query = 'SELECT * FROM Session WHERE SessionID=$1';
                factory = factorySession;
                break;
            case 'sessionsize':
                query = 'SELECT * FROM SessionSize WHERE SessionSizeID=$1';
                factory = factorySessionSize;
                break;
            case 'statistics':
                query = `SELECT COUNT(DISTINCT s.SessionID) AS numberOfSessions,
                        AVG(s.elapsedTime) AS averageSessionTime,
                        AVG(q.AnswerRating) AS averageAnswerRating 
                        FROM Session AS s
                        INNER JOIN Question AS q ON s.TopicID = q.TopicID
                        WHERE s.TopicID=$1`;
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
     * Possible types: "administrator", "competitor", "critique", "question", "topic", "session", "sessionsize"
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
            case 'critique':
                query = 'SELECT * FROM Critique WHERE SessionID=$1';
                factory = factoryCritique;
                break;
            case 'question':
                query = 'SELECT * FROM Question WHERE TopicID=$1';
                factory = factoryQuestion;
                break;
            case 'topic':
                query = 'SELECT * FROM Topic WHERE CompetitorID=$1';
                factory = factoryTopic;
                break;
            case 'session':
                query = 'SELECT * FROM Session WHERE TopicID=$1';
                factory = factorySession;
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
     * Possible types: "critique", "question", "topic", "session", "sessionsize"
     * @param {*} params Constructor parameters array for the object. Dont uses this if the type is already an object.
     */
    create : async function(type, params, justUpdate = false){
        var query = undefined;

        if (params){
            var object = undefined;
            var constructor = undefined;            

            switch (type){
                case 'critique':
                    constructor = Critique;
                    break;
                case 'question':
                    constructor = Question;
                    break;
                case 'topic':
                    constructor = Topic;
                    break;
                case 'session':
                    constructor = Session;
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
     * "critique", "question", "session".
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
                case 'session':
                    query = 'DELETE FROM Session WHERE SessionID = $1';
                    break;
                case 'topic':
                    query = 'DELETE FROM Topic WHERE TopicID = $1';
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
            case 'critique':
                query = 'DELETE FROM Critique WHERE SessionID=$1';
                break;
            case 'session':
                query = 'DELETE FROM Session WHERE TopicID = $1';
                break;
        }
        if (query){
            pool.query(query, [specifier]).catch(error => console.log(error));
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
    }

};

module.exports = dbApi;