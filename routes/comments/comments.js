const express = require("express");
const {
  createCommentCtrl,
  commentDetailsCtrl,
  delteCommentCtrl,
  updateCommentCtrl,
} = require("../../controllers/comments/comments");
const protected = require("../../middlewares/protected");
const commentRoutes = express.Router();

// Create Comment
commentRoutes.post("/:id", protected, createCommentCtrl);

// Fetch single Comment
commentRoutes.get("/:id", commentDetailsCtrl);

// Delete comment
commentRoutes.delete("/:id", protected, delteCommentCtrl);

// Update comment
commentRoutes.put("/:id", protected, updateCommentCtrl);

module.exports = commentRoutes;
