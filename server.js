require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
require("./config/dbConnect");
const path = require("path");
const Post = require("./model/post/post");
const { truncatePost } = require("./utils/helpers");
const app = express();
// helpers
app.locals.truncatePost = truncatePost;
// middleware
// config ejs
app.set("view engine", "ejs");
// server static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // pass incoming data
app.use(express.urlencoded({ extended: true })); // pass form data

// method override
app.use(methodOverride("_method"));

// Session config
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, //1 day
    }),
  })
);

// save the login user into locals
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

// render homepage
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});

// render login page

// User routes
app.use("/api/v1/users", userRoutes);

// Posts Route

app.use("/api/v1/posts", postRoutes);

// Comments Route

app.use("/api/v1/comments", commentRoutes);

// Error handler middlewares
app.use(globalErrHandler);

//! listen server

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
