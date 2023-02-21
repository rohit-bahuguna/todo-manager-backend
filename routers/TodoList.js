const express = require('express');
todoItemRouter = express.Router();
const isLoggedIn = require('../middlewares/auth');
const {
	createTodoItem,
	getAllItemsOfaUser,
	updateAnTodoItem,
	deleteAnTodoItem
} = require('../controllers/TodoListController');

todoItemRouter.route('/create').post(isLoggedIn, createTodoItem);

todoItemRouter.route('/getalltask').get(isLoggedIn, getAllItemsOfaUser);

todoItemRouter.route('/updatetask/:taskId').put(isLoggedIn, updateAnTodoItem);

todoItemRouter
	.route('/deletetask/:taskId')
	.delete(isLoggedIn, deleteAnTodoItem);

module.exports = todoItemRouter;
