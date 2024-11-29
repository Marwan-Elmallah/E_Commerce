const BrandController = require("../controller/brand")
const checkAuthrizationCompany = require("../middelware/authenticator")
const { getByIdValidator, createBrandValidator, updateOrDeletBrandValidator } = require("../middelware/validator")

const router = require("express").Router()

router.route("/")
    .get(BrandController.findAll)
    .post(createBrandValidator, checkAuthrizationCompany, BrandController.create)
router.route("/:id")
    .get(getByIdValidator, BrandController.findById)
    .put(updateOrDeletBrandValidator, checkAuthrizationCompany, BrandController.update)
    .delete(updateOrDeletBrandValidator, checkAuthrizationCompany, BrandController.remove)

module.exports = router