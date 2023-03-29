const express = require('express');
const {
	createProject,
	getAllProjectsOfWorkspace
} = require('../controllers/ProjectController');
const { isLoggedIn } = require('../middlewares/auth');
projectRouter = express.Router();

projectRouter.route('/create').post(isLoggedIn, createProject);

projectRouter
	.route('/workspace/:id')
	.get(isLoggedIn, getAllProjectsOfWorkspace);

module.exports = projectRouter;
