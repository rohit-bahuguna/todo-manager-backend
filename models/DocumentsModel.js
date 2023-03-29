const mongoose = require('mongoose');

const documentsSchema = mongoose.Schema(
	{
		Docs: [
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
		docOf: {
			type: String,
			required: true,
			enum: ['task', 'comment']
		},
		docOfId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Documents', documentsSchema);
