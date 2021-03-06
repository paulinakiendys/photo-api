const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation/user');
const auth = require('../middlewares/auth');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'deployed to Heroku' } });
});

router.use('/albums', auth.validateJwtToken, require('./albums'));
router.use('/photos', auth.validateJwtToken, require('./photos'));

// Login a user and get a JWT token
router.post('/login', userValidationRules.loginRules, authController.login);

// Issue a new JWT access token
router.post('/refresh', authController.refresh);

// Register a new user
router.post('/register', userValidationRules.createRules, authController.register);

module.exports = router;
