require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate')

var app = express();

const port = process.env.PORT;
//const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the todo app!');
});

//GET /todos - fetch all todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

//POST /todos - create a new todo
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET /todos/:id - query for a specific todo
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        //returns null if couldn't find ID
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => res.status(400).send());
});

//DELETE /todos/:id - delete a specific todo and return deleted todo
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        //returns null if couldn't find ID
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => res.status(400).send());
});

//PATCH /todos/:id - update a specific todo and return updated todo
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});


//POST /users (sign up)
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    if(body.password && body.email) {
        var user = new User(body);
        user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            //set x-auth property of res header
            res.header('x-auth', token).send({user});
        }).catch((e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(400).send(e);
    }
});

//private route
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};
