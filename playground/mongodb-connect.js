//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //identical to above

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if(err) {
      return console.log('not insert', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2)); //ops stores all docs inserted
  });

  db.collection('Users').insertOne({
    name: 'Ekta',
    age: 19,
    location: 'the cloud'
  }, (err, result) => {
    if(err) {
      return console.log('insert failed', err);
    }
    console.log(result.ops[0]._id.getTimestamp());
  });

  db.close();
});
