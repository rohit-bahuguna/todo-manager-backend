const userModel = require('../models/UserModel');
const taskmodel = require('../models/TodoListModel');
const bcrypt = require('bcryptjs');
const cookieToken = require('../utils/CookieToken');
const nodemailer = require('nodemailer');
const { sendMail } = require('../utils/emailSender');
const jwt = require('jsonwebtoken');
const { use } = require('../routers/User');
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

			const message = `Hi ${user.name} we are happy to have you here please verify your email `;
			await sendMail(req, user, 'Verify Email', message)

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
			if (!user.verified) {
				const message = `Hi ${user.name} we are happy to have you here please verify your email `;
				await sendMail(req, user, 'Verify Email', message)
			}

			cookieToken(user, res, 'Sign in successfully ');
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

exports.sendVerificationMail = async (req, res) => {
	try {
		const userId = req.user;
		const user = await userModel.findOne({ _id: userId });
		if (user.verified) {
			throw new Error('Account already verified')
		}
		const baseUrl = `${process.env.ORIGIN}/verify`
		const message = `Hi ${user.name} we are happy to have you here please verify your email `;
		const response = await sendMail(baseUrl, user, 'Verify Email', message);
		res.status(200).json({ success: true, message: `email successfully send to ${response.accepted[0]}` })
	} catch (error) {
		res.status(400).json(error);
	}
};

exports.sendForgetMail = async (req, res) => {
	try {
		const { email } = req.body
		console.log(email);
		const user = await userModel.findOne({ email });

		const baseUrl = `${process.env.ORIGIN}/forgetpassword`
		const message = `Hi ${user.name} `;
		const response = await sendMail(baseUrl, user, 'Forget Password', message);
		res.status(200).json({ success: true, message: `Email successfully send to ${response.accepted[0]}` })
	} catch (error) {
		res.status(400).json(error);
	}
}


exports.forgetUserPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body
		if (!token) {
			throw new Error('tooken missing');
		}
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

		const user = await userModel.findOne({ _id: decodedToken.id })
		if (!user) {
			throw new Error("user does not exist")
		}
		const hashedPassword = await bcrypt.hash(password, 10)
		user.password = hashedPassword;
		await user.save()

		res.status(200).json({ success: true, message: "password changed successfully" })

	} catch (error) {
		res.status(400).json(error.message)
	}
}





exports.verifyUser = async (req, res) => {
	try {
		const { token } = req.params;
		if (!token) {
			throw new Error('');
		}
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

		const user = await userModel.findOne({ _id: decodedToken.id })
		if (!user) {
			throw new Error("user does not exist")
		}

		user.verified = true
		await user.save()
		res.status(200).json({ success: true, message: 'Account Verified' })

	} catch (error) {
		res.status(400).json(error.message);
	}
};

