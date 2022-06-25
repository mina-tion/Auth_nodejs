const Router = require('express');
const router = new Router();
const authController = require('./authController');
const { check } = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

router.post(
	'/registration',
	[
		check('email', 'Пусте поле не допускається').notEmpty(),
		check('password', 'Від 4х до 12ти символів').isLength({ min: 4, max: 12 }),
	],
	authController.registration
);
router.post('/login', authController.login);
router.get('/users', roleMiddleware(['ADMIN']), authController.getUsers);
router.post('/bookmarks', authController.getBookmarks);




module.exports = router;
