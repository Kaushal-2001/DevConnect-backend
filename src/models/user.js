const mongoose = require("mongoose")
const validator = require("validator")


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    lastName: {
        type: String,
        maxLength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email address invalid: " + value)
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Weak password: " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        trim: true,
        validate(value) {
            if (!["male", "female", "other", "prefer-not-to-say"].includes(value)) {
                throw new Error("Please enter a valid gender data")
            }
        },
        lowercase: true,

    }, 
    skills: {
        type: [String],
    },
    about: {
        type: String,
        default: "Please add the about section",
        trim: true,
    },
    photoUrl: {
        type: String,
        trim: true,
        default: "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid valid url: " + value)
            }
        }
    },
},
 { timestamps: true},)

module.exports = mongoose.model("User", userSchema)
