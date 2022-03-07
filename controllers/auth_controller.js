/**
 * Auth Controller
 */

const bcrypt = require('bcrypt');
const debug = require('debug')('photos:auth_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
const jwt = require('jsonwebtoken');

/**
 * Login a user, sign a JWT token and return it
 *
 * POST /login
 * {
 *   "email": "",
 *   "password": ""
 * }
 */
const login = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	console.log("The validated data:", validData);

	// destructure email and password from the validated data
	const { email, password } = validData;

	// login the user
	const user = await models.User.login(email, password);
	if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authentication failed.',
		});
	}

	// construct jwt payload
	const payload = {
		sub: user.get('email'),
		user_id: user.get('id'),
		name: user.get('first_name') + ' ' + user.get('last_name'),
	}

	// sign payload and get access-token
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
	});

	// sign payload and get refresh-token
	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w',
	});

	// respond with the access-token
	return res.status(200).send({
		status: 'success',
		data: {
			access_token,
			refresh_token,
		}
	});
}

/**
 * Validate refresh token and issue a new access token
 *
 * POST /refresh
 * {
 *   "token": ""
 * }
 */
const refresh = (req, res) => {
	// validate the refresh token (check signature and expiry date)
	try {
		// split authorization header into "authSchema token"
		const [authSchema, token] = req.headers.authorization.split(' ');
		if (authSchema.toLowerCase() !== "bearer") {
			return res.status(401).send({
				status: 'fail',
				data: 'Authorization failed',
			});
		}
		// verify token using the refresh token secret (and extract payload)
		const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

		// construct payload
		// remove `iat` and `exp` from refresh token payload
		delete payload.iat;
		delete payload.exp;

		// sign payload and get access token
		const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
		});

		// send the access token to the client
		return res.status(200).send({
			status: 'success',
			data: {
				access_token,
			}
		});

	} catch (error) {
		return res.status(401).send({
			status: 'fail',
			data: 'Invalid token',
		});
	}
}

/**
 * Register a new user
 *
 * POST /register
 */
const register = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	console.log("The validated data:", validData);

	// generate a hash of `validData.password`
	// and overwrite `validData.password` with the generated hash
	try {
		validData.password = await bcrypt.hash(validData.password, models.User.hashSaltRounds);

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing the password.',
		});
		throw error;
	}

	try {
		const user = await new models.User(validData).save();
		debug("Created new user successfully: %O", user);

		res.status(200).send({
			status: 'success',
			data: {
				email: validData.email,
				first_name: validData.first_name,
				last_name: validData.last_name,
			}
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.',
		});
		throw error;
	}
}

module.exports = {
	login,
	refresh,
	register,
}