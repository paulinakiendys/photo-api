/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Create User validation rules
 *
 * Required: email, password, first_name, last_name
 * Optional: -
 */
const createRules = [
	body('email').exists().isEmail().custom(async value => {
		const user = await new models.User({ email: value }).fetch({ require: false });
		if (user) {
			return Promise.reject("Email already exists.");
		}

		return Promise.resolve();
	}),
	body('password').exists().isLength({ min: 6 }),
	body('first_name').exists().isLength({ min: 3 }),
	body('last_name').exists().isLength({ min: 3 }),
];

module.exports = {
	createRules,
}