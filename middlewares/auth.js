const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const workspaceModel = require('../models/WorkspaceModel');
const taskModel = require('../models/TodoListModel');
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

exports.ownerOnly = async (req, res, next) => {
	try {
		const { owner } = await workspaceModel.findOne({ _id: req.params.id });

		if (owner.toString() !== req.user._id.toString()) {
			throw new Error('access denided');
		}
		next();
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.customRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new customError('You are not allow to access this resource'),
				403
			);
		}
		next();
	};
};

exports.ownerOnlyTask = async (req, res, next) => {
	try {
		const { owner } = await taskModel.findOne({ _id: req.params.taskId });
		console.log(owner);
		if (owner.toString() !== req.user._id.toString()) {
			throw new Error('access denided');
		}
		next();
	} catch (error) {
		res.status(400).json(error.message);
	}
};
