const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
    const {
        headers: {
            authorization
        }
    } = req;

    if (authorization && authorization.split(' ')[0] == 'Bearer') {
        return authorization.split(' ')[1];
    }

    return null;
}

const auth = {
    required: jwt({
        secret: 'naveen123',
        getToken: getTokenFromHeaders,
        userProperty: 'payload',
        isRevoked: function (err, payload, done) {
            console.log("revoked");
            Users.findById(payload._id).lean().exec((err, user) => {
                if (err) done(err, false);
                if (!user) done('Unauthorised user', false);
                done(null);
            });
        }
    })
}



module.exports = auth;