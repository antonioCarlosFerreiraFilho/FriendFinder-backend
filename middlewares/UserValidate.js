const { body } = require("express-validator");

// REGISTER
const registerValidate = () => {
  return [
    body("firstName")
      .isString()
      .withMessage("O Primeiro nome e obrigatório")
      .isLength({ min: 4 })
      .withMessage("O Primeiro nome deve conter no minimo 4 Caracteres.")
      .isLength({ max: 8 })
      .withMessage("O Primeiro nome deve conter no maximo 8 Caracteres."),
    body("lastName")
      .isString()
      .withMessage("O Ultimo nome e obrigatorio")
      .isLength({ min: 4 })
      .withMessage("O Ultimo nome deve conter no minimo 4 Caracteres.")
      .isLength({ max: 8 })
      .withMessage("O Ultimo nome deve conter no maximo 8 Caracteres."),
    body("email")
      .isString()
      .withMessage("O email/gmail e obrigatório.")
      .isEmail()
      .withMessage("Insira um email/gmail valido."),
    body("password")
      .isString()
      .withMessage("A senha e obrigatória.")
      .isLength({ min: 6 })
      .withMessage("A senha deve conter um minimo 6 Caracteres."),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação da senha e obrigatória.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas devem ser iguais.");
        }

        return true;
      }),
    body("day").isString().withMessage("O dia de nascimento e obrigatório."),
    body("month").isString().withMessage("O Mes de nascimento e obrigatório"),
    body("year").isString().withMessage("O Ano de nascimento e obrigatório"),
    body("gender").isString().withMessage("O Genero e obrigatório"),
    body("city")
      .optional()
      .isString()
      .withMessage("A cidade e obrigatória")
      .isLength({ min: 4 })
      .withMessage("A cidade deve conter no minimo 4 Caracteres.")
      .isLength({ max: 10 })
      .withMessage("A cidade deve conter no maximo 10 Caracteres."),
    body("locality")
      .optional()
      .isString()
      .withMessage("A Localidade e obrigatória")
      .isLength({ min: 4 })
      .withMessage("A Localidade deve conter no minimo 4 Caracteres.")
      .isLength({ max: 10 })
      .withMessage("A Localidade deve conter no maximo 10 Caracteres."),
  ];
};

// LOGIN
const loginValidate = () => {
  return [
    body("firstName").isString().withMessage("O Primeiro nome e obrigatorio."),
    body("lastName").isString().withMessage("O Ultimo nome e obrigatorio."),
    body("email")
      .isString()
      .withMessage("O email/gmail e obrigatorio.")
      .isEmail()
      .withMessage("Insira um email valido."),
    body("password").isString().withMessage("A senha e obrigatoria."),
  ];
};

// UPDATE
const UpdateValidate = () => {
  return [
    body("firstName")
      .optional()
      .isString()
      .withMessage("O Primeiro nome e obrigatorio.")
      .isLength({ min: 4 })
      .withMessage("O Primeiro nome deve conter no minimo 4 Caracteres.")
      .isLength({ max: 8 })
      .withMessage("O Primeiro nome deve conter no maximo 8 Caracteres."),
    body("lastName")
      .optional()
      .isString()
      .withMessage("O Ultimo nome e obrigatorio.")
      .isLength({ min: 4 })
      .withMessage("O Ultimo nome deve conter no minimo 4 Caracteres.")
      .isLength({ max: 8 })
      .withMessage("O Ultimo nome deve conter no maximo 8 Caracteres."),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("A senha deve conter um minimo 6 Caracteres.")
      .isLength({ max: 10 })
      .withMessage("A senha deve conter um maximo 10 Caracteres."),
    body("city")
      .optional()
      .isString()
      .withMessage("A cidade e obrigatória")
      .isLength({ min: 4 })
      .withMessage("A cidade deve conter no minimo 4 Caracteres.")
      .isLength({ max: 10 })
      .withMessage("A cidade deve conter no maximo 10 Caracteres."),
    body("locality")
      .optional()
      .isString()
      .withMessage("A Localidade e obrigatória")
      .isLength({ min: 4 })
      .withMessage("A Localidade deve conter no minimo 4 Caracteres.")
      .isLength({ max: 10 })
      .withMessage("A Localidade deve conter no maximo 10 Caracteres."),
  ];
};

module.exports = {
  registerValidate,
  loginValidate,
  UpdateValidate,
};
