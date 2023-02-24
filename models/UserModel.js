const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	verified: {
		type: Boolean,
		required: true,
		default: false
	},
	role: {
		type: String,
		require: true,
		default: 'user'
	}
});

module.exports = mongoose.model('User', userSchema);
