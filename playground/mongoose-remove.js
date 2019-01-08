const{ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// remove({}) - delete multiple records - can't call with empty params, need empty object
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

//findOneAndRemove({}) - matches object and removes it, returns the removed document
//findByIdAndRemove({}) - matches object by ObjectID and removes it, returns the removed document

// Todo.findByIdAndRemove('5c34fae53a74c00a5329468e').then((todo) => {
//     console.log(todo);
// });

// Todo.findOneAndRemove({ _id: '5c34fae53a74c00a5329468e'}).then((todo) => {
//     console.log(todo);
// });
