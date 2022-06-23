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
				return res.status(400).json('Помилка при реєстрації', errors);
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
			});
			await user.save();
			return res.json({ message: 'Користувача зареєстровано' });
		} catch (error) {
			console.log(error);
			res.status(400).json({ message: 'Registration error' });
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
			return res.json({ token });
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
}

module.exports = new authController();
