const express = require("express");
const {connectDB} = require("./config/database")

const app = express();

connectDB().then(() => {
    console.log("DB connection succesfull")
    app.listen(3000, () => {
    console.log("Server is succesfully listening on port 3000")
});
}).catch((err) => {
    console.error("DB connection failed")
})

