const todoModel = require('../models/TodoListModel');

exports.createTodoItem = async (req, res) => {
	try {
		const { title, description, status } = req.body;
		const { user } = req;

		const newTodoItem = new todoModel({
			title,
			description,
			status,
			user: user._id
		});
		const response = await todoModel.create(newTodoItem);
		res.status(200).json({
			success: true,
			message: 'Task created successfully',
			task: response
		});
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.getAllItemsOfaUser = async (req, res) => {
	try {
		const { _id } = req.user;
		const allItems = await todoModel.find({ user: _id });
		res.status(200).json({
			success: true,
			tasks: allItems,
			totalTasks: allItems.length
		});
	} catch (error) {
		res.status(400).json(error.message);
	}
};

exports.updateAnTodoItem = async (req, res) => {
	try {
		const { taskId } = req.params;
		const { title, description, status } = req.body;
		const { _id } = req.user;

		if (!title || !description || !status) {
			throw new Error('all fields are required');
		}
		const updatedTask = await todoModel.findOneAndUpdate(
			{
				_id: taskId,
				user: _id
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
		res.status(400).json(error.message);
	}
};

exports.deleteAnTodoItem = async (req, res) => {
	try {
		const { taskId } = req.params;
		const { _id } = req.user;
		const deletedTodoItem = await todoModel.findOneAndDelete({
			_id: taskId,
			user: _id
		});
		res.status(200).json({
			success: true,
			message: 'item deleted successfully',
			deletedTodoItem
		});
	} catch (error) {
		res.status(400).json(error.message);
	}
};
