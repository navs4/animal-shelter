const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Users = mongoose.model('Users');



passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
}, (name, password, done) => {
    let query = { name: name };
    Users.findOne(query, (err, user) => {
        if (err) return done(err, false, { errors: 'Internal server error' + err });
        if (!user) return done(null, false, { errors: 'User with the given name does not exist' });
        if (!user.validatePassword(password)) {
            return done(null, false, { errors: 'Password is invalid' });
        }

        return done(null, user);
    });
}
));