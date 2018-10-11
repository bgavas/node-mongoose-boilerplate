const { User } = require('./../../models/user');
const { RefreshToken } = require('./../../models/refreshToken');
const { call } = require('./../../db/redis');

// Delete all entries
const resetDatabase = (done) => {
    call.destroyMultiple('*')
        .then(() => RefreshToken.remove({}))
        .then(() => User.remove({}))
        .then(() => done());
};

// Export
module.exports = {
    resetDatabase
};