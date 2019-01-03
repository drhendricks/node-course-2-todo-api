var mongoose = require('mongoose');

// User model
// email - require it - trim it - string - min length of 1
var User = mongoose.model('User', {
    email: {
        require: true,
        trim: true,
        minlength: 1,
        type: String
    }
});

module.exports = {User};
