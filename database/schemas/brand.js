const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required !"],
        unique: [true, "brand must be Uniqe"],
        minLength: [3, "too short brand name"],
        maxLength: [32, "too long brand name"],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "brand must be belong to User"]
    },
    image: String
}, { timestamps: true })

brandSchema.pre("find", function () {
    this.populate({ path: "createdBy", select: "username-_id" })
})

const Brand = mongoose.model("brand", brandSchema)

module.exports = Brand