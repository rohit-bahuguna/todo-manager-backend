const mongoose = require('mongoose');

const assignedTaskSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		taskDocs: [
			{
				publicId: {
					type: String
				},
				url: {
					type: String,
					required: true
				}
			}
		],

		assignedBy: {
			name: {
				type: String,
				required: true
			},
			email: {
				type: String,
				required: true
			},
			role: {
				type: String,
				required: true
			}
		},
		assignedTo: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true
			}
		],
		startDate: {
			type: String,
			required: true
		},
		completionDate: {
			type: String,
			require: true
		},
		status: {
			type: String,
			require: true,
			default: 'pending'
		},
		comments: [
			{
				message: { type: String },
				messagedBy: {
					type: String
				}
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('AssignedTask', assignedTaskSchema);
