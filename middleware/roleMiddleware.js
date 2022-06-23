const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (roles) {
	return (req, res, next) => {
		if (req.method === 'OPTIONS') {
			next();
		}

		try {
			const token = req.headers.authorization.split(' ')[1];
			if (!token) {
				res.status(403).json({ message: 'Користувач не авторизований' });
			}
			const { roles: userRoles } = jwt.verify(token, secret);
			let hasRoles = false;
			hasRoles.forEach((role) => {
				if (roles.includes(role)) {
					hasRoles = true;
				}
			});
			if (!hasRole) {
				res.status(403).json({ message: 'Немає дозволу' });
			}
			next();
		} catch (error) {
			console.log(error);
			res.status(403).json({ message: 'Користувач не авторизований' });
		}
	};
};
