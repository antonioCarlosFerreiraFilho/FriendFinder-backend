const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require("mongoose");

//   Post   //
const post = async (req, res) => {
  const { title, description } = req.body;
  const imagePost = req.file.filename;

  //day
  const data = new Date();
  const dataDay = String(data.getDate()).padStart(2, "0");
  const dataMonth = String(data.getMonth() + 1).padStart(2, "0");
  const dataYear = data.getFullYear();
  const fullData = `${dataDay} /  ${dataMonth} / ${dataYear}`;

  const reqUser = await req.user;

  const UserCurrent = await User.findById(reqUser._id);

  const newPost = await Post.create({
    imagePost,
    title,
    description,
    userImage: UserCurrent.imageProfile,
    userName: UserCurrent.firstName + " " + UserCurrent.lastName,
    userId: UserCurrent._id,
    dataPost: fullData,
  });

  if (!newPost) {
    return res.status(422).json({
      errors: ["erro ao postar, favor tente novamente mais tarde."],
    });
  }

  return res.status(201).json(newPost);
};

//   Update Post   //
const UpdatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const reqUser = await req.user;
    const PostDB = await Post.findById(id);

    if (!PostDB) {
      return res.status(404).json({ errors: ["Postagem não encontrada"] });
    }

    if (!PostDB.userId.equals(reqUser._id)) {
      return res.status(422).json({ errors: ["Você não tem o direito."] });
    }

    if (title) {
      PostDB.title = title;
    }

    if (description) {
      PostDB.description = description;
    }

    await PostDB.save();

    res.status(200).json({
      PostDB,
      message: "Postagem atualizada",
    });
  } catch (err) {
    return res.status(404).json({ errors: ["Postagem não encontradaa"] });
  }
};

//   Delet Post   //
const deletPost = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const PostDB = await Post.findById(new mongoose.Types.ObjectId(id));

    if (!PostDB) {
      return res.status(404).json({ errors: ["Postagem não encontrada"] });
    }

    if (!PostDB.userId.equals(reqUser._id)) {
      return res.status(422).json({ errors: ["Você não tem o direito."] });
    }

    await Post.findByIdAndDelete(PostDB._id);

    res.status(200).json({
      id: PostDB._id,
      message: "Postagem excluida",
    });
  } catch (err) {
    return res.status(422).json({ errors: ["tente novamente mais tarde."] });
  }
};

//   like Positive  //
const likePositive = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const PostLike = await Post.findById(id);
    const idUserCurrent = reqUser._id;

    if (!PostLike) {
      return res.status(404).json({ errors: ["Postagem não encontrada."] });
    }

    //Comparando o id likes com idUser
    let indexLikesNegative = PostLike.likeNegative.find(
      (idUsers) => idUsers.idUser == idUserCurrent
    );

    if (indexLikesNegative) {
      const indexRemove = PostLike.likeNegative.findIndex(
        (indexNe) => indexNe.idUser == idUserCurrent
      );
      const userRemoveId = await PostLike.likeNegative.splice(indexRemove, 1);
    }

    //Comparando o id likes com idUser
    const indexLike = PostLike.likePositive.length;
    let indexLikes = PostLike.likePositive.find(
      (idUsers) => idUsers.idUser == idUserCurrent
    );

    if (indexLikes) {
      return res.status(404).json({ errors: ["você já curtiu esté post"] });
    }

    if (!indexLikes) {
      const newLike = {
        idUser: idUserCurrent.toString(),
        id: indexLike + 1,
      };

      await PostLike.likePositive.push(newLike);

      await PostLike.save();

      res.status(200).json({
        newLike: newLike,
        message: "o post foi curtido",
      });
    }
  } catch (err) {
    return res.status(404).json({ errors: ["Postagem não encontrada."] });
  }
};

//   like Negative  //
const likeNegative = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const PostLike = await Post.findById(id);
    const idUserCurrent = reqUser._id;

    if (!PostLike) {
      return res.status(404).json({ errors: ["Postagem não encontrada."] });
    }

    //Remove id User Like Positive
    let indexLikesPositive = PostLike.likePositive.find(
      (idUsers) => idUsers.idUser == idUserCurrent
    );

    if (indexLikesPositive) {
      const indexRemove = PostLike.likePositive.findIndex(
        (indexNe) => indexNe.idUser == idUserCurrent
      );
      const userRemoveId = await PostLike.likePositive.splice(indexRemove, 1);
    }

    //Add id Like Negative
    const indexLike = PostLike.likeNegative.length;
    let indexLikes = PostLike.likeNegative.find(
      (idUsers) => idUsers.idUser == idUserCurrent
    );

    if (indexLikes) {
      return res.status(404).json({ errors: ["você não curtiu desté post"] });
    }

    if (!indexLikes) {
      const newLike = {
        idUser: idUserCurrent.toString(),
        id: indexLike + 1,
      };

      await PostLike.likeNegative.push(newLike);

      await PostLike.save();

      res.status(200).json({
        newLike: newLike,
        message: "voce não gostou desté post",
      });
    }
  } catch (err) {
    return res.status(404).json({ errors: ["Postagem não encontrada."] });
  }
};

//   Get Post   //
const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const PostDB = await Post.findById(id);

    if (!PostDB) {
      return res.status(404).json({ errors: ["Postagem não encontrada."] });
    }

    res.status(200).json(PostDB);
  } catch (err) {
    return res.status(404).json({ errors: ["Postagem não encontrada."] });
  }
};

//   Get User Posts   //
const getUserPosts = async (req, res) => {
  const { id } = req.params;

  try {
    const PostsDBuser = await Post.find({ userId: id })
      .sort([["createdAt", -1]])
      .exec();

    res.status(200).json(PostsDBuser);
  } catch (err) {
    return res.status(404).json({ errors: ["id User não encontrado"] });
  }
};

//   comments Post   //
const commentsPost = async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  const reqUser = req.user;

  try {
    //day
    const data = new Date();
    const dataDay = String(data.getDate()).padStart(2, "0");
    const dataMonth = String(data.getMonth() + 1).padStart(2, "0");
    const dataYear = data.getFullYear();
    const dataComment = `${dataDay} /  ${dataMonth} / ${dataYear}`;

    const UserCurrent = await User.findById(reqUser._id);
    const PostDB = await Post.findById(id);

    if (!PostDB) {
      return res.status(404).json({ errors: ["Postagem não encontrada."] });
    }

    const commentsPost = PostDB.comments.length;

    const newComments = {
      userImage: UserCurrent.imageProfile,
      userName: UserCurrent.firstName + " " + UserCurrent.lastName,
      userId: UserCurrent._id,
      dataComment,
      idComment: commentsPost + 1,
      comments,
    };

    await PostDB.comments.push(newComments);

    await PostDB.save();

    res.status(200).json({
      comments: newComments,
      message: "comentário Publicado",
    });
  } catch (err) {
    return res.status(404).json({ errors: ["Postagem não encontrada."] });
  }
};

//   All Posts   //
const allPosts = async (req, res) => {
  const AllPosts = await Post.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(AllPosts);
};

//   Search Posts   //
const searchPosts = async (req, res) => {
  const { q } = req.query;

  const SearchPost = await Post.find({ title: new RegExp(q, "i") }).exec();

  if (SearchPost == "") {
    return res.status(404).json({ errors: ["Sem Resultados."] });
  }

  res.status(200).json(SearchPost);
};

module.exports = {
  post,
  UpdatePost,
  deletPost,
  likePositive,
  likeNegative,
  getPost,
  getUserPosts,
  commentsPost,
  allPosts,
  searchPosts,
};
