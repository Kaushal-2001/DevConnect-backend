const express = require("express");
const { connectDB } = require("./config/database")
const app = express();
const User = require("./models/user");
const user = require("./models/user");


app.use(express.json())

app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save() 
        res.send("user added successfully")
    }
    catch (err) {
        res.status(500).send("something went wrong")
    }
    
    res.send("User sent")
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
        // console.log(user)
        // res.send(user) 
    }
    catch (err) {
        res.send("something went wrong")
    }
})

app.get("/feed", async (req, res) => {
    const allUsers = await User.find({})
    res.send(allUsers)
    console.log(`${allUsers.length} users found`)
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

app.patch("/user", async (req, res) => {
    try{
        const userName = req.body.firstName
        const newAge = req.body.newAge
        await User.updateOne({ firstName: userName }, { age: newAge })
        res.send("User updated")
    }
    catch (err) {
        res.send("User not updated")
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



