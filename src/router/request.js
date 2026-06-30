const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/request/sendconnectionrequest/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      ALLOWED_STATUS = ["interested", "ignore"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid Status");
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw new Error("User does not exist");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found");
      }

      const requestAlreadyExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (requestAlreadyExists) {
        throw new Error("Request already exists");
      }

      const connectionrequest = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const conncetionRequestData = await connectionrequest.save();
      res.json(conncetionRequestData);
    } catch (err) {
      res.status(400).send("Err: " + err.message);
    }
  },
);

module.exports = { requestRouter };
