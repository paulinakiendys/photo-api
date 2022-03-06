/**
 * Album Validation Rules
 */

const { body } = require('express-validator');

/**
 * Create and Update Album validation rules
 *
 * Required: title
 * Optional: -
 */
const createAndUpdateRules = [
	body('title').exists().isLength({ min: 3 }),
];

module.exports = {
	createAndUpdateRules,
}
