const { populate } = require("../../model/comment/comment");
const Post = require("../../model/post/post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
// Create post
const createPostCtrl = async (req, res, next) => {
  const { title, description, category, image, user } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost", {
        error: "All fields are required",
      });
    }
    // find the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // Create a post
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });
    // push the post created into the array of users post
    userFound.posts.push(postCreated._id);
    // resave the user
    await userFound.save();
    // redirect
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("posts/addPost", {
      error: error.message,
    });
  }
};
// Get all post
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comment").populate("user");

    res.json({
      status: "Success",
      data: posts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Get single post
const fetchPostCtrl = async (req, res, next) => {
  try {
    // get the id from params
    const id = req.params.id;
    // find the post
    const post = await Post.findById(id)
      .populate({
        path: "comment",
        populate: {
          path: "user",
        },
      })
      .populate("user");
    res.render("posts/postDetails", {
      post,
      error: "",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Delete Post
const deletePostCtrl = async (req, res, next) => {
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("post/postDetails", {
        error: "You are no authoriuzed to delete this post",
        post,
      });
    }
    // delete post
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("post/postDetails", {
      error: error.message,
    });
  }
};

// Update post
const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/updatePost", {
        error: "You are not authorized to update this post",
        post: "",
      });
    }
    // check if user is updating image
    if (req.file) {
      const postUpdated = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        {
          new: true,
        }
      );
    } else {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        {
          new: true,
        }
      );
    }
    // update

    res.redirect("/");
  } catch (error) {
    return res.render("posts/updatePost", {
      error: error.message,
    });
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
