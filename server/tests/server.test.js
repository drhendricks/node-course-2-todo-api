const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const bcrypt = require('bcryptjs');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with no body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should fetch all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(todos.length);
                expect(res.body.todos[0]).toInclude({text: 'First test todo'});
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 if ID invalid', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete a todo and return it', (done) => {
        var hexID = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexID).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    })

    it('should not delete a non-existent todo with valid ObjectID (404)', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    })

    it('should not delete a todo if ObjectID is invalid (404)', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    })
});

describe('PATCH /todos/:id', () => {
    it('should update a todo with completed set false->true', (done) => {
        var hexID = todos[0]._id.toHexString();
        //check that completedAt gets set to a value
        //Make sure text is unchanged and completed set as expected
        request(app)
            .patch(`/todos/${hexID}`)
            .send({completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
                expect(res.body.todo.completedAt).toBeA('number');
                expect(res.body.todo.completed).toBe(true);
            })
            .end(done);
    });

    it('should update a todo with completed set true->false', (done) => {
        var hexID = todos[0]._id.toHexString();
        //check that completedAt gets set to null
        //Make sure text is unchanged and completed set as expected
        request(app)
            .patch(`/todos/${hexID}`)
            .send({completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completedAt).toNotExist();
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should update a todo without completed value', (done) => {
        var hexID = todos[0]._id.toHexString();
        var newText = 'New text from update';
        //check that completedAt still null
        //Make sure text is changed as expected
        request(app)
            .patch(`/todos/${hexID}`)
            .send({text: newText})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completedAt).toNotExist();
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(newText);
            })
            .end(done);
    });

    it('should not update a todo with an invalid ObjectID', (done) => {
        request(app)
            .patch(`/todos/123`)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todosAfter) => {
                    expect(todosAfter.length).toBe(2);
                    var i = 0;
                    //make sure items are unchanged
                    todosAfter.forEach((item) => {
                        expect(item.text).toBe(todos[i].text);
                        expect(item.completed).toBe(todos[i].completed);
                        expect(item.completedAt).toBe(todos[i].completedAt);
                        i++;
                    });
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should not update a todo with a non-existent ObjectID', (done) => {
        request(app)
            .patch(`/todos/${new ObjectID()}`)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todosAfter) => {
                    expect(todosAfter.length).toBe(2);
                    var i = 0;
                    //make sure items are unchanged
                    todosAfter.forEach((item) => {
                        expect(item.text).toBe(todos[i].text);
                        expect(item.completed).toBe(todos[i].completed);
                        expect(item.completedAt).toBe(todos[i].completedAt);
                        i++;
                    });
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('POST /users', () => {
    it('should create a new user with valid data', (done) => {
        var email = 'jerry@bananas.com';
        var password = 'dancewiththedevil';
        var hashedPassword = '';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body.user._id).toExist();
                expect(res.body.user.email).toBe(email);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create new user if email badly formed', (done) => {
        var email = 'jerrycomcast.net';
        var password = 'bademail';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create a new user if no email', (done) => {
        request(app)
            .post('/users')
            .send({
                password: 'noemail'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it('should not create a new user if no password', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'nopassword@google.com'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it('should not create a new user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'dumbpassword'
            })
            .expect(400)
            .end(done);
    });

});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});
