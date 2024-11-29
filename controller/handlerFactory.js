const ApiFeaturs = require("../utils/apiFeaturs")
const ApiError = require("../utils/apiErrors");


const deleteOneFactory = (model) => async (req, res, next) => {
    const { id } = req.params
    const document = await model.findById(id)
    if (!document) {
        return next(new ApiError("document Not Found", 404))
    }
    if (req.userId != document.createdBy) {
        return res.status(401).json({ msg: "You Are Not Allowed To Delete This Document" })
    }
    await document.deleteOne()
    return res.status(200).json({
        msg: "document Deleted"
    })
}

const findOneFactory = (model) => async (req, res, next) => {
    const { id } = req.params
    const document = await model.findById(id)
    if (!document) {
        return next(new ApiError(`No document Found For ${id}`, 404))
    }
    return res.status(200).json({ data })
}

const findAllFactory = (model) => async (req, res, next) => {
    const countDocuments = await model.countDocuments()
    let apiFeaturs = new ApiFeaturs(req.query, model.find()).paginate(countDocuments).filter().search().limitFields().sort()
    const { paginationResult, mongooseQuery } = apiFeaturs
    const document = await mongooseQuery
    if (!document) {
        return next(new ApiError("document Not Found", 404))
    }
    return res.json({
        pagination: paginationResult,
        data: document
    })
}


module.exports = {
    deleteOneFactory,
    findOneFactory,
    findAllFactory
}