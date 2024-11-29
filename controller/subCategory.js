const { default: slugify } = require("slugify")
const { SubCategory, Category } = require("../database/schemas")
const ApiError = require("../utils/apiErrors")
const { findOneFactory, deleteOneFactory, findAllFactory } = require("./handlerFactory")



class subCategoryController {
    static findAll = findAllFactory(SubCategory)


    static findById = findOneFactory(SubCategory)


    static findAllByOneCategory = async (req, res, next) => {
        const { categoryId } = req.params
        const { page = 1, limit = 5 } = req.query * 1
        const skip = (page - 1) * limit
        const data = await SubCategory.find({ category: categoryId }).skip(skip).limit(limit)
        if (!data) {
            return next(new ApiError("subCategory Not Found", 404))
        }
        return res.json({
            count: data.length,
            page,
            data
        })
    }

    static create = async (req, res, next) => {
        try {
            let dataInBody = req.body
            dataInBody.createdBy = req.userId
            const categoryExist = await Category.findById(dataInBody.category)
            if (!categoryExist) {
                return res.status(404).json({ msg: `No Category Found With ID ${dataInBody.category}` })
            }
            dataInBody.slug = slugify(dataInBody.name)
            const subCategory = await SubCategory.create(dataInBody)
            if (!subCategory) {
                return res.status(401).json({ msg: "Sub Category not Created" })
            }
            return res.status(400).json({
                data: subCategory
            })
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static update = async (req, res, next) => {
        try {
            const { id } = req.params
            const dataInBody = req.body
            dataInBody.name ? dataInBody.slug = dataInBody.name : null
            if (dataInBody.category) {
                const categoryExist = await Category.findById(dataInBody.category)
                if (!categoryExist) {
                    return res.status(404).json({ msg: `No Category Found wit ID ${dataInBody.category}` })
                }
            }
            const subCateg = await SubCategory.findByIdAndUpdate(id)
            if (!subCateg) {
                return res.status(401).json({ msg: `No Sub Category Found With ID ${id}` })
            }
            if (req.userId != subCateg.createdBy) {
                return res.status(401).json({ msg: "You Are Not Allowed To Update This Document" })
            }
            await subCateg.updateOne(dataInBody, { new: true })
            return res.status(201).json({ data: subCateg })
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static remove = deleteOneFactory(SubCategory)
}

module.exports = subCategoryController