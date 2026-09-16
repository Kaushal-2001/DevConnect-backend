const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");
const sendEmail = require("../utils/sendEmail")

cron.schedule("00 08 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequests = await connectionRequestModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
        ref: user,
      })
      .populate("fromUserId toUserId");

    const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.email))];
    console.log(listOfEmails);

    for (const email of listOfEmails){
        const res = await sendEmail.run()
      }

  } catch (err) {
    console.log(err);
  }
});
