const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const SAFE_USER_DETAILS =
  "firstName SAFE_USER_DETAILS photoUrl age gender skills about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    let limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    limit = Math.min(limit,50)
    const skip = (page - 1) * limit;
    const userConnections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");
    console.log(userConnections);

    const hideUsersFromFeed = new Set();
    userConnections.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    console.log(hideUsersFromFeed);

    const feed = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsersFromFeed) },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(SAFE_USER_DETAILS)
      .skip(skip)
      .limit(limit);

    res.send(feed);
    // userCollections
  } catch (err) {
    res.status(400).send("Err: " + err.message);
  }
});

module.exports = { userRouter };
