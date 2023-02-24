const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

exports.isLoggedIn = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			throw new Error('please login first');
		}

		const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await UserModel.findById({ _id: decodeToken.id });
		next();
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.customRole = (...roles) => {
	return (req, res, next) => {
		try {
			if (!roles.includes(req.user.role)) {
				throw new Error('access denided');
			}
			next();
		} catch (error) {
			res.status(400).json(error.message);
		}
	};
};
