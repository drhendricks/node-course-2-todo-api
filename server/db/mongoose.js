var mongoose = require('mongoose');

//Connect mongoose to database
//tell mongoose to use built-in promise library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};