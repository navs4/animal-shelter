const users = require('./controller');
const auth = require('../../utils/auth');

module.exports = router => {
    router.post('/users', users.createUser);

    router.get('/users', auth.required, users.getUsers);

}