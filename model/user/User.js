const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    role: {
      type: String,
      default: "Blogger",
    },
    bio: {
      type: String,
      default:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum adipisci eligendi nobis itaque ex? Veniam tempore itaque cumque fugiat iusto voluptatibus odit inventore dolorem numquam maxime, repellendus labore corrupti expedita?",
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);
// Commpile schema to form a model

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
