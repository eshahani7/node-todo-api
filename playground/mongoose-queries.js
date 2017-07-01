const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '59559504af0fad06241a0941'; //use for queries

if(!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

// Todo.find({
//   _id: id //mongoose will convert to ObjectID automatically
// }).then((todos) => {
//   console.log('Todos', todos);
// });

//returns one doc at most
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todos', todo); //get doc instead of array of docs
// });

Todo.findById(id).then((todo) => {
  if(!todo) {
    return console.log('Id not found');
  }
  console.log('Todo By Id', todo);
}).catch((e)=>console.log(e));
