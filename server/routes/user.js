const utils = require('./../util/util');

// Define routes
const routes = [{
    controller: 'authenticate',
    description: 'Check authentication',
    fallbackVersion: 'v1',
    handlers: [],
    path: '/authenticate',
    type: 'get',
    versions: ['v1']
}];

// Export route
module.exports = (version) => {

    const router = require('express').Router();

    // Create all routes
    utils.defineRoutes(router, routes, 'user', version);

    // Return router
    return router;

};