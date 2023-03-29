const express = require('express');
const workspaceRoute = express.Router();
const {
	createWorkspace,
	joinWorkspace,
	getusersWorkspace,
	editWorkspace,
	softDeleteWorkspace,
	hardDeleteWorkSpaces,
	restoreWorkSpaces,
	getAllDeletedWorkSpaces
} = require('../controllers/WorkspaceController');
const { isLoggedIn, ownerOnly } = require('../middlewares/auth');

workspaceRoute.route('/create').post(isLoggedIn, createWorkspace);

workspaceRoute.route('/join').post(joinWorkspace);

workspaceRoute.route('/users-workspace').get(isLoggedIn, getusersWorkspace);

workspaceRoute.route('/edit/:id').put(isLoggedIn, ownerOnly, editWorkspace);

workspaceRoute
	.route('/delete/:id')
	.delete(isLoggedIn, ownerOnly, softDeleteWorkspace);

workspaceRoute
	.route('/deleted-workspace')
	.get(isLoggedIn, getAllDeletedWorkSpaces);

workspaceRoute
	.route('/delete-permanently/:id')
	.delete(isLoggedIn, ownerOnly, hardDeleteWorkSpaces);

workspaceRoute
	.route('/restore/:id')
	.put(isLoggedIn, ownerOnly, restoreWorkSpaces);

module.exports = workspaceRoute;
