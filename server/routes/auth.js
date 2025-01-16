const { User, validateUser } = require("../models/User");
const _ = require("lodash");
const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { userValidationResult, passwordValidationResult } = validateUser(
    req.body
  );

  const error = userValidationResult.error || passwordValidationResult.error;
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ messsage: "User already exists !" });
    }

    user = new User(
      _.pick(req.body, [
        "firstname",
        "lastname",
        "username",
        "email",
        "password",
      ])
    );
    const salt = (await bcrypt.genSalt()).toString();
    user.password = (await bcrypt.hash(user.password, salt)).toString();
    console.log(user.password);
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
