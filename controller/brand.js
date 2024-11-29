const { default: slugify } = require("slugify")
const { Brand } = require("../database/schemas")
const ApiError = require("../utils/apiErrors")
const { findOneFactory, deleteOneFactory, findAllFactory } = require("./handlerFactory")



class BrandController {
    static findAll = findAllFactory(Brand)

    static findById = findOneFactory(Brand)

    static create = async (req, res, next) => {
        try {
            const dataInBody = req.body
            dataInBody.createdBy = req.userId
            dataInBody.slug = slugify(dataInBody.name)
            const brand = await Brand.create(dataInBody)
            if (!brand) return res.status(401).json({ msg: "brand not created" })
            return res.status(201).json({ data: brand })
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static update = async (req, res, next) => {
        try {
            const { id } = req.params
            let dataInBody = req.body
            dataInBody.name ? dataInBody.slug = dataInBody.name : null
            const brand = await Brand.findById(id)
            if (!brand) {
                res.status(401).json({ msg: `No Brand Found with ID ${id}` })
            }
            if (req.userId != brand.createdBy) {
                return res.status(401).json({ msg: "You Are Not Allowed To Update This Document" })
            }
            await brand.updateOne(dataInBody, { new: true })
            return res.status(201).json({ data: brand })
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static remove = deleteOneFactory(Brand)
}

module.exports = BrandController