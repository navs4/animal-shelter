const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const QueryUtils = require('../../utils/queryUtils');
const controller = {};


controller.createUser = async (req, res) => {
    try {
        let query = {},
            user = {};

        query.name = req.body.name;
        user = await Users.findOne(query).lean();
        if (user) {
            return res.status(404).send('User already exist with the given name ' + query.name);
        } else {
            user = new Users(req.body);
            user.setPassword(req.body.password);
            user = await user.save();
            return res.status(200).send('User created successfully');
        }
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}



controller.getUser = async (req, res) => {
    try {
        let userId,
            user = {};

        user = await Users.findById(userId).lean();
        return res.status(200).send(user);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}

controller.getUsers = async (req, res) => {
    try {
        let query = {},
            options = {
                sort: {
                    'createdOn': -1
                },
                select: 'name',
                lean: true
            };

        /**
         * create 
         * dynamic 
         * query
         */
        for (key in req.query) {
            if (req.query[key]) {
                if (QueryUtils
                    .queryConstants
                    .requestParamsArr.indexOf(key) != -1) {
                    options[key] = parseInt(req.query[key]);
                } else {
                    query[key] = new RegExp(req.query.key, 'i');
                }
            }
        }


        let users = await Users.paginate(query, options);
        return res.status(200).send(users);
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}





module.exports = controller;