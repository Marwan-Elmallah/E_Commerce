const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required !"],
        unique: [true, "subCategory must be Uniqe"],
        minLength: [2, "too short subCategory name"],
        maxLength: [32, "too long subCategory name"],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "subCategory must be belong to category"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Sub Category must be belong to User"]
    },
}, { timestamps: true })

subCategorySchema.pre("find", function () {
    this.populate({ path: "category", select: "name-_id" })
    this.populate({ path: "createdBy", select: "username-_id" })
})

const SubCategory = mongoose.model("subCategory", subCategorySchema)

module.exports = SubCategory