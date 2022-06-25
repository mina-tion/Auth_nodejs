const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('./config');

const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles,
	};
	return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
	async registration(req, res) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				console.log(errors);
				return res.status(400).json({ message: 'Помилка при валідації' });
			}
			const { email, password } = req.body;
			const candidate = await User.findOne({ email });
			if (candidate) {
				return res
					.status(400)
					.json({ message: 'Користувач вже зареєстрований' });
			}
			const hashPassword = bcrypt.hashSync(password, 7);
			const userRole = await Role.findOne({ value: 'USER' });
			const user = new User({
				email,
				password: hashPassword,
				roles: [userRole.value],
				bookmarks: { genres: [], authors: [] },
			});
			await user.save();
			return res.json({ message: 'Користувача зареєстровано' });
		} catch (error) {
			console.log(error);
			res.status(400).json({ message: 'Помилка при реєстрації' });
		}
	}
	async login(req, res) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });
			if (!user) {
				res.status(400).json({ message: 'Користувача не знайдено' });
			}
			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				res.status(400).json({ message: 'Невірний пароль' });
			}
			const token = generateAccessToken(user._id, user.roles);
			return res.json({ token, email });
		} catch (error) {
			console.log(error);
			res.status(400).json({ message: 'Login error' });
		}
	}
	async getUsers(req, res) {
		try {
			const users = await User.find();

			res.json(users);
		} catch (error) {}
	}

	async getBookmarks(req, res) {
		const { email, bookmarks } = req.body;

		try {
			const user = await User.findOne({ email });

			if (!user) {
				res.status(400).json({ message: 'Користувача не знайдено' });
			}

			if (bookmarks) {
				if (JSON.stringify(bookmarks) !== JSON.stringify(user.bookmarks)) {
					user.bookmarks = bookmarks;
				}
			}
			const uBookmarks = user.bookmarks;
			return res.json({ uBookmarks });
		} catch (error) {}
	}
}

module.exports = new authController();
