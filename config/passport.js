//
// User login validation process using "passport" based on a local strategy
//

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');

module.exports = function(passport) {
  // Attempt to authentificate through an email address
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    // Search the email address in the database
    db.User.findOne({ where: { email: email }})
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'No user found'});
        }
        
        // Verify the input password matches with the one from database
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) throw error;
          
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password'});
          }
        })
      })
  }));
  
  // Serialize the user session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  // De-serialize the user session
  passport.deserializeUser(function(id, done) {
    db.User.findById(id)
      .then(user => {
        console.log(`User ${user.name}${user.id} logged in`);
        done(null, user);
      })
      .catch(err => { console.log(err)});
  });
};