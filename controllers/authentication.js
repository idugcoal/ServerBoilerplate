const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

// Takes in a user model and returns information encoded using our secret string
// Here we're encoding the user's ID and time created
// sub: JWT standard has a 'subject' property - it's the person the token belongs to
// iat: JWT standard has an 'issued at time' property - pretty self-explanatory
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had email and password authenticated.
  // We just need to give them a token.
  // req.user comes from when we call passport's done(null, user) 
  // function in user.comparePassword in passport.js
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  // Pulling the data we need off the request body
  const email = req.body.email;
  const password = req.body.password;

  // If no email or password is provided
  if(!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }
  // See if a user with the given email exists -
  // err: if there was an error during the search
  // existingUser: will only be populated if a user who already exists with the passed-in email
  User.findOne({ email: email }, function(err, existingUser) {
    // If there's an error connecting to database, return next(err) 
    if(err) { return next(err); }
    // If a user with the given email DOES exist, return an error
    if(existingUser) {
      // res.status sets the http code on the response
      return res.status(422).send({ error: 'Email is in use'});  
    }
    // If a user with the given email DOES NOT exist, create a record...
    const user = new User({
      email: email,
      password: password
    });
    // ...and then save the new record
    user.save(function(err) {
      // If the user failed to save, return next(err)
      if(err) { return next(err); }
    });
    // Finally, respond to request indicating the user was created
    // and return a token for the user
    res.json({ token: tokenForUser(user) });
  });
};