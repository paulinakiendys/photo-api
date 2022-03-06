const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/* Get all resources */
router.get('/', albumController.index);

// /* Get a specific resource */
// router.get('/:albumId', albumController.show);

/* Store a new resource */
router.post('/', albumValidationRules.createAndUpdateRules, albumController.store);

/* Update a specific resource */
router.put('/:albumId', albumValidationRules.createAndUpdateRules, albumController.update);

// /* Destroy a specific resource */
// router.delete('/:albumId', albumController.destroy);

module.exports = router;
