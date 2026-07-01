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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const ALLOWED_STATUS = ["accepted", "rejected"];
      const isStatusAllowed = ALLOWED_STATUS.includes(status);
      if (!isStatusAllowed) {
        throw new Error("Invalid status");
      }
      const request = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser.id,
      });

      if (!request) {
        throw new Error("Request not found");
      }

      request.status = status;
      await request.save();
      res.send(`The request has been ${status}`);
    } catch (err) {
      res.status(400).send("Err: " + err.message);
    }
  },
);

module.exports = { requestRouter };
