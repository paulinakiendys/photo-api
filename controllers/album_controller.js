/**
 * Album Controller
 */

const debug = require('debug')('photos:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all resources
 *
 * GET /
 */
 const index = async (req, res) => {
	// fetch the user (and eager-load the albums-relation)
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

	res.status(200).send({
		status: 'success',
		data: user.related('albums'),
	});
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
		const album = await new models.Album(validData).save();
		debug("Created new album successfully: %O", album);

		res.status(200).send({
			status: 'success',
			data: {
				album,
			},
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
}

/**
 * Update a specific resource
 *
 * PUT /:albumId
 */
const update = async (req, res) => {

	// fetch the user (and eager-load the albums-relation)
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

	const albums = user.related('albums');

	// check if album is already in the user's list of albums
	const existing_album = albums.find(album => album.id == req.params.albumId);

	// if it does not exist, bail
	if (!existing_album) {
		return res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);
	
	console.log("The validated data:", validData);

	try {
		const updatedAlbum = await existing_album.save(validData);
		debug("Updated album successfully: %O", updatedAlbum);

		res.status(200).send({
			status: 'success',
			data: updatedAlbum,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating album.',
		});
		throw error;
	}
}

/**
 * Add a photo to an album
 *
 * POST /:albumId/photos
 */
 const addPhoto = async (req, res) => {

	// fetch the user (and eager-load the albums-relation)
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

	const albums = user.related('albums');

	// check if album is already in the user's list of albums
	const existing_album = albums.find(album => album.id == req.params.albumId);

	// if it does not exist, bail
	if (!existing_album) {
		return res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	console.log("The validated data:", validData);

	// fetch album and eager-load photos relation
	const album = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos'] });

	// get the albums's photos
	const photos = album.related('photos');

	// check if photo is already in the album's list of photos
	const existing_photo = photos.find(photo => photo.id == validData.photo_id);

	// if it already exists, bail
	if (existing_photo) {
		return res.send({
			status: 'fail',
			data: 'Photo already exists.',
		});
	}

	try {
		const result = await album.photos().attach(validData.photo_id);
		debug("Added photo to album successfully: %O", result);

		res.send({
			status: 'success',
			data: null,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to an album.',
		});
		throw error;
	}
}

module.exports = {
	index,
	store,
	update,
	addPhoto,
}