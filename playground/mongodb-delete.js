//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
    	return console.log('Unable to connect to MongoDB server!');
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Users').deleteMany({name: 'Dylan'}).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Code'}).then((result) => {
    //     console.log(result);
    // });

    //Delete any user named Diana
    db.collection('Users').find({name: 'Diana'}).toArray().then((user) => {
        // console.log(JSON.stringify(user, undefined, 2));
        console.log(`Deleting user: ${user[0].name}`);
        db.collection('Users').findOneAndDelete({name: user[0].name}).then((result) => {
             console.log(result);
        });
    }, (err) => {
        if(err) {
            console.log('Unable to fetch users', err);
        }
    });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });


    //db.close();
});
