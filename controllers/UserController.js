const userModel = require('../models/UserModel');
const taskmodel = require('../models/TodoListModel');
const bcrypt = require('bcryptjs');
const cookieToken = require('../utils/CookieToken');

exports.logIn = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const isExist = await userModel.findOne({ email });
		if (isExist) {
			throw new Error('User already exist');
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = new userModel({
				name,
				email,
				password: hashedPassword
			});
			const user = await userModel.create(newUser);

			cookieToken(user, res, 'Account created Successfully');
		}
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.signIn = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await userModel.findOne({ email });
		if (!user) {
			throw new Error('User does not exist');
		} else {
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				throw new Error('Invalid Password');
			}

			cookieToken(user, res, 'Sign in successfully');
		}
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.logOut = async (req, res) => {
	try {
		res
			.status(200)
			.cookie('token', null, {
			        sameSite: 'none',
				secure: true,
				expires: new Date(Date.now()),
				httpOnly: true
			})
			.json({ success: true, message: 'user logout successfully' });
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.getuserData = async (req, res) => {
	try {
		const userId = req.user;
		const user = await userModel.findOne({ _id: userId });
		const tasks = await taskmodel.find({ user: userId });
		res.status(200).json({ user, totalTasks: tasks.length });
	} catch (error) {
		res.satus(400).json(error.message);
	}
};
