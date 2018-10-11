const mongoose = require('mongoose');
const conn = mongoose.connection;

// Start mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// Database error
conn.on('error', (err) => {
    console.log(`Connection error: ${err}`);
});

// Database connection is open
conn.once('open', function() {
    console.log("Successfully connected to the database");
});

module.exports = { mongoose };
