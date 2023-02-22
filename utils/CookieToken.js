const jwt = require('jsonwebtoken');

const cookieToken = (user, res, message) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
	const options = {
		// sameSite: 'none',
		// secure: true,
		httpOnly: true,
		expires: new Date(
			Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
		)
	};
	user.password = undefined;

	res
		.status(200)
		.cookie('token', token, options)
		.json({ success: true, message, user });
};

module.exports = cookieToken;
