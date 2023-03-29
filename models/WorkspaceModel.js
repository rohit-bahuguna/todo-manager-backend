const mongoose = require('mongoose');

const workspaceSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
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
		invitedMembers: [
			{
				type: String,
				require: true
			}
		],
		deleted: {
			type: Boolean,
			require: true,
			default: false
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Workspace', workspaceSchema);
