var mongoose = require('mongoose');

//Connect mongoose to database
//tell mongoose to use built-in promise library
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};


process.env.NODE_ENV
