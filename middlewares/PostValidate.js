const { body } = require("express-validator");

const postValidate = () => {
  return [
    body("title")
      .not()
      .equals()
      .withMessage("O titulo e obrigatório.")
      .isString()
      .withMessage("O titulo e obrigatório.")
      .isLength({ min: 4 })
      .withMessage("O titulo deve conter no minimo 4 caracteres.")
      .isLength({ max: 28 })
      .withMessage("O titulo deve conter no maximo 28 caracteres."),
    body("description")
      .isString()
      .withMessage("a descriçao e obrigatorio.")
      .isLength({ min: 10 })
      .withMessage("A descrição deve conter no minimo 10 caracteres.")
      .isLength({ max: 300 })
      .withMessage("A descrição deve conter no maximo 300 caracteres."),
    body("imagePost")
      .custom((value, { req }) => {
        if (!req.file) {
          throw new Error("A imagem e obrigatoria.");
        }

        return true;
      })
      .custom((value, { req }) => {
        if (req.file.mimetype != "jpg") {
          return ".jpg"; // return "non-falsy" value to indicate valid data"
        } else {
          return false; // return "falsy" value to indicate invalid data
        }
      })
      .withMessage("Somente Imagens com o formato JPG"),
  ];
};

const postUpdateValidate = () => {
  return [
    body("title")
      .not()
      .equals()
      .withMessage("O titulo e obrigatório.")
      .isString()
      .withMessage("O titulo e obrigatório.")
      .isLength({ min: 4 })
      .withMessage("O titulo deve conter no minimo 4 caracteres.")
      .isLength({ max: 28 })
      .withMessage("O titulo deve conter no maximo 28 caracteres."),
    body("description")
      .isString()
      .withMessage("a descriçao e obrigatório.")
      .isLength({ min: 10 })
      .withMessage("A descrição deve conter no minimo 10 caracteres.")
      .isLength({ max: 300 })
      .withMessage("A descrição deve conter no maximo 300 caracteres."),
  ];
};

const commentsValidade = () => {
  return [
    body("comments")
      .isString()
      .withMessage("o comentario e obrigatório")
      .isLength({ min: 5 })
      .withMessage("o comentario deve conter no minimo 5 caracteres")
      .isLength({ max: 300 })
      .withMessage("o comentario deve conter no maximo 300 caracteres"),
  ];
};

module.exports = {
  postValidate,
  postUpdateValidate,
  commentsValidade,
};
