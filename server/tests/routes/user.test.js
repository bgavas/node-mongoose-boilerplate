const fs = require('fs');

const { app } = require('./../../server');
const userSeed = require('./../seeds/user.seed');
const utilSeed = require('./../util/util');

describe('USER ROUTE', () => {

    beforeEach(utilSeed.resetDatabase);
    beforeEach(userSeed.populateUsers);

    const filterTests = [].map(item => item + '.js');

    let routePrefix = 'api/v1/user';

    // Read each test file for v1
    fs
        .readdirSync(__dirname + '/../controllers/v1/user')
        .forEach(file => {
            if (filterTests.length === 0 || filterTests.includes(file))
                require(__dirname + '/../controllers/v1/user/' + file)(app, routePrefix);
        });

});