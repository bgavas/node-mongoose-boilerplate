const errors = require('./../constants/error');
const strings = require('./../constants/string');
const utils = require('./../util/util');
const logger = require("./../util/logger");

let expressResult = (result, req, res, next) => {

	// console.log(result);

	// If headers set before skip
    if (res.headersSent) {
		logger.error("Internal servor error. Error: " + error);
		return next(err);
	} else if (!result) { // The result didn't come for any reason
		logger.error("No error found");
		return next('No error found');
	}

	const message = result.message;
	const data = result.data;

	// SUCCESS

	// Was it a successful process?
	if (result.status === strings.SUCCESS_RESPONSE) {

		// Log message
		logger.info(message);
		// Set headers if exists
		if (result.headers) res.header(result.headers);
		// Return success
		return res.status(200).send(data);

	}

	// ERROR

	// Is there error object?
    if (data) {

		// Log warning
		logger.warn(message);

        // Find the error
        const err = Object.values(errors).find(item => item.code === data.code);

		// Send error
		if (utils.isDuplicateError(data)) return res.status(400).send({ error: errors.ALREADY_EXISTS, status: strings.FAIL_RESPONSE });
        else if (err) return res.status(400).send({ error: err, status: strings.FAIL_RESPONSE });
        else return res.status(400).send({ error: errors.UNKNOWN, status: strings.FAIL_RESPONSE });

    } else {

		// Log error
		logger.error(message);

        // Unknown error
		return res.status(500).send({ error: errors.UNKNOWN, status: strings.FAIL_RESPONSE });
		
	}
	
};


module.exports = { expressResult };
