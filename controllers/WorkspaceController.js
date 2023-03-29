const WorkspaceModel = require('../models/WorkspaceModel');
const userModel = require('../models/UserModel');
const { sendMail } = require('../utils/emailSender');
const {
	WorkspaceInvitation
} = require('../utils/templates/InvitationTemplates');
const jwt = require('jsonwebtoken');

exports.createWorkspace = async (req, res) => {
	try {
		const { title, description, invitedMembers } = req.body;
		console.log(req.body);
		const { user } = req;

		const newWorkspace = new WorkspaceModel({
			title,
			description,
			invitedMembers,
			owner: user._id,
			members: [user._id]
		});

		const workspace = await WorkspaceModel.create(newWorkspace);
		await userModel.updateOne(
			{ _id: user._id },
			{
				$push: { workspace: workspace._id }
			}
		);

		for (let i = 0; i < invitedMembers.length; i++) {
			const token = jwt.sign(
				{ email: invitedMembers[i] },
				process.env.JWT_SECRET
			);

			const invitationUrl = `${process.env
				.ORIGIN}/workspace-ivitation/${workspace._id}/${token}`;

			const html = WorkspaceInvitation(
				user.name,
				workspace.title,
				invitationUrl
			);

			sendMail(
				invitedMembers[i],
				`you are invited to join ${workspace.title} workspace`,
				html
			);
		}

		res.status(200).json({
			success: true,
			message: 'Wokspace Created Successfully',
			workspace
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

exports.getusersWorkspace = async (req, res) => {
	try {
		const { user } = req;
		const { workspace } = await userModel.findOne({ _id: user._id });

		const usersWorkspace = await WorkspaceModel.find({
			_id: {
				$in: workspace
			}
		});

		res.status(200).json({
			success: true,
			message: 'got all workspace of user',
			usersWorkspace
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

exports.joinWorkspace = async (req, res) => {
	try {
		const { token, workspaceId } = req.body;
		const { email } = jwt.verify(token, process.env.JWT_SECRET);

		const user = await userModel.findOne({ email });

		if (user) {
			const updated = await WorkspaceModel.findByIdAndUpdate(
				{ _id: workspaceId },
				{
					$push: { members: user._id }
				},
				{
					new: true
				}
			);

			const updatedUser = await userModel.findOneAndUpdate(
				{ _id: user._id },
				{
					$push: { workspace: workspaceId }
				},
				{
					new: true
				}
			);

			const redirectUrl = `process.env.ORIGIN/join-workspace/signin/${user.email}`; //  this url will call signin api from user model
			res.status(200).json({
				success: true,
				message: 'joined workspace successfully',
				redirectUrl,
				updated,
				updatedUser
			});
		} else {
			const redirectUrl = `process.env.ORIGIN/join-workspace/signup/${workspaceId}/${email}`; //  this url will call signup api from user model
			res.status(200).json({
				success: true,
				message: 'you are not a registered user please sign up to continoue...',
				redirectUrl
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.editWorkspace = async (req, res) => {
	try {
		const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{ ...req.body },
			{
				new: true
			}
		);
		res.status(200).json({
			success: true,
			message: 'Changes saved',
			updatedWorkspace
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.softDeleteWorkspace = async (req, res) => {
	try {
		const deletedWorkspace = await WorkspaceModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				deleted: true
			},
			{
				new: true
			}
		);

		res.status(200).json({
			success: true,
			message: 'workspace deleted successfully',
			deletedWorkspace
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.getAllDeletedWorkSpaces = async (req, res) => {
	try {
		const { user } = req;
		const deletedWorkspaces = await WorkspaceModel.find({
			deleted: true,
			owner: user._id
		});
		res.status(200).json({
			success: true,
			deletedWorkspaces
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.restoreWorkSpaces = async (req, res) => {
	try {
		const workspace = await WorkspaceModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				deleted: false
			},
			{
				new: true
			}
		);

		res.status(200).json({
			success: true,
			message: 'workspace deleted successfully',
			workspace
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.hardDeleteWorkSpaces = async (req, res) => {
	try {
		const deletedWorkspace = await WorkspaceModel.findByIdAndDelete({
			_id: req.params.id
		});

		res.status(200).json({
			success: true,
			message: 'workspace deleted successfully',
			deletedWorkspace
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

exports.inviteMembers = async (req, res) => {};

exports.getAllMembersOfWorkspace = async (req, res) => {};
