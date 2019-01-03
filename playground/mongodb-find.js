//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
    	return console.log('Unable to connect to MongoDB server!');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5c2e50b17ce496005ecf9c0d')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     if(err) {
    //         console.log('Unable to fetch todos', err);
    //     }
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Names with ${findQ}: ${count}`);
    // }, (err) => {
    //     if(err) {
    //         console.log('Unable to fetch todos', err);
    //     }
    // });

    db.collection('Users').find({name: 'Dylan'}).count().then((count) => {
        console.log(`Names with Dylan: ${count}`);
    }, (err) => {
        if(err) {
            console.log('Unable to fetch todos', err);
        }
    });

    //db.close();
});
