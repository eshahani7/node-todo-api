var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user) { //valid token but no user found
      return Promise.reject(); //function stops and error case runs
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    //called when promise that rejects is returned
    res.status(401).send();
  });
};

module.exports = {authenticate};
