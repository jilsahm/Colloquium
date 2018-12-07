var sessionChecker = (req, res, next) => {
    console.log(req.session);
    if (!req.session.admin || !req.cookies.admin_uid) {
        console.log("Redirecting");
        res.redirect('/');
    } else {
        next();
    }    
};

module.exports = sessionChecker;