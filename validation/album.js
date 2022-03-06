/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models')

/**
 * Add photo to album validation rules
 *
 * Required: photo_id
 * Optional: -
 */
const addPhotoRules = [
	body('photo_id').exists().bail().custom(async value => {
		const photo = await new models.Photo({ id: value }).fetch({ require: false });
		if (!photo) {
			return Promise.reject(`Photo with ID ${value} does not exist.`);
		}

		return Promise.resolve();
	}),
];

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
	addPhotoRules,
	createAndUpdateRules,
}
