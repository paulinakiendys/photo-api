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
 * Add multiple photos to album validation rules
 *
 * Required: photo_id
 * Optional: -
 */
const addPhotosRules = [
	body('photo_id').exists().isArray({ min: 1 }).bail().custom(async value => {
		const photos = await new models.Photo({ id: value }).fetchAll({ require: false });

		const existing_ids = photos.map(photos => photos.id);

		const result = value.every(id => existing_ids.includes(id));

		if (!result) {
			return Promise.reject('Photo(s) do not exist');
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
	body('title').exists().isLength({ min: 3 }).custom(async value => {
		const album = await new models.Album({ title: value }).fetch({ require: false });
		if (album) {
			return Promise.reject(`Album with title '${value}' already exists.`);
		}

		return Promise.resolve();
	}),
];

module.exports = {
	addPhotoRules,
	addPhotosRules,
	createAndUpdateRules,
}
