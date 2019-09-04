const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;


const UsersSchema = new Schema({
    name: String,
    hash: String,
    salt: String,
    createdOn: Date
});


UsersSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 100, 'sha512')
        .toString('hex');
}


UsersSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 100, 'sha512')
        .toString('hex');
    return this.hash == hash;
}


UsersSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id,
        exp: parseInt((new Date().getTime() + 60 * 60 * 1000) / 1000),
        name: this.name
    },
        'naveen123'
    );
}


UsersSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        name: this.name,
        token: this.generateToken()
    }
}

UsersSchema.pre('save', (next) => {
    this.createdOn = Date.now();
    next();
});

UsersSchema.plugin(paginate);
mongoose.model('Users', UsersSchema);
