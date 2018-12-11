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
    constructor(id, title, competitorId){
        this.id = id;
        this.title = title;
        this.competitorId = competitorId;
    }
    create(){
        return new Query(
            `INSERT INTO Topic(Title, CompetitorID) VALUES ($1, $2)`,
            [this.title, this.competitorId]
        );
    }
    update(){
        return new Query(
            `UPDATE Topic SET Title=$1, CompetitorID=$2 WHERE TopicID=$3`,
            [this.title, this.competitorId, this.id]
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
    return new Topic(data.topicid, data.title, data.competitorid);
}

const dbApi = {

    // Fetch methods

    /**
     * Fetchs one specific dataset from the database. It will automaticly transformed into an object.
     * @param {*} type A String with the name of the desired object. 
     * Possible types: "administrator", "competitor", "topic"
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
            case 'topic':
                query = 'SELECT * FROM Topic WHERE TopicID=$1';
                factory = factoryAdministrator;
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
     * Possible types: "administrator", "competitor", "topic"
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
            case 'topic':
                query = 'SELECT * FROM Topic WHERE CompetitorID=$1';
                factory = factoryAdministrator;
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

    // Administrator CRUD

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

    createTopic : async function(topic, title, competitorId){
        if (title && competitorId){
            topic = new Topic(topic, title, competitorId);
        }

        const query = topic.create();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    updateTopic : async function(topic, title, competitorId){
        if (title && competitorId){
            topic = new Topic(topic, title, competitorId);
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


/*
var admin = new Administrator(1, 'Eve', 'test');
dbApi.updateAdministrator(admin);
var salt = bcrypt.genSaltSync(SALT_LEVEL);
console.log(bcrypt.hashSync('Eve', salt));*/
module.exports = dbApi;