const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
	},
	workspace: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Workspace'
		}
	],
	projects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Poject'
		}
	]
});
userSchema.index({ email: 1 });

// hash password before saving to db

userSchema.pre('save', async function(next) {
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// check for users password

userSchema.methods.ispasswordValid = async function(passwordFromUser) {
	return await bcrypt.compare(passwordFromUser, this.password);
};

// generate user password

userSchema.methods.getJwtToken = function(expiresIn) {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: '1day'
	});
};

module.exports = mongoose.model('User', userSchema);
