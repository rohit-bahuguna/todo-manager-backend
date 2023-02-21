const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true,
		default: 'pending',
		enum: ['pending', 'completed']
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

module.exports = mongoose.model('Todo', todoSchema);
