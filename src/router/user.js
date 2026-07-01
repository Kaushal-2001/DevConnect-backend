const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser.id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender skills about",
    );
    if (connectionRequests.length === 0) {
      throw new Error("No connection requests found");
    }
    res.send(connectionRequests);
  } catch (err) {
    res.status(400).send("Err: " + err.message);
  }
});
module.exports = { userRouter };
