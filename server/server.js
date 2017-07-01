var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require ('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); //can send json to express app

//resource creation
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc); //sends doc back to user, gives completed info
  }, (e) => {
    res.status(400).send(e); //send http status and error
  });
});

//retrieve resources
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

//retrieve todo by ID
//request will have an id property
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(todo != null) {
      res.send({todo});
    }
    res.status(404).send();
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
