const {User} = require('./../models/user');

//middle-ware for user auth
var authenticate = (req, res, next) => {
    //fetch x-auth property of req header
    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};
