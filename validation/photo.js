/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Create Photo validation rules
 *
 * Required: title, url
 * Optional: comment
 */
const createRules = [
	body('title').exists().isLength({ min: 3 }).custom(async value => {
		const photo = await new models.Photo({ title: value }).fetch({ require: false });
		if (photo) {
			return Promise.reject(`Photo with title '${value}' already exists.`);
		}

		return Promise.resolve();
	}),
	body('url').exists().isURL().custom(async value => {
		const url = await new models.Photo({ url: value }).fetch({ require: false });
		if (url) {
			return Promise.reject(`Photo with url '${value}' already exists.`);
		}

		return Promise.resolve();
	}),
	body('comment').optional().isLength({ min: 3 }),
];

/**
 * Update Photo validation rules
 *
 * Required: -
 * Optional: title, url, comment
 */
const updateRules = [
	body('title').optional().isLength({ min: 3 }).custom(async value => {
		const photo = await new models.Photo({ title: value }).fetch({ require: false });
		if (photo) {
			return Promise.reject(`Photo with title '${value}' already exists.`);
		}

		return Promise.resolve();
	}),
	body('url').optional().isURL().custom(async value => {
		const url = await new models.Photo({ url: value }).fetch({ require: false });
		if (url) {
			return Promise.reject(`Photo with url '${value}' already exists.`);
		}

		return Promise.resolve();
	}),
	body('comment').optional().isLength({ min: 3 }),
];

module.exports = {
	createRules,
	updateRules,
}