const userModel = require('../models/UserModel');
const taskmodel = require('../models/TodoListModel');
const bcrypt = require('bcryptjs');
const cookieToken = require('../utils/CookieToken');
const { sendMail } = require('../utils/emailSender');
const jwt = require('jsonwebtoken');
const WorkspaceModel = require('../models/WorkspaceModel');

exports.signUp = async (req, res) => {
	try {
		{
			const { name, email, password } = req.body;
			if ((!name, !email, !password)) {
				throw new Error('all fields are required');
			}
			const isUserExist = await userModel.findOne({ email });

			if (isUserExist) {
				throw new Error('this email id is already registered');
			}
			const newUser = new userModel({
				name,
				email,
				password
			});
			const response = await userModel.create(newUser);

			//	sending mail to user
			// const token = response.getJwtToken(process.env.JWT_EXPIRY);
			// mailQueue.add({ email: response.email, name, token });

			// sending response back
			cookieToken(res, response, 'Account Created Successfully');
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.signIn = async (req, res) => {
	try {
		const { email, password } = req.body;

		if ((!email, !password)) {
			throw new Error('all fields are required');
		}

		const user = await userModel.findOne({ email }).select('+password');

		if (!user) {
			throw new Error('Email id does not exist ');
		}

		const ispasswordValid = await user.ispasswordValid(password);
		if (!ispasswordValid) {
			throw new Error('Invalid Password');
		}
		user.password = undefined;
		cookieToken(res, user, `welcome ${user.name}`);
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
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
			throw new Error('Account already verified');
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '60m'
		});
		//3600000
		const verificationUrl = `${process.env.ORIGIN}/verify/${token}`;

		const html = `<div style="display:flex; justify-content: center; align-items: center ; color: black ; ">
        <div
            style="display: flex; justify-content: center;border: 2px solid black; width: auto; height: auto; padding: 5px; background-color: rgb(22, 214, 248); border-radius: 5px ; ;">
            <div style="text-align: center ;">
                <h1>Verify Account</h1>
                <h3>Hi <h1>${user.name}</h1> Welcome to Task Manager</h3>



                <p>
                    A verify account event has been triggered. The verify account window is limited to ONE HOUR.

                <p>
                    If you do not verify your account within ONE HOUR , you will need to submit a new request from your profile tab.
                </p>

                To verify account visit the following link:

                </p>
                <a href=${verificationUrl} style="border: 2px solid black ;padding: 7px ; border-radius: 15px; text-decoration: none ;background-color: rgb(40, 242, 13);
                color: black;
                    font-weight: bold;">Verify
                    Account</a>
                <p>if this button does not work click on the below link</p>
                <p><span>Link: </span> <a href=${verificationUrl}>
                       ${verificationUrl}</a>
                </p>
            </div>
        </div>
    </div>`;
		const response = await sendMail(user.email, 'Verify Your Account', html);
		res.status(200).json({
			success: true,
			message: `Email successfully send to ${response.accepted[0]}`
		});
	} catch (error) {
		res.status(400).json(error);
	}
};

exports.sendForgetMail = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await userModel.findOne({ email }).select('+password');

		if (user === null) {
			throw new Error('Email id does not exist');
		}

		const newJwtSecret = process.env.JWT_SECRET + user.password;
		const token = jwt.sign({ id: user._id }, newJwtSecret, {
			expiresIn: '15m'
		});

		const forgetPasswordUrl = `${process.env
			.ORIGIN}/forgetpassword/${token}/${user._id}`;
		const html = ` <div style="display:flex; justify-content: center; align-items: center ; color: black ; ">
        <div
            style="display: flex; justify-content: center;border: 2px solid black; width: auto; height: auto; padding: 5px; background-color: rgb(22, 214, 248); border-radius: 5px ; ;">
            <div style="text-align: center ;">
                <h1>Reset Password</h1>
                <h3>Hi <h1>${user.name}</h1> Welcome to Task Manager</h3>



                <p>
                    A password reset event has been triggered. The password reset window is limited to two hours.

                <p>
                    If you do not reset your password within 10 minutes, you will need to submit a new request.
                </p>

                To Reset Password, visit the following link:
                </p>
                <a href=${forgetPasswordUrl} style="border: 2px solid black ;padding: 7px ; border-radius: 15px; text-decoration: none ;background-color: rgb(40, 242, 13);
                color: black;
                    font-weight: bold;">Reset Password</a>
                <p>if this button does not work click on the below link</p>
                <p><span>Link: </span> <a href=${forgetPasswordUrl}>
                       ${forgetPasswordUrl}</a>
                </p>
            </div>
        </div>
    </div>`;
		const response = await sendMail(user.email, 'Forget Password', html);
		res.status(200).json({
			success: true,
			message: `Email successfully send to ${response.accepted[0]}`
		});
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.forgetUserPassword = async (req, res) => {
	try {
		const { token, id } = req.params;
		const { password } = req.body;
		if (!token || !id) {
			throw new Error('this link has been currapted');
		}
		const user = await userModel.findOne({ _id: id });
		if (!user) {
			throw new Error('user does not exist');
		}

		const newJwtSecret = process.env.JWT_SECRET + user.password;

		const decodedToken = jwt.verify(token, newJwtSecret);
		console.log(decodedToken);

		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;
		await user.save();

		res
			.status(200)
			.json({ success: true, message: 'password changed successfully' });
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.verifyUser = async (req, res) => {
	try {
		const { token } = req.params;
		if (!token) {
			throw new Error('');
		}
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		const user = await userModel.findOne({ _id: decodedToken.id });
		if (!user) {
			throw new Error('user does not exist');
		}

		user.verified = true;
		await user.save();
		res.status(200).json({ success: true, message: 'Account Verified' });
	} catch (error) {
		res.status(400).json(error.message);
	}
};

// Admin controllers

exports.adminGetAllUsers = async (req, res) => {
	try {
		const verifiedUser = await userModel.find({
			verified: true,
			role: { $ne: 'admin' }
		});
		const unVerifiedUser = await userModel.find({
			verified: false,
			role: { $ne: 'admin' }
		});

		res.status(200).json({
			success: true,
			verifiedUser,
			unVerifiedUser,
			totalVerifiedUsers: verifiedUser.length,
			totalUnVerifiedUsers: unVerifiedUser.length
		});
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.adminChangeRoles = async (req, res) => {
	try {
		const { role, userId } = req.body;
		if (!role || !userId) {
			throw new Error('invalid user information');
		}
		const user = await userModel.findOneAndUpdate(
			{ _id: userId },
			{ role },
			{ new: true }
		);
		res
			.status(200)
			.json({ success: true, message: 'Role updated successfully', user });
	} catch (error) {
		res.status(400).json(error.message);
	}
};

// signup and join workspace

exports.signUpAndJoinWorkspace = async (req, res) => {
	try {
		{
			const { name, email, password, workspaceId } = req.body;
			if ((!name, !email, !password)) {
				throw new Error('all fields are required');
			}
			const isUserExist = await userModel.findOne({ email });

			if (isUserExist) {
				throw new Error('this email id is already registered');
			}
			const newUser = new userModel({
				name,
				email,
				password
			});
			let user = await userModel.create(newUser);

			//	sending mail to user
			// const token = response.getJwtToken(process.env.JWT_EXPIRY);
			// mailQueue.add({ email: response.email, name, token });

			// sending response back

			const workspace = await WorkspaceModel.findByIdAndUpdate(
				{ _id: workspaceId },
				{
					$push: { members: user._id }
				},
				{
					new: true
				}
			);

			user = await userModel.findOneAndUpdate(
				{ _id: user._id },
				{
					$push: { workspace: workspaceId }
				},
				{
					new: true
				}
			);

			cookieToken(res, user, workspace, 'Account Created Successfully');
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};
