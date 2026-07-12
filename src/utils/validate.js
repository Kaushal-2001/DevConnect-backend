const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter a valid name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "skills",
    "age",
    "gender",
    "about",
    "photoURL",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_FIELDS.includes(field),
  );
  return isEditAllowed;
};

module.exports = { validateSignupData, validateEditProfileData };
