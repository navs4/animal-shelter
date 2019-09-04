const express = require('express');
const passport = require('passport');
const router = express.Router();


router.post('/login', (req, res, next) => {
    const user = req.body;
    if (!user.name) {
        return res.status(400).json({
            error: 'User name  is undefined'
        })
    }

    if (!user.password) {
        return res.status(400).json({
            error: 'Password is required'
        })
    }

    return passport.authenticate('local', {
        session: false
    }, (err, passportUser, info) => {
        if (err) {
            return res.send(400).send(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = user.generateToken();
            return res.status(200).json({
                user: user.toAuthJSON()
            });
        }

        return res.status(500).send(info);
    })(req, res, next);

});



module.exports = router;