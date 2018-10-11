const mongoose = require('mongoose');

const errors = require('./../constants/error');
const strings = require('./../constants/string');
const arrays = require('./../constants/array');
const { redis } = require('./../db/redis');
const logger = require('./../util/logger');
const { RefreshToken } = require('./../models/refreshToken');

let authenticate = (req, res, next) => {

	// Get tokens
	let token = req.header(strings.HEADER_AUTH_TOKEN);
	let refreshToken = req.header(strings.HEADER_REFRESH_TOKEN);

	// Get path without api and version
	let path = req.path.split('/');
	if (path.length > 3) path = path.slice(3, path.length).join('/');

	// Check if auth not needed
	let authNotNeeded = false;
	arrays.noNeedAuthRoutes.forEach((item) => path.startsWith(item) ? authNotNeeded = true : null);

	// Next if auth not needed
	if (authNotNeeded) return next();

	// Reject if no auth token provided
	if (!token) {
		// Not authenticated
		logger.warn(`Couldn't authenticate. Auth token: ${token}. Refresh token: \
			${refreshToken}. Error: auth token not provided`);
		return res.status(401).send({ error: errors.AUTHENTICATION_FAILED, status: strings.FAIL_RESPONSE });
	}

	// Verify token and find it in redis
	redis
		.verify(token)
		.then((decode) => {

			// Token exists in redis?
			if (!decode.id) {

				// Reject if no refresh token provided
				if (!refreshToken) return Promise.reject();

				// Check if refresh token is valid
				return RefreshToken
					.findOne({ token: refreshToken })
					.then((data) => {

						// Refresh token is not valid
						if (!data) return Promise.reject();

						// Set user id
						req.userId = data._userId;

						// Sign new token
						return redis.sign(data._userId, { ttl: strings.AUTHENTICATION_TOKEN_TTL });

					})
					.then((token) => {

						// Set header
						res.setHeader(strings.HEADER_AUTH_TOKEN, token);

						// Passed
						return next();

					});

			}

			// Set fields
			req.userId = mongoose.Types.ObjectId(decode.id);
			res.setHeader(strings.HEADER_AUTH_TOKEN, token);

			// Passed
			return next();

		})
		.catch((error) => {
			// Not authenticated
			logger.warn(`Couldn't authenticate. Auth token: ${token}. Refresh token: ${refreshToken}. Error: ${error}`);
			res.status(401).send({ error: errors.AUTHENTICATION_FAILED, status: strings.FAIL_RESPONSE });
		});
	
};


module.exports = { authenticate };
