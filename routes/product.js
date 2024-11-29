const { ProductController } = require("../controller")
const checkAuthrizationCompany = require("../middelware/authenticator")
const { getByIdValidator, createProductValidator, updateOrDeletProductValidator } = require("../middelware/validator")

const router = require("express").Router()

router.route("/")
    .get(ProductController.findAll)
    .post(createProductValidator, checkAuthrizationCompany, ProductController.create)
router.route("/:id")
    .get(getByIdValidator, ProductController.findById)
    .put(updateOrDeletProductValidator, checkAuthrizationCompany, ProductController.update)
    .delete(updateOrDeletProductValidator, checkAuthrizationCompany, ProductController.remove)

module.exports = router