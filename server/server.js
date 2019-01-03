var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var newTodo = new Todo({
    text: 'Jump up and down',
});

newTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Unable to save todo');
});

var newUser = new User({
    email: 'd.r.hendricks@hotmail.com'
});
var badUser = new User({
    email: ''
});

newUser.save().then((doc) => {
    console.log('Saved user', doc);
}, (e) => {
    console.log('Unable to save user', e);
});

badUser.save().then((doc) => {
    console.log('Saved user', doc);
}, (e) => {
    console.log('Unable to save user', e);
});
