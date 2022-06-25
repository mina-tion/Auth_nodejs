const { Schema, model } = require('mongoose');

const User = new Schema({
	email: { type: String,   required: true },
	password: { type: String, required: true },
	roles: [{ type: String, ref: 'Role' }],
	bookmarks: { type: Object }
});

module.exports = model('User', User);
