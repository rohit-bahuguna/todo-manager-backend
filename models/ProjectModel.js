const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	start_date: {
		type: String,
		required: true
	},
	end_date: {
		type: String,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	status: {
		type: String,
		required: true,
		default: 'active'
	},
	tags: [{ type: String }],

	visibility: {
		type: String,
		required: true,
		default: 'personal',
		enum: ['personal', 'workspace']
	},

	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	],
	workspace: {
		type: mongoose.Schema.Types.ObjectId,
		default: null,
		ref: 'Workspace'
	}
});

module.exports = mongoose.model('Project', projectSchema);
