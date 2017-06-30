var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require ('./models/user');

var app = express();
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

app.listen(3000, () => {
  console.log('Started on port 3000');
});
