require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require ('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json()); //can send json to express app

//----------------------------TO DO ROUTES------------------------------------//

//resource creation
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc); //sends doc back to user, gives completed info
  }, (e) => {
    res.status(400).send(e); //send http status and error
  });
});

//retrieve resources
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id //all todos for currently logged in user
  }).then((todos) => {
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
      res.send({todo}); //todo is a property of an object
    }
    res.status(404).send();
  }).catch((e) => {
    res.status(400).send();
  });
});

//delete resource
app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findByOneAndRemove({
    _id: id,
    _creator: req.user._id
   }).then((todo) => {
    if(todo != null) {
      res.send({todo});
    }
    res.status(404).send();
  }).catch((e) => {
    res.status(400).send();
  });
});

//update resources
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']); //pick off properties users should be able to update

  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null; //remove val
  }

  Todo.findByOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if(todo != null){
      res.send({todo});
    }
    return res.status(404).send();
  }).catch((e) => {
    res.status(400).send();
  });
});

//-------------------------------USERS ROUTES---------------------------------//

//POST /users
app.post('/users', (req, res) => {
  //use pick to pick off email and password
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// DELETE /users/me/token --> logging out
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
