const Joi = require("joi");
const _ = require("lodash");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

UserSchema.methods.generateAuthToken = function() {
  const payload = {
    userId: this._id,
    username: this.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

const User = mongoose.model(
  "User",
  UserSchema
);

function validateUser(user) {
  const schema = Joi.object({
    firstname: Joi.string().min(5).max(50).required(),
    lastname: Joi.string().min(5).max(50).required(),
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
  });

  const userValidationResult = schema.validate(
    _.pick(user, ["firstname", "lastname", "username", "email"])
  );
  const passwordValidationResult = passwordComplexity(
    undefined,
    "Password"
  ).validate(user.password);

  return {userValidationResult, passwordValidationResult};
}


exports.validateUser = validateUser;
exports.User = User;
