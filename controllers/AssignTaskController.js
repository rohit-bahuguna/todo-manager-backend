const assignTaskModel = require('../models/AssignedTask');
const cloudinary = require('cloudinary').v2;
// Manager Controller

exports.assignTaskToUser = async (req, res) => {
	try {
		const {
			title,
			description,
			assignedTo,
			completionDate,
			message,
			startDate
		} = req.body;
		const { name, email, role, _id } = req.user;
		let taskDocs = [];

		if (req.files) {
			for (let i = 0; i < req.files.docs.length; i++) {
				const result = await cloudinary.uploader.upload(
					req.files.docs[i].tempFilePath,
					{ folder: 'taskDocs' }
				);
				taskDocs.push({
					public_id: result.public_id,
					url: result.secure_url
				});
			}
			console.log(taskDocs);
		} else {
			taskDocs.push({ url: req.body.docUrl });
		}

		const createNewTask = new assignTaskModel({
			title,
			description,
			taskDocs,
			assignedBy: {
				name,
				email,
				role
			},
			assignedTo,
			startDate,
			completionDate,
			comments: [{ message, messagedBy: name }]
		});
		const newTask = await assignTaskModel.create(createNewTask);

		res
			.status(200)
			.json({ success: true, message: 'task assigned successfully', newTask });
	} catch (error) {
		res.status(400).json(error.message);
	}
};

// user

exports.getAllAssignedTaskOfAUser = async (req, res) => {
	try {
		const { _id } = req.user;

		const assignedTask = await assignTaskModel.find({ assignedTo: _id });

		res.status(200).json({
			success: true,
			totalAssignedTasks: assignedTask.length,
			assignedTask
		});
	} catch (error) {
		res.status(400).json(error.message);
	}
};
