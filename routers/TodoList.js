const express = require('express');
todoItemRouter = express.Router();
const {
	isLoggedIn,
	customRole,
	ownerOnlyTask
} = require('../middlewares/auth');
const {
	createTask,
	getAllTaskOfAProject,
	updateAnTask,
	deleteAnTask,
	getAllStatusTypeOfAProjectTask
} = require('../controllers/TodoListController');

const {
	assignTaskToUser,
	getAllAssignedTaskOfAUser
} = require('../controllers/AssignTaskController');

assignTaskToUser;

todoItemRouter.route('/create').post(isLoggedIn, createTask);

todoItemRouter.route('/getalltask/:id').get(isLoggedIn, getAllTaskOfAProject);

todoItemRouter
	.route('/updatetask/:taskId')
	.put(isLoggedIn, ownerOnlyTask, updateAnTask);

todoItemRouter
	.route('/deletetask/:taskId')
	.delete(isLoggedIn, ownerOnlyTask, deleteAnTask);

todoItemRouter.route('/status/:projectId').get(getAllStatusTypeOfAProjectTask);

module.exports = todoItemRouter;
