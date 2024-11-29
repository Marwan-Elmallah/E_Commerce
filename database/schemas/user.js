const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../../config");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is Required !"],
        unique: [true, "username must be Uniqe"],
        minLength: [4, "too short username"],
        maxLength: [32, "too long username"],
        trim: true,
        lowercase: true
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: [true, "email is Required !"],
        trim: true,
        unique: [true, "email must be Uniqe"],
    },
    password: {
        type: String,
        required: [true, "password is Required !"]
    },
    ev: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["client", "company"],
        required: true
    },
    phone: String
}, { timestamps: true })


userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const hash = bcrypt.hashSync(this.password, saltRounds)
    this.password = hash
    next()
})

module.exports = mongoose.model("user", userSchema)