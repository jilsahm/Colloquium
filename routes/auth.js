var express = require('express');
var router = express.Router();
var dbApi = require('../database/dbapi.js');
var sessionChecker = require('../modules/session.js');

router.post('/login', async function(req, res, next) {
    console.log(req.session);
    const nickname = req.body.username;
    const password = req.body.password;

    if (nickname == undefined || password == undefined){
        console.log('Redirecting to index');
        res.redirect('/');    
    } else {
        var admin = await dbApi.fetchAdministrator(nickname);
        if (admin == undefined || !admin.isValid(password)){
            res.render('index', {error : "Something went wrong..."});
        } else {
            req.session.admin = admin;
            res.redirect('/overview');
        }        
    } 
});

router.get('/logout', function(req, res, next) {
    if (req.session.admin && req.cookies.admin_uid) {
        res.clearCookie('admin_uid');        
    }
    res.redirect('/');
});

module.exports = router;