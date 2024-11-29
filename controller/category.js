const { default: slugify } = require("slugify")
const { Category } = require("../database/schemas")
const { findOneFactory, deleteOneFactory, findAllFactory } = require("./handlerFactory")
const ApiError = require("../utils/apiErrors")




class CategoryController {
    static findAll = findAllFactory(Category)


    static findById = findOneFactory(Category)

    static create = async (req, res, next) => {
        try {
            const dataInBody = req.body
            dataInBody.createdBy = req.userId
            dataInBody.slug = slugify(dataInBody.name)
            const document = await Category.create(dataInBody)
            res.status(201).json({ data: document })
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static update = async (req, res, next) => {
        try {
            const { id } = req.params
            let dataInBody = req.body
            const category = await Category.findById(id)
            if (!category) {
                res.status(401).json({ msg: `No Category Found with ID ${id}` })
            }
            if (req.userId != category.createdBy) {
                return res.status(401).json({ msg: "You Are Not Allowed To Update This Document" })
            }
            await category.updateOne(dataInBody, { new: true })
            res.status(201).json({ data: category })
        }
        catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static remove = deleteOneFactory(Category)
}

module.exports = CategoryController

