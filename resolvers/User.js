const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../models/User");

exports.users = async function () {
  const allUsers = await User.find();
  return allUsers;
};

exports.user = async function (_, args) {
  const { id } = args;
  const user = await User.find({ _id: id });
  return user[0];
};

exports.signup = async function (_, args) {
  try {
    const { username, email, password } = args.user;
    const hashedPassword = await bcrypt.hash(password, 16);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    return {
      user: savedUser,
      token: "hellothere",
    };
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      throw new UserInputError("Email already registered");
    }
  }
};

exports.login = async function (_, args) {
  try {
    const { email, password } = args.user;
    const user = await User.find({ email: email });
    if (!user[0]) {
      throw new UserInputError("Invalid username or password");
    }
    const result = await bcrypt.compare(password, user[0].password);
    if (!result) {
      throw new UserInputError("Invalid username or password");
    }
    return {
      user: user[0],
      token: "8123jfj029",
    };
  } catch (err) {
    return err;
  }
};