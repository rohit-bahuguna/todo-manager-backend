const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
	comment: {
		type: String,
		required: true
	},
	commentedBy: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	date: {
		type: String,
		required: true
	},
	commented_on: {
		type: mongoose.Schema.ObjectId,
		ref: 'Task',
		required: true
	},
	edited: {
		type: Boolean,
		required: true,
		default: false
	}
});

commentSchema.index({ recicommented_on: 1 });
commentSchema.index({ commentedBy: 1 });

module.exports = mongoose.model('Comment', commentSchema);
