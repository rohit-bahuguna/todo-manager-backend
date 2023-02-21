const express = require('express');
const {
	logIn,
	signIn,
	logOut,
	getuserData
} = require('../controllers/UserController');
const isLoggedIn = require('../middlewares/auth');
const userRoute = express.Router();

userRoute.route('/login').post(logIn);
userRoute.route('/signin').post(signIn);
userRoute.route('/logout').get(logOut);
userRoute.route('/getuserdata').get(isLoggedIn, getuserData);
module.exports = userRoute;
