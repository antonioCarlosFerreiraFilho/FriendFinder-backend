const mongoose = require("mongoose");
const {Schema} = mongoose;

const PostSchema = new Schema(
  {
    imagePost: String,
    userImage: String,
    userName: String,
    userId: mongoose.ObjectId,
    dataPost: String,
    likePositive: Array,
    likeNegative: Array,
    title: String,
    description: String,
    comments: Array,
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;