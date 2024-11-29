const { CategoryController } = require("../controller")
const checkAuthrizationCompany = require("../middelware/authenticator")
const { getByIdValidator, createCategoryValidator, updateOrDeletCategoryValidator } = require("../middelware/validator")

const router = require("express").Router()

router.route("/")
    .get(CategoryController.findAll)
    .post(createCategoryValidator, checkAuthrizationCompany, CategoryController.create)
router.route("/:id")
    .get(getByIdValidator, CategoryController.findById)
    .put(updateOrDeletCategoryValidator, checkAuthrizationCompany, CategoryController.update)
    .delete(updateOrDeletCategoryValidator, checkAuthrizationCompany, CategoryController.remove)

module.exports = router