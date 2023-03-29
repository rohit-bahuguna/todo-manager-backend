const projectModel = require('../models/ProjectModel');
const userModel = require('../models/UserModel');

exports.createProject = async (req, res) => {
	try {
		const { user } = req;

		const newProject = new projectModel({
			...req.body,
			owner: user._id,
			workspace: req.body.workspaceId || null
		});

		const project = await projectModel.create(newProject);
		// send mail that they have been added to a project by owner
		res.status(200).json({
			success: true,
			message: 'Project Create Successfully',
			project
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

exports.getAllProjectsOfWorkspace = async (req, res) => {
	try {
		console.log(req.query, req.params);
		const allProjects = await projectModel.find({ workspace: req.params.id });

		res.status(200).json({
			success: true,
			allProjects
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};
