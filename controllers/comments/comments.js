const Comment = require("../../model/comment/comment");
const Post = require("../../model/post/post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
// Create comment
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    // create the comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
      post: post._id,
    });
    // push the comment to the oost
    post.comment.push(comment._id);
    // find the user
    const user = await User.findById(req.session.userAuth);
    // push the comment into user
    user.comment.push(comment._id);
    // disable the validation
    // save
    await post.save({
      validateBeforeSave: false,
    });
    await user.save({
      validateBeforeSave: false,
    });
    // console.log(post);
    // redirect
    res.redirect(`/api/v1/posts/${post._id}`);
  } catch (error) {
    next(appErr(error.message));
  }
};

// Fetch comment
const commentDetailsCtrl = async (req, res, next) => {
  try {
    // get the id from params
    const id = req.params.id;
    // find the comment
    const comment = await Comment.findById(id);
    res.render("comments/updateComment", {
      comment,
      error: "",
    });
  } catch (error) {
    res.render("comments/updateComment", {
      error: error.message,
    });
  }
};

// Delete Comment
const delteCommentCtrl = async (req, res, next) => {
  // console.log(req.query.postId);
  try {
    // find the comment
    const comment = await Comment.findById(req.params.id);
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this comment", 404));
    }
    // delete post
    await Comment.findByIdAndDelete(req.params.id);
    // res.json({
    //   status: "Success",
    //   user: "Comment has been deleted successfully",
    // });
    // redirect
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error.message));
  }
};

// Update comment
const updateCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // find the post
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("Comment not found"));
    }
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to update this comment", 404));
    }
    const commentUpdated = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        message,
      },
      {
        new: true,
      }
    );
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  delteCommentCtrl,
  updateCommentCtrl,
};
