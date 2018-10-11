const RedisJwt = require('redis-jwt');

const redis = new RedisJwt({
    //host: '/tmp/redis.sock', //unix domain
    host: process.env.REDIS_URI, //can be IP or hostname
    port: process.env.REDIS_PORT, // port
    maxretries: 10, //reconnect retries, default 10
    //auth: '123', //optional password, if needed
    db: process.env.NODE_ENV === 'test' ? 1 : 0, //optional db selection
    secret: process.env.JWT_SECRET, // secret key for Tokens!
    multiple: true, // single or multiple sessions by user
    kea: false // Enable notify-keyspace-events KEA
});

const call = redis.call();

module.exports = { redis, call };