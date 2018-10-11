// Get configuration
require('./config/config.js');
// Start mongodb connection
require('./db/mongoose');
require('./db/redis');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
// const morgan = require('morgan');

const routes = require('./routes');
const { authenticate } = require('./middleware/authenticate');
const { expressResult } = require('./middleware/expressResult');
const arrays = require('./constants/array');

const app = express();
const port = process.env.PORT;

// Middleware
// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(authenticate);

// Define routes
Object.keys(routes).forEach(function(key) {
    // Versioning
    arrays.availableVersions.forEach((version) => {
        app.use(`/api/${version}/` + key, routes[key](version));
    });
});

// Error and result handler
app.use(expressResult);

// Listen requests
app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

// Export for testing
module.exports = {app};