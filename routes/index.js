const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation/user');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

// Register a new user
router.post('/register', userValidationRules.createRules, authController.register);

module.exports = router;
