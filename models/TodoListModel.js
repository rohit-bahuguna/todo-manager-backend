const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	status: {
		name: {
			type: String,
			required: true,
			default: 'active'
		},
		color: {
			type: String,
			required: true,
			default: 'grey'
		}
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	],
	start_date: {
		type: String
	},
	end_date: {
		type: String
	},
	Priority: {
		type: String,
		required: true,
		default: 'None',
		enum: ['None', 'Low', 'Medium', 'High']
	},
	labels: [
		{
			title: {
				type: String
			},
			color: {
				type: String,
				default: 'grey'
			}
		}
	],
	completion_percentage: {
		type: Number
	},
	assigned_to: [
		{
			type: mongoose.Schema.Types.ObjectId,

			ref: 'User'
		}
	],
	assignedBy: {
		name: {
			type: String
		},
		email: {
			type: String
		},
		role: {
			type: String
		}
	},
	tsaklist: {
		type: String,
		required: true,
		default: 'General'
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Project'
	}
});

module.exports = mongoose.model('Task', taskSchema);
