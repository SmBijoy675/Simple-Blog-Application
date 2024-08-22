const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
// Register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password, profileImage, coverImage } = req.body;

  // Check if field is empty
  if (!fullname || !email || !password) {
    return res.render("users/register", {
      error: "All fields are required",
    });
  }
  try {
    // if the user already exist(email)
    const userFound = await User.findOne({ email });
    // throw an error
    if (userFound) {
      return res.render("users/register", {
        error: "Email already exist",
      });
    }
    // Hash pass
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    //Register a user
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });

    // for API
    // res.json({
    //   status: "Success",
    //   data: user,
    // });
    // for HTML template redirect
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    res.json(error);
  }
};

// Login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("users/login", {
      error: "Email and password field is required",
    });
  }
  try {
    //Check if email exist
    const userFound = await User.findOne({ email });
    if (!userFound) {
      //throw an error
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    //verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      //throw an error
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    // Save the user into the session
    req.session.userAuth = userFound._id;

    res.redirect("/api/v1/users/profile");
  } catch (error) {
    next(appErr(error.message));
  }
};

// Get single user details
const userDetailsCtrl = async (req, res) => {
  try {
    // Get user id from params
    const userId = req.params.id;
    // find the user
    const user = await User.findById(userId);
    res.render("users/updateUser", {
      user,
      error: "",
    });
  } catch (error) {
    res.json(error);
  }
};

// Profile
const profileCtrl = async (req, res) => {
  try {
    // get the login user
    const userID = req.session.userAuth;
    // find the user
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comment");
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};

// Upload profile photo
const porfilePhotoCtrl = async (req, res, next) => {
  try {
    // check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please provide image",
      });
    }
    // Find the user to be upload
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // check is user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    // upadte user profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    // redirect
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

// Upload cover photo
const coverPhotoCtrl = async (req, res, next) => {
  try {
    // check if file exist
    if (!req.file) {
      return res.render("users/uploadCoverPhoto", {
        error: "Please provide image",
      });
    }
    // find the user to upload
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.render("users/uploadCoverPhoto", {
        error: "User no found",
      });
    }
    await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    // redirect
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};

// Update password
const passwordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    if (!password) {
      return res.render("users/updatePassword", {
        error: "Please provide new password",
      });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      // update user
      await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      res.redirect("/api/v1/users/profile");
    }
  } catch (error) {
    return res.render("users/updatePassword", {
      error: error.message,
    });
  }
};

// update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    // check if the fields are filled
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "Please provide details",
        user: "",
      });
    }
    // chcek if the email is taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.render("users/updateUser", {
          error: "Email already exist",
          user: "",
        });
      }
    }
    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/updateUser", {
      error: error.message,
      user: "",
    });
  }
};

// Logout
const logoutCtrl = async (req, res) => {
  try {
    // destory session
    req.session.destroy(() => {
      res.redirect("/api/v1/users/login");
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  porfilePhotoCtrl,
  coverPhotoCtrl,
  passwordCtrl,
  logoutCtrl,
  updateUserCtrl,
};
