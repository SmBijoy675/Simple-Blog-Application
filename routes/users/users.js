const express = require("express");
const multer = require("multer");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  porfilePhotoCtrl,
  coverPhotoCtrl,
  updateUserCtrl,
  passwordCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const userRoutes = express.Router();

// instance of multer
const upload = multer({ storage });

// redndering forms
// login form
userRoutes.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});

// register form
userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

// profile photo upload
userRoutes.get("/profile-photo-upload", (req, res) => {
  res.render("users/uploadProfilePhoto", {
    error: "",
  });
});

// cover photo upload
userRoutes.get("/cover-photo-upload", (req, res) => {
  res.render("users/uploadCoverPhoto", {
    error: "",
  });
});

// update password
userRoutes.get("/update-user-password", (req, res) => {
  res.render("users/updatePassword", {
    error: "",
  });
});

// user details update
userRoutes.get("/update-details", (req, res) => {
  res.render("users/userUpdate");
});

// register
userRoutes.post("/register", registerCtrl);

// login
userRoutes.post("/login", loginCtrl);

// Profile
userRoutes.get("/profile", protected, profileCtrl);

// Update user
userRoutes.put("/update", updateUserCtrl);

// Update password
userRoutes.put("/update-password/", passwordCtrl);

// Logout
userRoutes.get("/logout", logoutCtrl);

// get single user details
userRoutes.get("/:id", userDetailsCtrl);

// Update profile photo
userRoutes.put(
  "/profile-photo-upload/",
  protected,
  upload.single("profile"),
  porfilePhotoCtrl
);

// Update cover photo
userRoutes.put(
  "/cover-photo-upload/",
  protected,
  upload.single("cover"),
  coverPhotoCtrl
);

module.exports = userRoutes;
