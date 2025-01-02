const express = require("express");
const router = express.Router();

//Middlewares
const ErrorsValidate = require("../middlewares/ErrorsValidate");
const AuthGuard = require("../middlewares/AuthGuard");
const UploadsImage = require("../middlewares/UploadImage");
const {
  registerValidate,
  loginValidate,
  UpdateValidate,
} = require("../middlewares/UserValidate");
//Controllers
const {
  registerUser,
  loginUser,
  profileUser,
  FollowersUser,
  unfollowUser,
  UpdateUSer,
  showfollowers,
  getUser,
  allUsers,
  searchUsers,
} = require("../controllers/UserController");

//  register
router.post("/register", registerValidate(), ErrorsValidate, registerUser);
//  login
router.post("/login", loginValidate(), ErrorsValidate, loginUser);
//  profile
router.get("/profile", AuthGuard, profileUser);
//  Add Follower
router.put("/profile/add/:id", AuthGuard, FollowersUser);
//  unfollow
router.put("/profile/remove/:id", AuthGuard, unfollowUser);
//  Update
router.put(
  "/Update",
  AuthGuard,
  UploadsImage.single("imageProfile"),
  UpdateValidate(),
  ErrorsValidate,
  UpdateUSer
);
//Search Users
router.get("/search/users", AuthGuard, searchUsers);
//Show followers
router.get("/showfollowers", AuthGuard, showfollowers);
// All User
router.get("/show", allUsers);
// getUser
router.get("/:id", AuthGuard, getUser);

module.exports = router;
