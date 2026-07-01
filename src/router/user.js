const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
const SAFE_USER_DETAILS =
  "firstName SAFE_USER_DETAILS photoUrl age gender skills about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser.id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DETAILS);
    if (connectionRequests.length === 0) {
      throw new Error("No connection requests found");
    }
    res.send(connectionRequests);
  } catch (err) {
    res.status(400).send("Err: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allConnections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DETAILS)
      .populate("toUserId", SAFE_USER_DETAILS);
    const data = allConnections.map((user) => {
      if (user.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return user.toUserId;
      } else {
        return user.fromUserId;
      }
    });

    res.json(data);
  } catch (err) {
    res.status(400).send("Err: " + err.message);
  }
});

module.exports = { userRouter };
