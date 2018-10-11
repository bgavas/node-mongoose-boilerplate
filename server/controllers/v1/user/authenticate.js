const strings = require('./../../../constants/string');

module.exports = (req, res, next) => {

    return next({
        data: { status: strings.SUCCESS_RESPONSE },
        message: `Authenticated successfully with id ${req.userId} and token ${res.getHeaders()['x-auth']}`,
        status: strings.SUCCESS_RESPONSE
    });
    
};