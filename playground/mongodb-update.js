//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
    	return console.log('Unable to connect to MongoDB server!');
    }
    console.log('Connected to MongoDB server');

    let collection = db.collection('Users');
    var userObjectID;
    //Find Darren's object ID and update name to Dylan, increment age by 1
    collection.findOne({name: 'Darren'}).then((user) => {
        console.log(user._id);
        userObjectID = user._id;
        db.collection('Users').findOneAndUpdate({_id: userObjectID}, {
            $set: {
                name: 'Dylan'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        }, (err) => {
            if(err) {
                console.log("Couldn't update user!");
            }
        });
    }, (err) => {
        if(err) {
            console.log("No user exists!");
        }
    });



    //db.collection('Users').findOneAndUpdate({}).then();

    //db.close();
});
