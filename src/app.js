const express = require("express");
const { connectDB } = require("./config/database")
const app = express();
const User = require("./models/user");
const user = require("./models/user");
const { validateSignupData } = require("./utils/validate")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/auth")
require("dotenv").config()


app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
    try { 
        validateSignupData(req)
        const { firstName, lastName, email, password } = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName, lastName, email, password: passwordHash
        })
        await user.save() 
        res.send("user added successfully")
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            console.log(token)
            res.cookie("token", token)
            res.send("login succesfull")
        }
        else {
            throw new Error("Invalid credentials")
        }
    }
    catch(err) {
            res.status(400).send("Err: " + err.message)
        }
    
    })

app.get("/user", async (req, res) => {
    const userEmail = req.body.email
    try {
        const users = await User.find({ email: userEmail })
        if (users.length === 0) {
            res.status(404).send("No users found")
        }
        else {
            console.log(`${users.length} users found`)
            res.send(users)
        }
    }
    catch (err) {
        res.send("something went wrong")
    }
})

app.get("/profile", userAuth, async (req, res) => {
    const { user } = req.user
    res.send("reading cookies")
})

app.get("/feed", userAuth, async (req, res) => {
    const allUsers = await User.find({})
    res.send(allUsers)
    console.log(`${allUsers.length} users found`)
})

app.post("/sendconnectionrequest", userAuth, async (req, res) => {
    try { res.send("connection request sent") }
    catch (err) {
        res.status(400).send("Err: " + err.message)
    }
})

app.get("/user", async (req, res) => {
    const userName = req.body.firstName
    console.log(userName)
    try {
        const user = await User.find({ firstName: userName })
        res.send(user)  
    }
    catch (err) {
        res.send("User not found")
    }
})

app.delete("/user", async (req, res) => {
    const userEmail = req.body.email
    try {
        await User.deleteMany({ email: userEmail })
        res.send("User deleted successfully")
    }
    catch (err) {
        res.send("User not deleted")
    }
})

app.patch("/user/:userId", async (req, res) => {
    try {
        const userId = req.params?.userId
        const data = req.body
        const ALLOWED_UPDATES = ["id", "password", "age", "skills", "photoUrl", "about"]
        const isUpdateAllowed = Object.keys(data).every((k) => 
         ALLOWED_UPDATES.includes(k)
        )

        if (data.skills.length > 10) {
            throw new Error("Skills should not exceed 10")
        }

        if (!isUpdateAllowed) {
            throw new Error("update not allowed")
        }
 
        await User.findByIdAndUpdate({ _id : userId }, data, {
            returnDocument: "after",
            runValidators : true,
        },)
        res.send("User updated")
        
    }
    catch (err) {
        res.send("error: " + err.message)
    }
})

connectDB().then(() => {
    console.log("DB connection succesfull")
    app.listen(3000, () => {
    console.log("Server is succesfully listening on port 3000")
});
}).catch((err) => {
    console.error("DB connection failed")
})



