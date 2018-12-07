const configs = require('../configs/dbconnections.json');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool(configs.postgres);

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

class Administrator{
    constructor(id, nickname, password){
        this.id = id;
        this.nickname = nickname;
        this.password = password;
    }
    isValid(password){
        return bcrypt.compareSync(password, this.password);
    }
}

const dbApi = {

    isValidAdministrator : async function(nickname, password){
        const query = 'SELECT * FROM Administrator WHERE nickname=$1';
        return pool.query(query, [nickname])
            .then(result => {
                if (result.rowCount !== 1){
                    return false;
                }
                //TODO
                return bcrypt.compareSync();
            })
            .catch(error => false);
    },

    fetchAdministrator : async function(nickname){
        const query = 'SELECT * FROM Administrator WHERE nickname=$1';
        return pool.query(query, [nickname])
            .then(result => {
                if (result.rowCount !== 1){
                    return undefined;
                }
                return new Administrator(result.rows[0].administratorid, result.rows[0].nickname, result.rows[0].passwordhash);
            })
            .catch(error => undefined);
    }

};

//debug();
module.exports = dbApi;