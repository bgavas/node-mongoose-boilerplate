const mongoose = require('mongoose');

module.exports = {

    // Defines routes with controllers and versioning
    defineRoutes: (router, routes, routeName, version) => {

        // Create all routes
        routes.forEach((endpoint) => {

            // Set version if endpoint doesn't support
            if (!endpoint.versions.includes(version)) version = endpoint.fallbackVersion;

            // Set controller
            router[endpoint.type](endpoint.path, endpoint.handlers, 
                require(`./../controllers/${version}/${routeName}/${endpoint.controller}`));
            
        });

    },

    // Checks if the object ids are equal
    idsEqual: (id1, id2) => {
        
        // Are ids null
        if (!id1 || !id2) return false;

        try {
            // Return euqality
            return mongoose.Types.ObjectId(id1).equals(mongoose.Types.ObjectId(id2));
        } catch (_) {
            return false;
        }
        
    },
    
    // Checks if the error is mongoose duplicate error
    isDuplicateError: (error) => {
        let regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i;
        if (error.message && error.message.includes("E11000 duplicate key error") 
            && error.message.match(regex) && error.message.match(regex).length > 1) {
            return regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i,      
                match =  error.message.match(regex),  
                indexName = match[1] || match[2];
        } else {
            return null;
        }
    }

}