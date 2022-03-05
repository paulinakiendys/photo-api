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
	 body('title').exists().isLength({ min: 3 }),
	 body('url').exists().isURL(),
	 body('comment').optional().isLength({ min: 3 }),
 ];

 module.exports = {
	createRules,
}