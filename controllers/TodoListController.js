const taskModel = require('../models/TodoListModel');

exports.createTask = async (req, res) => {
	try {
		const { user } = req;

		const newTodoItem = new taskModel({
			...req.body,
			owner: user._id
		});
		const response = await taskModel.create(newTodoItem);
		res.status(200).json({
			success: true,
			message: 'Task created successfully',
			task: response
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.getAllTaskOfAProject = async (req, res) => {
	try {
		const allTasks = await taskModel.find({ project: req.params.id });
		res.status(200).json({
			success: true,
			tasks: allTasks,
			totalTasks: allTasks.length
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.updateAnTask = async (req, res) => {
	try {
		const { taskId } = req.params;

		const updatedTask = await taskModel.findOneAndUpdate(
			{
				_id: taskId
			},
			req.body,
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: 'item updated successfully',
			updatedTask
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.deleteAnTask = async (req, res) => {
	try {
		const { taskId } = req.params;

		const deletedTask = await taskModel.findOneAndDelete({
			_id: taskId
		});
		res.status(200).json({
			success: true,
			message: 'item deleted successfully',
			deletedTask
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.getAllStatusTypeOfAProjectTask = async (req, res) => {
	try {
		const { projectId } = req.params;
		console.log(projectId);
		const sta = await taskModel.aggregate([
			{ $group: { _id: '$status', status: { $push: '$status' } } }
		]);

		res.status(200).json({
			success: true,
			sta
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};
