const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

mongoose.set('strictQuery', false);
exports.connectToDb = () => {
	mongoose.connect(process.env.MONGO_URL, () => {
		console.log('db connected');
	});
};

exports.connectToCloudinary = () => {
	cloudinary.config({
		cloud_name: process.env.CLOUDEINARY_CLOUD_NAME,
		api_key: process.env.CLOUDEINARY_API_KEY,
		api_secret: process.env.CLOUDEINARY_API_SECRET
	});
};
