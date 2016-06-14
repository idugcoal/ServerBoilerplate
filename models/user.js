// Data model to represent a user

const mongoose = require('mongoose');
// Schema is used to tell mongoose about the fields we have
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define and describe our model:
// it has an email string that is unique and lowercase,
// as well as a password string
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password
// .pre('save') means 'before the model gets saved'
userSchema.pre('save', function(next) {
  // Get access to the user model
  const user = this;
  // Generate a salt, then run the callback...
  bcrypt.genSalt(10, function(err, salt) {
    if(err) { return next(err); }
    // ...hash our password using the salt that was just created...
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) { return next(err); }
      // ...overwrite plain text password with hashed password...
      user.password = hash;
      // ...then save the model
      next();
    });
  });
});

//
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // this.password is a reference to the user model 
  // and contains the hashed and salted password
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) { return callback(err); }

    callback(null, isMatch);
  });
}
// Create the model class:
// Loads userSchema into mongoose and lets mongoose know
// that the schema corresponds to a collection named 'user'
const ModelClass = mongoose.model('user', userSchema);

// Export the model so other files can make use of it
module.exports = ModelClass;