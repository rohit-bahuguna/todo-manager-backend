const express = require('express');
const {
	logIn,
	signIn,
	logOut,
	getuserData,
	verifyUser,
	sendVerificationMail,
	sendForgetMail,
	forgetUserPassword
} = require('../controllers/UserController');
const isLoggedIn = require('../middlewares/auth');
const userRoute = express.Router();

userRoute.route('/login').post(logIn);
userRoute.route('/signin').post(signIn);
userRoute.route('/logout').get(logOut);
userRoute.route('/getuserdata').get(isLoggedIn, getuserData);
userRoute.route(`/mailverification`).get(isLoggedIn, sendVerificationMail)
userRoute.route('/verify/:token').get(isLoggedIn, verifyUser)
userRoute.route('/forgetpasswordmail').post(sendForgetMail)
userRoute.route('/forgetuserpassword/:token').post(forgetUserPassword)
module.exports = userRoute;
