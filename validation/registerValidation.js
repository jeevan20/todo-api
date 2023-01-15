const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
  const errors = {};
  // verify email
  if (isEmpty(data.email)) {
    errors.email = "Email field can't be empty";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is Invalid";
  }
  //verify name
  if (isEmpty(data.name)) {
    errors.name = "Name can't be empty";
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name length must be between 2 and 30";
  }
  //verify password
  if (isEmpty(data.password)) {
    errors.password = "Password can't be empty";
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = "Password length must be between 6 and 150";
  }
  // verify conform password
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password can't be empty";
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Password and Confirm Password must match";
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateRegisterInput;
