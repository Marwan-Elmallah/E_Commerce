const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "name is Required !"],
        unique: [true, "product must be Uniqe"],
        minLength: [3, "too short product name"],
        maxLength: [32, "too long product name"],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "product must be belong to category"]
    },
    subCategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
        required: [true, "product must be belong to subCategory"]
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "product must be belong to user"]
    },
    description: {
        type: String,
        minLength: [20, "too short description"],
        maxLength: [2000, "too long description"],
        trim: true
    },
    quantity: {
        type: Number,
        min: [0, "quantity can't be negative"],
        required: [true, "quantity is Required !"]
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        min: [0, "price can't be negative"]
    },
    priceAfterDiscount: {
        type: Number,
        min: [0, "priceAfterDiscount can't be negative"]
    },
    colors: [String],
    averageRating: {
        type: Number,
        min: [1, "averageRating must be over of equal 1"],
        max: [5, "averageRating must be under of equal 5"],
    },
    ratingsQty: {
        type: Number,
        default: 0
    },
    images: [String]
}, { timestamps: true })


productSchema.pre("find", function () {
    this.populate({ path: "category", select: "name-_id" })
    this.populate({ path: "subCategory", select: "name-_id" })
    this.populate({ path: "brand", select: "name-_id" })
    this.populate({ path: "createdBy", select: "username-_id" })
})


const Product = mongoose.model("product", productSchema)

module.exports = Product