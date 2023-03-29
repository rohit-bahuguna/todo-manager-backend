const commentModel = require('../Models/CommentModel');
const { getOrSetCache } = require('../Utils/GetOrSetCache');

exports.commentonRecipe = async (req, res) => {
	try {
		const { id } = req.user;
		const { recipeId } = req.params;
		const { comment } = req.body;

		const newComment = await commentModel.create({
			comment,
			commentedBy: id,
			date: new Date(),
			recipe: recipeId
		});

		res.status(200).json({
			success: true,
			message: 'commented successfully',
			comment: newComment
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

exports.getAllCommentsOfArecipe = async (req, res) => {
	try {
		const { recipeId } = req.params;
		const comments = await getOrSetCache(`comment${recipeId}`, async () => {
			return await commentModel.find({ recipe: recipeId });
		});

		res.status(200).json({
			success: true,
			comments
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

exports.deleteComment = async (req, res) => {
	try {
		const { commentId } = req.params;

		const { id } = req.user;
		const deletedComment = await commentModel.findOneAndRemove({
			_id: commentId,
			commentedBy: id
		});

		//	.explain('executionStats');

		if (deletedComment === null) {
			throw new Error('you are not allowed to delete this message');
		}
		res.status(200).json({
			success: true,
			message: 'comment deleted successfully',
			deletedComment
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

exports.editComment = async (req, res) => {
	try {
		const { id } = req.user;
		const { commentId } = req.params;
		const { comment } = req.body;

		const updatedComment = await commentModel.findOneAndUpdate(
			{ _id: commentId, commentedBy: id },
			{ comment, edited: true },
			{
				new: true
			}
		);

		if (updatedComment === null) {
			throw new Error('you are not allowed to edit this message');
		}

		res.status(200).json({
			success: true,
			message: 'comment updated successfully',
			updatedComment
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};
