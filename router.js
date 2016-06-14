// Import Authentication controller
const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport');
const passport = require('passport');

// Function to attempt to authenticate using the jwt strategy. If a user is 
// authenticated, don't try to create a new session for them. So now,
// requireAuth is available to be middleware between an incoming request and route handler.
const requireAuth = passport.authenticate('jwt', { session: false });
// Function to attempt to authenticate using the local strategy. If a user is
// authenticated, don't try to create a new sessoin for them. So now, 
// requireSignin is available to be middleware between an incoming request and route handler.
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // The function that handles our route gets called with 3 arguments:
  // req: object that represents the incoming http request and contains data about it
  // res: object that represents the response we're going to send back to requester
  // next: mostly for error handling
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret code is ABC123'});
  });
  // requireSignin intercepts our post request to /signin to ensure we're using our passport strategy
  app.post('/signin', requireSignin, Authentication.signin);
  // For anything posted to /signup, we want to respond with Authentication.signup
  app.post('/signup', Authentication.signup);
}