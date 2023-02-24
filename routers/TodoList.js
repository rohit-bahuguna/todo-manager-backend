const express = require('express');
todoItemRouter = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/auth');
const {
	createTodoItem,
	getAllItemsOfaUser,
	updateAnTodoItem,
	deleteAnTodoItem
} = require('../controllers/TodoListController');

const {
	assignTaskToUser,
	getAllAssignedTaskOfAUser
} = require('../controllers/AssignTaskController');

assignTaskToUser;

todoItemRouter.route('/create').post(isLoggedIn, createTodoItem);

todoItemRouter.route('/getalltask').get(isLoggedIn, getAllItemsOfaUser);

todoItemRouter.route('/updatetask/:taskId').put(isLoggedIn, updateAnTodoItem);

todoItemRouter
	.route('/deletetask/:taskId')
	.delete(isLoggedIn, deleteAnTodoItem);

todoItemRouter
	.route('/assigntask')
	.post(isLoggedIn, customRole('manager'), assignTaskToUser);

todoItemRouter
	.route('/getassignedtask')
	.get(isLoggedIn, getAllAssignedTaskOfAUser);
module.exports = todoItemRouter;
