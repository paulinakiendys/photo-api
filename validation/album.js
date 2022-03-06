/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Create Album validation rules
 *
 * Required: title
 * Optional: -
 */
const createRules = [
	body('title').exists().isLength({ min: 3 }),
];

module.exports = {
	createRules,
}
