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

const dbApi = {

    fetchAdministrator : async function(nickname){
        const query = 'SELECT * FROM Administrator WHERE nickname=$1';
        return pool.query(query, [nickname])
            .then(result => {
                if (result.rowCount !== 1){
                    return undefined;
                }
                return factoryAdministrator(result.rows[0]);
            })
            .catch(error => console.log(error));
    },

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

    createCompetitor : function(competitor){
        const query = competitor.create();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    updateCompetitor : function(competitor){
        const query = competitor.update();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    },

    deleteCompetitor : function(competitor){
        const query = competitor.delete();
        pool.query(query.sql, query.params)
            .catch(error => console.log(error));
    }

};


/*
var admin = new Administrator(1, 'Eve', 'test');
dbApi.updateAdministrator(admin);
var salt = bcrypt.genSaltSync(SALT_LEVEL);
console.log(bcrypt.hashSync('Eve', salt));*/
module.exports = dbApi;