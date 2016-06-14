const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy -
// Create a local strategy to attempt to authenticate a user given only an email and password.
// Tell local strategy where to look in the request to get access to our email/username. By default,
// LocalStrategy looks for 'username' - we're telling it to look for 'email' instead. 
// It finds the 'password' field automatically.
const localOptions = { usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, then call done with the user if 
  // email/password are correct. Otherwise, call done with false.
  User.findOne({ email: email }, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false); }

    // Compare passwords: is password equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if(err) { return done(err) }; 
      if(!isMatch) { return done(null, false); }
      
      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  // Extracts the token from the request header property called authorization
  jwtFromRequest: ExtractJwt.fromHeader('authorization'), 
  // This is the secret JWT needs to use to decode this token
  secretOrKey: config.secret
};

// Create JWT Strategy -
// payload: decoded JWT token - will have a sub and iat property 
// done: callback function we'll call when we find/don't find the user
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If so, call done with that user
  // Otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if(err) { return done(err, false); }

    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use the JWT strategy
passport.use(jwtLogin);
// Tell passport to use the Local strategy
passport.use(localLogin);