const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const authUserToken = (id) => {
  return jwt.sign({ id }, jwt_secret, {
    expiresIn: "7d",
  });
};

//  Register  //
const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    day,
    month,
    year,
    gender,
    city,
    locality,
  } = req.body;

  //day
  const data = new Date();
  const dataDay = String(data.getDate()).padStart(2, "0");
  const dataMonth = String(data.getMonth() + 1).padStart(2, "0");
  const dataYear = data.getFullYear();
  const DateCurrent = `${dataDay} /  ${dataMonth} / ${dataYear}`;

  const userAlreadyRegister = await User.findOne({ email });

  if (userAlreadyRegister) {
    return res
      .status(422)
      .json({ errors: ["Este usuário já se encontra cadastrado."] });
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: passwordHash,
    day,
    month,
    year,
    gender,
    city,
    locality,
    participationDate: DateCurrent,
  });

  if (!newUser) {
    return res.status(422).json({ errors: ["Erro ao cadastrar."] });
  }

  return res.status(200).json({
    msg: "usuário Cadastrado.",
    _id: newUser._id,
    token: authUserToken(newUser._id),
  });
};

//  Login  //
const loginUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (!userExist) {
    return res
      .status(422)
      .json({ errors: ["Este email não se encontra cadastrado."] });
  }

  if (!(await bcrypt.compare(password, userExist.password))) {
    return res.status(422).json({ errors: ["Senha incorreta."] });
  }

  if (await (firstName != userExist.firstName)) {
    return res.status(422).json({ errors: ["Primeiro nome Incorreto."] });
  }

  if (await (lastName != userExist.lastName)) {
    return res.status(422).json({ errors: ["Ultimo nome Incorreto."] });
  }

  return res.status(200).json({
    _id: userExist._id,
    imageProfile: userExist.imageProfile,
    token: authUserToken(userExist._id),
  });
};

//  Profile  //
const profileUser = async (req, res) => {
  const user = req.user;

  return res.status(200).json(user);
};

//  Add Followers  //
const FollowersUser = async (req, res) => {
  try {
    //user Profile
    const { id } = req.params;
    //user Current
    const reqUser = req.user;
    const UserDB = await User.findById(id);
    const UserCurrent = await User.findById(reqUser._id);

    if (!UserDB) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    let found = UserCurrent.followers.find((follower) => follower.userId == id);

    if (found) {
      return res.status(422).json({
        errors: [`vocé Já segue ${UserDB.firstName} ${UserDB.lastName}`],
      });
    }

    const newFollowers = {
      userId: UserDB._id,
      userImage: UserDB.imageProfile,
      userName: UserDB.firstName + " " + UserDB.lastName,
      dateP: UserDB.participationDate,
    };

    await UserCurrent.followers.push(newFollowers);

    await UserCurrent.save();

    return res.status(200).json({
      message: `vocé esta seguindo ${UserDB.firstName} ${UserDB.lastName}`,
    });
  } catch (err) {
    return res.status(422).json({ errors: ["erro ao seguir."] });
  }
};

//  Add Followers  //
const unfollowUser = async (req, res) => {
  try {
    //user Profile
    const { id } = req.params;
    const UserDB = await User.findById(id);
    //user Current
    const reqUser = req.user;
    const UserCurrent = await User.findById(reqUser._id);

    if (!UserDB) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    let found = UserCurrent.followers.find((follower) => follower.userId == id);

    if (!found) {
      return res.status(422).json({
        errors: [`vocé já não segue ${UserDB.firstName} ${UserDB.lastName}`],
      });
    }

    const index = UserCurrent.followers.findIndex((user) => user.userId == id);
    const userFollower = await UserCurrent.followers.splice(index, 1);

    await UserCurrent.save();

    res.status(200).json({
      message: `vocé deixou de seguir ${UserDB.firstName} `,
    });
  } catch (err) {
    return res.status(422).json({ errors: ["erro ao deixar de seguir."] });
  }
};

//  show Followers  //
const showfollowers = async (req, res) => {
  const reqUser = req.user;
  const UserCurrent = await User.findById(reqUser._id);

  const followersUser = UserCurrent.followers;

  return res.status(200).json(followersUser);
};

//  Update User  //
const UpdateUSer = async (req, res) => {
  const { firstName, lastName, password, city, locality } = req.body;

  let imageProfile = null;

  if (req.file) {
    imageProfile = req.file.filename;
  }

  const reqUser = req.user;
  const userDB = await User.findById(reqUser._id).select("-password");

  if (firstName) {
    userDB.firstName = firstName;
  }

  if (lastName) {
    userDB.lastName = lastName;
  }

  if (city) {
    userDB.city = city;
  }

  if (locality) {
    userDB.locality = locality;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    userDB.password = passwordHash;
  }

  if (imageProfile) {
    userDB.imageProfile = imageProfile;
  }

  await userDB.save();

  return res.status(200).json({
    msg: "Usuario Atualizado",
    user: userDB,
  });
};

//  Get User  //
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const UserParams = await User.findById(id).select("-password");

    if (!UserParams) {
      return res.status(404).json({ errors: ["usuario não encontrado."] });
    }

    res.status(200).json(UserParams);
  } catch (err) {
    return res.status(404).json({ errors: ["usuario não encontrado."] });
  }
};

//   All Users   //
const allUsers = async (req, res) => {
  if ((await User.find({})).length > 5) {
    const FristSeven = await User.find({})
      .sort([["createdAt", -1]])
      .limit(7)
      .exec();

    return res.status(200).json(FristSeven);
  }
};

//   Search Users   //
const searchUsers = async (req, res) => {
  const { q } = req.query;

  const searchUsers = await User.find({ firstName: new RegExp(q, "i") }).exec();

  if (searchUsers == "") {
    return res.status(422).json({ errors: ["Sem Resultados."] });
  }

  res.status(200).json(searchUsers);
};

module.exports = {
  registerUser,
  loginUser,
  profileUser,
  FollowersUser,
  unfollowUser,
  showfollowers,
  UpdateUSer,
  getUser,
  allUsers,
  searchUsers,
};
