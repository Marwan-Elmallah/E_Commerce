const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required !"],
        unique: [true, "category must be Uniqe"],
        minLength: [3, "too short category name"],
        maxLength: [32, "too long category name"],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Category must be belong to User"]
    },
    image: String
}, { timestamps: true })

categorySchema.pre("find", function () {
    this.populate({ path: "createdBy", select: "username-_id" })
})

const Category = mongoose.model("category", categorySchema)

module.exports = Category