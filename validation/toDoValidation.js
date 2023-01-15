const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateTodoInput = (data) => {
  let errors = {};
  //verify content
  if (isEmpty(data.content)) {
    errors.content = "Todo can't be empty";
  } else if (!Validator.isLength(data.content, { min: 2, max: 300 })) {
    errors.content = "Todo length must be between 2 and 30-";
  }
  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateTodoInput;
