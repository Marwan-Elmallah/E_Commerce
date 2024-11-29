const { default: slugify } = require("slugify")
const { Product, User, Category, SubCategory, Brand } = require("../database/schemas")
const { deleteOneFactory, findOneFactory, findAllFactory } = require("./handlerFactory")
const ApiError = require("../utils/apiErrors")



class ProductController {
    static findAll = findAllFactory(Product)

    static findById = findOneFactory(Product)

    static create = async (req, res, next) => {
        try {
            let dataInBody = req.body;
            dataInBody.createdBy = req.userId;
            dataInBody.slug = slugify(dataInBody.title);

            // Check if the user exists
            const userExist = await User.findById(req.userId);
            if (!userExist) {
                return res.status(404).json({ msg: `No User Found For ID: ${req.userId}` });
            }

            // Check if the category exists
            const categoryExist = await Category.findById(dataInBody.category);
            if (!categoryExist) {
                return res.status(404).json({ msg: `No Category Found For ID: ${dataInBody.category}` });
            }

            // Check if each subcategory exists and belongs to the correct category
            if (dataInBody.subCategory) {
                for (const item of dataInBody.subCategory) {
                    const subCategoryExist = await SubCategory.findById(item);
                    if (!subCategoryExist) {
                        return res.status(404).json({ msg: `No SubCategory Found For ID: ${item}` });
                    }
                    if (dataInBody.category != subCategoryExist.category) {
                        return res.status(400).json({ msg: `SubCategory of ID: ${item} does not belong to Category ID: ${dataInBody.category}` });
                    }
                }
            }

            // Create the product
            const product = await Product.create(dataInBody);
            if (!product) {
                return res.status(400).json({ msg: "Product Not Created" });
            }

            return res.status(201).json({ data: product });
        } catch (error) {
            console.log(error);
            return next(new ApiError("Error Creating Product", 500));
        }
    }


    static update = async (req, res, next) => {
        try {
            const { id } = req.params
            const dataInBody = req.body
            dataInBody.title ? dataInBody.slug = slugify(dataInBody.title) : null
            const product = await Product.findById(id)
            if (!product) {
                return res.status(401).json({ msg: `No Product Found For ID : ${id}` })
            }
            // console.log(req.userId, product.createdBy);
            if (req.userId != product.createdBy) {
                return res.status(401).json({ msg: "You Are Not Allowed To Update This product" })
            }
            if (dataInBody.category) {
                const categoryExist = await Category.findById(dataInBody.category)
                if (!categoryExist) {
                    return next(new ApiError("Category Not Found", 404))
                }
            }
            if (dataInBody.subCategory && dataInBody.subCategory.length > 0) {
                dataInBody.subCategory.map(async (s) => {
                    let subCategExist = await SubCategory.findById(s)
                    if (subCategExist || subCategExist.category != dataInBody.category) {
                        return res.status(401).json({ messsage: `sub category ID ${s} is not belong to current category` })
                    }
                })
            }
            if (dataInBody.brand) {
                let brand = await Brand.findById(dataInBody.brand)
                if (!brand) {
                    return res.status(401).json({ msg: `No brand found with ID ${dataInBody.brand}` })
                }
            }
            await product.updateOne(dataInBody, { new: true })
            return res.status(201).json(product)
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static remove = deleteOneFactory(Product)
}

module.exports = ProductController