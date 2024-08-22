const express = require("express");
const multer = require("multer");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const postRoutes = express.Router();
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const Post = require("../../model/post/post");
const { findById } = require("../../model/comment/comment");

// instance of multer
const upload = multer({
  storage,
});

// forms
postRoutes.get("/post-form", (req, res) => {
  res.render("posts/addPost", { error: "" });
});

postRoutes.get("/post-update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", { post, error: "" });
  } catch (error) {
    res.render("posts/updatePost", { error, post: "" });
  }
});

// Create post
postRoutes.post("/", protected, upload.single("postImg"), createPostCtrl);

// Get all posts
postRoutes.get("/", fetchPostsCtrl);

// Get single post
postRoutes.get("/:id", fetchPostCtrl);

// Delete post
postRoutes.delete("/:id", protected, deletePostCtrl);

// Update post
postRoutes.put("/:id", protected, upload.single("postImg"), updatePostCtrl);

module.exports = postRoutes;
