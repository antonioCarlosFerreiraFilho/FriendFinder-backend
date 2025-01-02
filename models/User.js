const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    imageProfile: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    day: String,
    month: String,
    year: String,
    gender: String,
    city: String,
    locality: String,
    participationDate: String,
    followers: Array,
    following: Array,
    banned: Boolean,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;