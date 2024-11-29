const { default: slugify } = require("slugify")
const dbConnection = require("../database/connection")
const { Product, Category, SubCategory, Brand } = require("../database/schemas")
const { faker } = require("@faker-js/faker")
require("dotenv").config({ path: "../.env" })

dbConnection()
const insertCategory = async (count) => {
    let data;
    for (let i = 0; i < count; i++) {
        const name = faker.commerce.productAdjective()
        data = await Category.create({ name, slug: slugify(name) })
        console.log(`${i + 1} Category ${name} Added`)
    }
    return data
    // process.exit(1)
}

const insertBrand = async (count) => {
    let data;
    for (let i = 0; i < count; i++) {
        const name = faker.commerce.department()
        data = await Brand.create({ name, slug: slugify(name) })
        console.log(`${i + 1} Brand ${name} Added`)
    };
    return data
    // process.exit(1)
}

const insertSubCateg = async (count, category) => {
    let data;
    for (let i = 0; i < count; i++) {
        const name = faker.commerce.product()
        data = await SubCategory.create({ name, category, slug: slugify(name) })
        console.log(`${i + 1} SubCategory for ${category} is Added`)
    }
    // return data
    process.exit(1)
}

const insertProduct = async (count, category, subCategory, brand) => {
    let data;
    for (let i = 0; i < count; i++) {
        const title = faker.commerce.productName()
        const price = faker.commerce.price({ min: 10000, max: 90000 })
        const priceAfterDiscount = price - 10
        const description = faker.commerce.productDescription()
        const quantity = faker.number.int({ min: 1, max: 100 })
        const averageRating = faker.finance.amount({ min: 1, max: 5 })
        if (category) {
            const categoryExist = await Category.findById(category)
            if (!categoryExist) {
                return next(new ApiError(`No Category Found For ID : ${category}`, 404))
            }
            if (brand) {
                const brandExist = Brand.findById(brand)
                if (!brandExist) {
                    return next(new ApiError(`No Brand Found For ID: ${s}`, 404))
                }
            }
            // subCategory = JSON.parse(subCategory)
            if (subCategory && subCategory.length > 0) {
                subCategory.map(async (s) => {
                    const subCategExist = await SubCategory.findById(s)
                    if (!subCategExist || subCategExist.category.toString() !== category) {
                        console.log(subCategExist.category.toString(), category);
                        return next(new ApiError(`No SubCategory Found For ID: ${s}`, 404))
                    }
                })
            }
        }
        data = await Product.create({ title, price, priceAfterDiscount, description, category, subCategory, brand, quantity, slug: slugify(title), averageRating })
        console.log(`${i + 1} Product is Added`)
        if (!data) {
            console.error("Error to create product")
            return next(new ApiError("Product Not Created", 404))
        }
    }
    // return data
    process.exit(1)
}


switch (process.argv[2]) {
    case "categ":
        insertCategory(process.argv[3] * 1)
        break;
    case "brand":
        insertBrand(process.argv[3] * 1)
        break;
    case "sub":
        insertSubCateg(process.argv[3] * 1, process.argv[4])
        break;
    case "product":
        insertProduct(process.argv[3] * 1, process.argv[4], process.argv[5], process.argv[6])
        break;
    default:
        console.error("Wrong input")
}