const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token not found");
    }

    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedData;
    const user = await User.findById({ _id });

    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Err: " + err.message);
  }
};

module.exports = { userAuth };
