const { ObjectID } = require('mongodb');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const { User } = require('./../../models/user');
const { RefreshToken } = require('./../../models/refreshToken');
const { redis } = require('./../../db/redis');
const strings = require('./../../constants/string');

const userIds = [new ObjectID()];

const users = [{
    authTokens: [],
    _id: userIds[0],
    email: 'mehmet@test.com',
    name: 'Mehmet',
    password: 'password0',
    surname: 'Tan'
}];

const refreshTokens = [{
    _userId: users[0]._id,
    token: 'refreshToken0'
}];

const populateUsers = (done) => {
    users[0].authTokens = [];
    User
        .create(users)
        .then(() => RefreshToken.create(refreshTokens))
        .then(() => redis.sign(userIds[0], { ttl: '2 hours' }))
        .then((token) => users[0].authTokens.push({ token }))
        .then(() => redis.sign(userIds[0], { ttl: '1 second' }))
        .then((token) => users[0].authTokens.push({ token }))
        .then(() => done());
};

// Export
module.exports = {
    populateUsers,
    refreshTokens,
    users
};