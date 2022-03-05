/**
 * Photo Controller
 */

const debug = require('debug')('photos:photo_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all resources
 *
 * GET /
 */
 const index = async (req, res) => {
	// fetch the user (and eager-load the photos-relation)
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });

	res.status(200).send({
		status: 'success',
		data: user.related('photos'),
	});
}

/**
 * Get a specific resource
 *
 * GET /:photoId
 */
 const show = async (req, res) => {

	// fetch the user (and eager-load the photos-relation)
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });

	const photos = user.related('photos');

	// check if photo is already in the user's list of photos
	const existing_photo = photos.find(photo => photo.id == req.params.photoId);

	// if it does not exist, bail
	if (!existing_photo) {
		return res.status(404).send({
			status: 'fail',
			data: 'Photo Not Found',
		});
	}

	try {
		res.status(200).send({
			status: 'success',
			data: existing_photo,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when getting photo.',
		});
		throw error;
	}
}

/**
 * Store a new resource
 *
 * POST /
 */
const store = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	validData.user_id = req.user.user_id

	console.log("The validated data:", validData);

	try {
		const photo = await new models.Photo(validData).save();
		debug("Created new photo successfully: %O", photo);

		res.status(200).send({
			status: 'success',
			data: {
				photo,
			},
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new photo.',
		});
		throw error;
	}
}

module.exports = {
	index,
	show,
	store,
}