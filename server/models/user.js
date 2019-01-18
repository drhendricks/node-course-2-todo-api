const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        require: true,
        trim: true,
        minlength: 1,
        type: String,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        require: true,
        type: String,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email', 'password']);
};

//need a this keyword for instance functions
UserSchema.methods.generateAuthToken = function () {
    //instance method
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    //model method
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                return console.log('Unable to generate salt to hash password!');
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) {
                    return console.log('Unable to hash password!');
                }
                user.password = hash;
                next();
            });
        });

    } else {
        next();
    }
});

// User model
// email - require it - trim it - string - min length of 1
var User = mongoose.model('User', UserSchema);

module.exports = {User};
