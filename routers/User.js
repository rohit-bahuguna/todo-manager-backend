const express = require('express');
const userRoute = express.Router();

const {
	logIn,
	signIn,
	logOut,
	getuserData,
	verifyUser,
	sendVerificationMail,
	sendForgetMail,
	forgetUserPassword,
	adminGetAllUsers,
	adminChangeRoles
} = require('../controllers/UserController');

const { isLoggedIn, customRole } = require('../middlewares/auth');

userRoute.route('/login').post(logIn);
userRoute.route('/signin').post(signIn);
userRoute.route('/logout').get(logOut);
userRoute.route('/getuserdata').get(isLoggedIn, getuserData);
userRoute.route(`/mailverification`).get(isLoggedIn, sendVerificationMail);
userRoute.route('/verify/:token').get(isLoggedIn, verifyUser);
userRoute.route('/forgetpasswordmail').post(sendForgetMail);
userRoute.route('/forgetuserpassword/:token/:id').post(forgetUserPassword);

// admin Routes
userRoute
	.route('/admin/getallusers')
	.get(isLoggedIn, customRole('admin'), adminGetAllUsers);

userRoute
	.route('/admin/changerole')
	.post(isLoggedIn, customRole('admin'), adminChangeRoles);
// manager route

module.exports = userRoute;
