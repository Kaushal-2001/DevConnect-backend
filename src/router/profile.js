const express = require("express")
const { userAuth } = require("../middlewares/auth")
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validate")

const profileRouter = express.Router()

profileRouter.get("/profile", userAuth, async (req, res) => {
    const loggedInUser  = req.user
    res.send(loggedInUser)
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try { 
        if (!validateEditProfileData(req)) {
            throw new Error("Please enter valid data")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        await loggedInUser.save()
        res.send("User updated")
    }
    catch (err) {
        res.send("error: " + err.message)
    }
})

profileRouter.delete("/user", async (req, res) => {
    const userEmail = req.body.email
    try {
        await User.deleteMany({ email: userEmail })
        res.send("User deleted successfully")
    }
    catch (err) {
        res.send("User not deleted")
    }
})



module.exports = { profileRouter }
