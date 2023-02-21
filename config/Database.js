const mongoose = require('mongoose');

exports.connectToDb = () => {
	mongoose.connect(process.env.MONGO_URL, () => {
		console.log('db connected');
	});
};
