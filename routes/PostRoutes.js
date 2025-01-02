const express = require("express");
const router = express.Router();

//Middlewares
const ErrorsValidate = require("../middlewares/ErrorsValidate");
const AuthGuard = require("../middlewares/AuthGuard");
const UploadsImage = require("../middlewares/UploadImage");
const {
  postValidate,
  postUpdateValidate,
  commentsValidade,
} = require("../middlewares/PostValidate");

//controllers
const {
  post,
  UpdatePost,
  deletPost,
  likePositive,
  likeNegative,
  getPost,
  getUserPosts,
  commentsPost,
  searchPosts,
  allPosts,
} = require("../controllers/PostController");

//Post
router.post(
  "/publishPhoto",
  AuthGuard,
  UploadsImage.single("imagePost"),
  postValidate(),
  ErrorsValidate,
  post
);
//Update
router.put(
  "/update/:id",
  AuthGuard,
  postUpdateValidate(),
  ErrorsValidate,
  UpdatePost
);
//Delet
router.delete("/delete/:id", AuthGuard, deletPost);
//like Positive
router.put("/likePositive/:id", AuthGuard, likePositive);
//like Negative
router.put("/likeNegative/:id", AuthGuard, likeNegative);
//Get
router.get("/getPost/:id", getPost);
//User posts
router.get("/posts/:id", AuthGuard, getUserPosts);
//Comments
router.put(
  "/comments/:id",
  AuthGuard,
  commentsValidade(),
  ErrorsValidate,
  commentsPost
);
//Search Post
router.get("/search", searchPosts);
//Shouw Posts
router.get("/", allPosts);

module.exports = router;
